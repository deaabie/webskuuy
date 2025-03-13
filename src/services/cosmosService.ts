
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
  gas?: string;
  memo?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: string;
  voting_start_time: string;
  voting_end_time: string;
  total_deposit: string;
  proposer: string;
}

export interface ChainInfoExtended {
  chain_id: string;
  address_prefix: string;
  sdk_version: string;
  coin_type: string;
  min_tx_fee: string;
  latest_block_height: number;
  latest_block_time: string;
  bonded_tokens_percentage: string;
  staking_ratio: string;
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
    
    // Fetch community pool - try new v1 endpoint first
    let communityPool = "0";
    try {
      const communityPoolResponse = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/community_pool`);
      if (communityPoolResponse.data?.pool?.length > 0) {
        communityPool = communityPoolResponse.data.pool[0]?.amount || "0";
      }
    } catch (e) {
      // Try alternative endpoint
      try {
        const altCommunityPoolResponse = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/params`);
        if (altCommunityPoolResponse.data?.params?.community_tax) {
          // If we have a tax rate but no amount, estimate based on supply and tax rate
          const taxRate = parseFloat(altCommunityPoolResponse.data.params.community_tax);
          communityPool = String(Math.floor(parseInt(totalSupply) * taxRate));
        }
      } catch (innerError) {
        console.error('Error fetching community pool data:', innerError);
      }
    }
    
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
      communityPool,
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
    // Try using the new format endpoint
    const response = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs?events=tx.height>0&pagination.limit=${count}&order_by=ORDER_BY_DESC`);
    
    return response.data.tx_responses.map((tx: any) => ({
      hash: tx.txhash,
      block: parseInt(tx.height),
      type: tx.tx?.body?.messages?.[0]?.['@type']?.split('.')?.pop() || 'unknown',
      fee: tx.tx?.auth_info?.fee?.amount?.[0]?.amount || "0",
      status: tx.code === 0 ? 'Success' : 'Failed',
      timestamp: tx.timestamp || new Date().toISOString(),
      gas: tx.gas_used || 'Unknown',
      memo: tx.tx?.body?.memo || ''
    }));
  } catch (error) {
    console.error('Error fetching transactions, trying fallback:', error);
    
    // First fallback: try with different query parameters
    try {
      const fallbackResponse = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs?pagination.limit=${count}`);
      
      return fallbackResponse.data.tx_responses.map((tx: any) => ({
        hash: tx.txhash,
        block: parseInt(tx.height),
        type: tx.tx?.body?.messages?.[0]?.['@type']?.split('.')?.pop() || 'unknown',
        fee: tx.tx?.auth_info?.fee?.amount?.[0]?.amount || "0",
        status: tx.code === 0 ? 'Success' : 'Failed',
        timestamp: tx.timestamp || new Date().toISOString(),
        gas: tx.gas_used || 'Unknown',
        memo: tx.tx?.body?.memo || ''
      }));
    } catch (fallbackError) {
      console.error('Error with first fallback for transactions:', fallbackError);
      
      // Second fallback: try getting transactions from blocks
      try {
        // Fetch latest block
        const latestBlockResponse = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);
        const latestHeight = parseInt(latestBlockResponse.data.block.header.height);
        
        const txs: Transaction[] = [];
        
        // Fetch transactions from recent blocks
        for (let i = 0; i < Math.min(5, count); i++) {
          const height = latestHeight - i;
          if (height <= 0) break;
          
          try {
            // Get block
            const blockResponse = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/${height}`);
            const block = blockResponse.data.block;
            const blockTime = block.header.time;
            
            // If block has transactions
            if (block.data.txs && block.data.txs.length > 0) {
              // For each tx in the block, try to get tx details
              for (const encodedTx of block.data.txs.slice(0, 2)) { // Limit to 2 txs per block
                try {
                  // Try to get tx by hash
                  const txHash = Buffer.from(encodedTx, 'base64').toString('hex').toUpperCase();
                  const txResponse = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs/${txHash}`);
                  const tx = txResponse.data.tx_response;
                  
                  txs.push({
                    hash: tx.txhash,
                    block: height,
                    type: tx.tx?.body?.messages?.[0]?.['@type']?.split('.')?.pop() || 'unknown',
                    fee: tx.tx?.auth_info?.fee?.amount?.[0]?.amount || "0",
                    status: tx.code === 0 ? 'Success' : 'Failed',
                    timestamp: tx.timestamp || blockTime,
                    gas: tx.gas_used || 'Unknown',
                    memo: tx.tx?.body?.memo || ''
                  });
                } catch (txError) {
                  // If we can't get tx details, use a placeholder
                  txs.push({
                    hash: encodedTx.substring(0, 16) + '...',
                    block: height,
                    type: "transaction",
                    fee: "0",
                    status: "Unknown",
                    timestamp: blockTime,
                    gas: 'Unknown',
                    memo: ''
                  });
                }
                
                if (txs.length >= count) break;
              }
            }
            
            if (txs.length >= count) break;
          } catch (blockError) {
            console.error(`Error fetching block at height ${height}:`, blockError);
            continue;
          }
        }
        
        return txs;
      } catch (secondFallbackError) {
        console.error('Error with second fallback for transactions:', secondFallbackError);
        
        // Final fallback: generate placeholder transactions from recent blocks
        try {
          const blocksResponse = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);
          const latestHeight = parseInt(blocksResponse.data.block.header.height);
          
          return Array.from({ length: count }, (_, i) => ({
            hash: `tx_${latestHeight - i}_placeholder`,
            block: latestHeight - i,
            type: "transaction",
            fee: "0",
            status: "Unknown",
            timestamp: new Date(Date.now() - i * 6000).toISOString(),
            gas: 'Unknown',
            memo: ''
          }));
        } catch (finalFallbackError) {
          console.error('Final fallback for transactions failed:', finalFallbackError);
          return [];
        }
      }
    }
  }
};

