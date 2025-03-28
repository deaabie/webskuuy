
import { ChainConfig } from './types';

/**
 * Fetches chain configurations based on network type
 */
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

/**
 * Checks if an endpoint is accessible
 */
export const checkEndpointStatus = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Gets extended chain information combining static and on-chain data
 */
export const getExtendedChainInfo = async (rpcUrl: string, apiUrl: string, chain: ChainConfig): Promise<ChainInfoExtended> => {
  try {
    // Fetch latest block
    const blockResponse = await fetch(`${rpcUrl}/block`);
    const blockData = await blockResponse.json();
    const height = parseInt(blockData.result.block.header.height);
    const blockTime = blockData.result.block.header.time;
    
    // Fetch staking pool
    const stakingPoolResponse = await fetch(`${apiUrl}/cosmos/staking/v1beta1/pool`);
    const stakingPoolData = await stakingPoolResponse.json();
    const bondedTokens = stakingPoolData.pool.bonded_tokens;
    
    // Fetch supply
    const supplyResponse = await fetch(`${apiUrl}/cosmos/bank/v1beta1/supply`);
    const supplyData = await supplyResponse.json();
    const totalSupply = supplyData.supply[0]?.amount || "0";
    
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
