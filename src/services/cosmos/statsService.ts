
import axios from 'axios';
import { BlockchainStats } from './types';

/**
 * Fetches comprehensive blockchain statistics
 */
export const getBlockchainStats = async (rpcUrl: string, apiUrl: string): Promise<BlockchainStats> => {
  try {
    // Fetch latest block
    const latestBlockResponse = await axios.get(`${rpcUrl}/block`);
    const height = latestBlockResponse.data.result.block.header.height;
    const latestBlockTime = new Date(latestBlockResponse.data.result.block.header.time).getTime();
    
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
    
    // Calculate block time more accurately by fetching multiple blocks
    let blockTime = 6; // Default if we can't calculate
    try {
      const currentBlockHeight = parseInt(height);
      // Get more blocks for a more accurate average (20 blocks instead of 10)
      const sampleSize = 20;
      const oldBlockHeight = Math.max(1, currentBlockHeight - sampleSize);
      
      // Get the oldest block in our sample
      const oldBlockResponse = await axios.get(`${rpcUrl}/block?height=${oldBlockHeight}`);
      const oldBlockTime = new Date(oldBlockResponse.data.result.block.header.time).getTime();
      
      // Calculate the average time between blocks if we have a valid timespan
      if (latestBlockTime > oldBlockTime) {
        const timeDiffMs = latestBlockTime - oldBlockTime;
        const blockCount = currentBlockHeight - oldBlockHeight;
        
        if (blockCount > 0) {
          // Calculate average time per block in seconds with 1 decimal point precision
          blockTime = Math.round((timeDiffMs / blockCount) / 100) / 10;
        }
      }
      
      console.log(`Block time calculation: ${blockTime}s (based on ${sampleSize} blocks)`);
    } catch (error) {
      console.error('Error calculating block time:', error);
    }
    
    // Calculate staking APR
    let stakingAPR = 0;
    try {
      if (parseInt(bondedTokens) > 0 && parseInt(totalSupply) > 0) {
        const bondedRatio = parseInt(bondedTokens) / parseInt(totalSupply);
        stakingAPR = inflation / bondedRatio;
      }
    } catch (error) {
      console.error('Error calculating staking APR:', error);
    }
    
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
      blockTime: blockTime,
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
