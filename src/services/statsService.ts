
import { CosmosExplorerStats } from "@/types/cosmos";
import { fetchWithTimeout } from "./utils/apiUtils";

export const fetchStats = async (chainRestUrl: string): Promise<CosmosExplorerStats> => {
  try {
    // Create an object to store all stats
    const stats: CosmosExplorerStats = {
      blockHeight: "0",
      blockTime: "0",
      totalValidators: 0,
      activeValidators: 0,
      totalProposals: 0,
      activeProposals: 0,
      bondedTokens: "0",
      totalSupply: "0",
      communityPool: "0",
      inflation: "0"
    };
    
    // Get latest block
    const latestBlockResponse = await fetchWithTimeout(`${chainRestUrl}/blocks/latest`);
    stats.blockHeight = latestBlockResponse.block.header.height;
    
    // Get block time by comparing two recent blocks
    try {
      const prevBlockHeight = parseInt(stats.blockHeight) - 10;
      const prevBlockResponse = await fetchWithTimeout(`${chainRestUrl}/blocks/${prevBlockHeight}`);
      
      const latestTime = new Date(latestBlockResponse.block.header.time).getTime();
      const prevTime = new Date(prevBlockResponse.block.header.time).getTime();
      
      const timePerBlocks = (latestTime - prevTime) / 10 / 1000; // in seconds
      stats.blockTime = timePerBlocks.toFixed(2);
    } catch (error) {
      console.error("Error calculating block time:", error);
      stats.blockTime = "6.0"; // fallback
    }
    
    // Get validators count
    try {
      const validatorsResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/staking/v1beta1/validators?pagination.limit=1&pagination.count_total=true`);
      stats.totalValidators = validatorsResponse.pagination.total;
      
      const bondedValidatorsResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/staking/v1beta1/validators?pagination.limit=1&pagination.count_total=true&status=BOND_STATUS_BONDED`);
      stats.activeValidators = bondedValidatorsResponse.pagination.total;
    } catch (error) {
      console.error("Error fetching validator stats:", error);
    }
    
    // Get proposal count
    try {
      const proposalsResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=1&pagination.count_total=true`);
      stats.totalProposals = proposalsResponse.pagination.total;
      
      const activeProposalsResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=1&pagination.count_total=true&proposal_status=PROPOSAL_STATUS_VOTING_PERIOD`);
      stats.activeProposals = activeProposalsResponse.pagination.total;
    } catch (error) {
      console.error("Error fetching proposal stats:", error);
    }
    
    // Get staking pool info
    try {
      const stakingPoolResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/staking/v1beta1/pool`);
      stats.bondedTokens = stakingPoolResponse.pool.bonded_tokens;
    } catch (error) {
      console.error("Error fetching staking pool:", error);
    }
    
    // Get supply info
    try {
      const supplyResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/bank/v1beta1/supply/by_denom?denom=uatom`);
      stats.totalSupply = supplyResponse.amount.amount;
    } catch (error) {
      console.error("Error fetching supply info:", error);
    }
    
    // Get community pool
    try {
      const communityPoolResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/distribution/v1beta1/community_pool`);
      const uatomPool = communityPoolResponse.pool.find((coin: any) => coin.denom === "uatom");
      if (uatomPool) {
        // Convert from decimal to integer representation
        stats.communityPool = (parseFloat(uatomPool.amount) * 1000000).toString();
      }
    } catch (error) {
      console.error("Error fetching community pool:", error);
    }
    
    // Get inflation
    try {
      const inflationResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/mint/v1beta1/inflation`);
      // Convert from decimal (e.g., 0.0753) to percentage string (e.g., "7.53")
      stats.inflation = (parseFloat(inflationResponse.inflation) * 100).toFixed(2);
    } catch (error) {
      console.error("Error fetching inflation:", error);
      try {
        // Try alternative endpoint for chains using the older structure
        const inflationResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/mint/v1beta1/annual_provisions`);
        const totalSupplyResponse = await fetchWithTimeout(`${chainRestUrl}/cosmos/bank/v1beta1/supply/by_denom?denom=uatom`);
        
        const annualProvisions = parseFloat(inflationResponse.annual_provisions);
        const totalSupply = parseFloat(totalSupplyResponse.amount.amount);
        
        if (totalSupply > 0) {
          stats.inflation = ((annualProvisions / totalSupply) * 100).toFixed(2);
        }
      } catch (innerError) {
        console.error("Error fetching alternative inflation data:", innerError);
      }
    }
    
    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Return default stats in case of error
    return {
      blockHeight: "0",
      blockTime: "0",
      totalValidators: 0,
      activeValidators: 0,
      totalProposals: 0,
      activeProposals: 0,
      bondedTokens: "0",
      totalSupply: "0",
      communityPool: "0",
      inflation: "0"
    };
  }
};