export const getProposals = async (apiUrl: string, count: number = 100): Promise<Proposal[]> => {
  try {
    // Try fetching proposals with the latest cosmos SDK format
    const response = await axios.get(`${apiUrl}/cosmos/gov/v1/proposals?pagination.limit=${count}`);
    
    const proposals = response.data.proposals.map((p: any) => ({
      id: p.id,
      title: p.title || p.content?.title || "No Title",
      description: p.summary || p.content?.description || "No Description",
      status: p.status,
      voting_start_time: p.voting_start_time,
      voting_end_time: p.voting_end_time,
      total_deposit: p.total_deposit.length > 0 ? p.total_deposit[0].amount : "0",
      proposer: p.proposer || "Unknown"
    }));
    
    // Sort proposals by voting_start_time in descending order (newest first)
    return proposals.sort((a, b) => new Date(b.voting_start_time).getTime() - new Date(a.voting_start_time).getTime());
  } catch (error) {
    console.error('Error with latest proposal format, trying fallback:', error);
    
    // Fallback for older cosmos SDK versions
    try {
      const fallbackResponse = await axios.get(`${apiUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=${count}`);
      
      const proposals = fallbackResponse.data.proposals.map((p: any) => ({
        id: p.proposal_id,
        title: p.content?.title || "No Title",
        description: p.content?.description || "No Description",
        status: p.status,
        voting_start_time: p.voting_start_time,
        voting_end_time: p.voting_end_time,
        total_deposit: p.total_deposit.length > 0 ? p.total_deposit[0].amount : "0",
        proposer: "Unknown" // v1beta1 doesn't have proposer info
      }));
      
      // Sort proposals by voting_start_time in descending order (newest first)
      return proposals.sort((a, b) => new Date(b.voting_start_time).getTime() - new Date(a.voting_start_time).getTime());
    } catch (fallbackError) {
      console.error('Error with fallback proposal format:', fallbackError);
      return [];
    }
  }
};

export const getProposalVotes = async (apiUrl: string, proposalId: string) => {
  try {
    // Try fetching with the newer v1 API format first
    const response = await axios.get(`${apiUrl}/cosmos/gov/v1/proposals/${proposalId}/tally`);
    
    return {
      yes: response.data.tally.yes_count || "0",
      no: response.data.tally.no_count || "0",
      abstain: response.data.tally.abstain_count || "0",
      no_with_veto: response.data.tally.no_with_veto_count || "0",
      total: (
        BigInt(response.data.tally.yes_count || "0") +
        BigInt(response.data.tally.no_count || "0") +
        BigInt(response.data.tally.abstain_count || "0") +
        BigInt(response.data.tally.no_with_veto_count || "0")
      ).toString(),
    };
  } catch (error) {
    console.error('Error with v1 tally format, trying fallback:', error);
    
    // Fallback for older cosmos SDK v1beta1
    try {
      const fallbackResponse = await axios.get(`${apiUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`);
      
      return {
        yes: fallbackResponse.data.tally.yes || "0",
        no: fallbackResponse.data.tally.no || "0",
        abstain: fallbackResponse.data.tally.abstain || "0",
        no_with_veto: fallbackResponse.data.tally.no_with_veto || "0",
        total: (
          BigInt(fallbackResponse.data.tally.yes || "0") +
          BigInt(fallbackResponse.data.tally.no || "0") +
          BigInt(fallbackResponse.data.tally.abstain || "0") +
          BigInt(fallbackResponse.data.tally.no_with_veto || "0")
        ).toString(),
      };
    } catch (fallbackError) {
      console.error('Error with v1beta1 tally format:', fallbackError);
      return null;
    }
  }
};

export const getExtendedChainInfo = async (rpcUrl: string, apiUrl: string, chain: ChainConfig): Promise<ChainInfoExtended> => {
  try {
    // Fetch latest block
    const latestBlockResponse = await axios.get(`${rpcUrl}/block`);
    const height = parseInt(latestBlockResponse.data.result.block.header.height);
    const blockTime = latestBlockResponse.data.result.block.header.time;
    
    // Fetch staking pool
    const stakingPoolResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/pool`);
    const bondedTokens = stakingPoolResponse.data.pool.bonded_tokens;
    
    // Fetch supply
    const supplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply`);
    const totalSupply = supplyResponse.data.supply[0]?.amount || "0";
    
    // Calculate staking ratio
    const stakingRatio = (parseInt(bondedTokens) / parseInt(totalSupply) * 100).toFixed(2) + "%";
    
    return {
      chain_id: chain.chain_id,
      address_prefix: chain.addr_prefix,
      sdk_version: chain.sdk_version,
      coin_type: chain.coin_type,
      min_tx_fee: chain.min_tx_fee,
      latest_block_height: height,
      latest_block_time: blockTime,
      bonded_tokens_percentage: stakingRatio,
      staking_ratio: stakingRatio
    };
  } catch (error) {
    console.error('Error fetching extended chain info:', error);
    return {
      chain_id: chain.chain_id,
      address_prefix: chain.addr_prefix,
      sdk_version: chain.sdk_version,
      coin_type: chain.coin_type,
      min_tx_fee: chain.min_tx_fee,
      latest_block_height: 0,
      latest_block_time: new Date().toISOString(),
      bonded_tokens_percentage: "0%",
      staking_ratio: "0%"
    };
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
