
import axios from 'axios';

export interface ChainConfig {
  chain_name: string;
  display_name: string;
  chain_id: string;
  api: {provider: string; address: string}[];
  rpc: {provider: string; address: string}[];
  sdk_version: string;
  keplr_features?: string[];
  coin_type: string;
  min_tx_fee: string;
  addr_prefix: string;
  logo: string;
  assets: {
    base: string;
    symbol: string;
    exponent: string;
    coingecko_id: string;
    logo: string;
  }[];
}

export interface BlockchainStats {
  height: number;
  validators: {
    total: number;
    active: number;
  };
  supply: {
    total: string;
    circulating: string;
  };
  blockTime: number;
  communityPool: string;
  inflation: string;
  stakingAPR: string;
}

export interface Validator {
  address: string;
  moniker: string;
  voting_power: string;
  commission: string;
  status: string;
  uptime: string;
}

export interface Block {
  height: number;
  hash: string;
  proposer: string;
  txs: number;
  timestamp: string;
}

export interface Transaction {
  hash: string;
  block: number;
  type: string;
  fee: string;
  status: string;
  timestamp: string;
}

export const getChainConfigs = async (networkType: 'mainnet' | 'testnet'): Promise<ChainConfig[]> => {
  try {
    let context;
    
    if (networkType === 'mainnet') {
      context = import.meta.glob('/src/data/chains/mainnet/*.json', { eager: true });
    } else if (networkType === 'testnet') {
      context = import.meta.glob('/src/data/chains/testnet/*.json', { eager: true });
    } else {
      return [];
    }
    
    return Object.values(context).map((module: any) => module.default || module);
  } catch (error) {
    console.error(`Error loading ${networkType} chain configs:`, error);
    return [];
  }
};

export const getBlockchainStats = async (rpcUrl: string, apiUrl: string): Promise<BlockchainStats> => {
  try {
    // Fetch latest block
    const latestBlockResponse = await axios.get(`${rpcUrl}/block`);
    const height = latestBlockResponse.data.result.block.header.height;
    
    // Fetch validators
    const validatorsResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100`);
    const validatorsCount = validatorsResponse.data.validators.length;
    
    // Fetch staking params
    const stakingParamsResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/params`);
    const bondedTokensResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/pool`);
    const bondedTokens = bondedTokensResponse.data.pool.bonded_tokens;
    
    // Fetch supply
    const supplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply`);
    const totalSupply = supplyResponse.data.supply[0]?.amount || "0";
    
    // Fetch inflation
    const inflationResponse = await axios.get(`${apiUrl}/cosmos/mint/v1beta1/inflation`).catch(() => ({ data: { inflation: "0" } }));
    const inflation = parseFloat(inflationResponse.data.inflation || "0") * 100;
    
    // Estimate block time (use 6s as default for Cosmos chains)
    const blockTime = 6;
    
    // Calculate staking APR
    const stakingAPR = (inflation / (parseInt(bondedTokens) / parseInt(totalSupply))) * 100 || 0;
    
    return {
      height: parseInt(height),
      validators: {
        total: validatorsCount,
        active: validatorsCount,
      },
      supply: {
        total: totalSupply,
        circulating: totalSupply,
      },
      blockTime,
      communityPool: "0",
      inflation: inflation.toFixed(2) + "%",
      stakingAPR: stakingAPR.toFixed(2) + "%",
    };
  } catch (error) {
    console.error('Error fetching blockchain stats:', error);
    return {
      height: 0,
      validators: {
        total: 0,
        active: 0,
      },
      supply: {
        total: "0",
        circulating: "0",
      },
      blockTime: 0,
      communityPool: "0",
      inflation: "0%",
      stakingAPR: "0%",
    };
  }
};

export const getValidators = async (apiUrl: string): Promise<Validator[]> => {
  try {
    // Fetch up to 500 validators with pagination to ensure we get all active validators
    const response = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators?pagination.limit=500`);
    
    return response.data.validators.map((v: any) => ({
      address: v.operator_address,
      moniker: v.description.moniker || "Unknown",
      voting_power: v.tokens || "0",
      commission: (parseFloat(v.commission.commission_rates.rate) * 100).toFixed(2) + "%",
      status: v.status === 'BOND_STATUS_BONDED' ? 'Active' : 'Inactive',
      uptime: "100%", // This would require additional data
    }));
  } catch (error) {
    console.error('Error fetching validators:', error);
    return [];
  }
};

export const getBlocks = async (rpcUrl: string, count: number = 10): Promise<Block[]> => {
  try {
    const latestBlockResponse = await axios.get(`${rpcUrl}/block`);
    const latestHeight = parseInt(latestBlockResponse.data.result.block.header.height);
    
    const blocks: Block[] = [];
    
    for (let i = 0; i < count; i++) {
      const height = latestHeight - i;
      if (height <= 0) break;
      
      const blockResponse = await axios.get(`${rpcUrl}/block?height=${height}`);
      const block = blockResponse.data.result.block;
      
      blocks.push({
        height,
        hash: block.header.app_hash,
        proposer: block.header.proposer_address,
        txs: block.data.txs ? block.data.txs.length : 0,
        timestamp: block.header.time,
      });
    }
    
    return blocks;
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return [];
  }
};

export const getTransactions = async (apiUrl: string, count: number = 10): Promise<Transaction[]> => {
  try {
    const response = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs?pagination.limit=${count}`);
    
    return response.data.tx_responses.map((tx: any) => ({
      hash: tx.txhash,
      block: parseInt(tx.height),
      type: tx.tx.body.messages[0]['@type'].split('.').pop(),
      fee: tx.tx.auth_info.fee.amount[0]?.amount || "0",
      status: tx.code === 0 ? 'Success' : 'Failed',
      timestamp: tx.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const checkEndpointStatus = async (url: string): Promise<boolean> => {
  try {
    await axios.get(url, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
};
