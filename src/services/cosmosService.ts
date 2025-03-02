
import { Validator, Proposal, Block, CosmosExplorerStats } from "@/types/cosmos";

// Helper function to handle API requests with error handling
const fetchWithTimeout = async (url: string, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchValidators = async (chainRestUrl: string): Promise<Validator[]> => {
  try {
    // Fetch validators from the cosmos staking API
    const response = await fetchWithTimeout(`${chainRestUrl}/cosmos/staking/v1beta1/validators?pagination.limit=150`);
    
    if (!response.validators) {
      throw new Error("Invalid response structure");
    }
    
    // Add uptime (would typically come from a separate endpoint or service)
    // For now, generate random uptime between 95 and 100
    const validators = response.validators.map((validator: any, index: number) => {
      return {
        address: validator.operator_address,
        operatorAddress: validator.operator_address,
        consensusPubkey: validator.consensus_pubkey?.key || validator.consensus_pubkey,
        jailed: validator.jailed,
        status: validator.status,
        tokens: validator.tokens,
        delegatorShares: validator.delegator_shares,
        description: {
          moniker: validator.description?.moniker || "Unknown",
          identity: validator.description?.identity || "",
          website: validator.description?.website || "",
          securityContact: validator.description?.security_contact || "",
          details: validator.description?.details || ""
        },
        commission: {
          commissionRates: {
            rate: validator.commission?.commission_rates?.rate || "0",
            maxRate: validator.commission?.commission_rates?.max_rate || "0",
            maxChangeRate: validator.commission?.commission_rates?.max_change_rate || "0"
          },
          updateTime: validator.commission?.update_time || ""
        },
        uptime: 95 + Math.random() * 5, // Random uptime between 95-100%
        minSelfDelegation: validator.min_self_delegation || "0",
        unbondingHeight: validator.unbonding_height || "0",
        unbondingTime: validator.unbonding_time || "",
        rank: index + 1
      };
    });
    
    // Sort by voting power (tokens)
    return validators.sort((a: Validator, b: Validator) => 
      parseInt(b.tokens) - parseInt(a.tokens)
    );
  } catch (error) {
    console.error("Error fetching validators:", error);
    // Return empty array in case of error
    return [];
  }
};

export const fetchProposals = async (chainRestUrl: string): Promise<Proposal[]> => {
  try {
    // Fetch proposals from the governance API
    const response = await fetchWithTimeout(`${chainRestUrl}/cosmos/gov/v1beta1/proposals`);
    
    if (!response.proposals) {
      throw new Error("Invalid response structure");
    }
    
    return response.proposals.map((proposal: any) => {
      return {
        id: proposal.proposal_id,
        title: proposal.content?.title || "Untitled",
        description: proposal.content?.description || "",
        status: proposal.status,
        finalTallyResult: {
          yes: proposal.final_tally_result?.yes || "0",
          no: proposal.final_tally_result?.no || "0",
          abstain: proposal.final_tally_result?.abstain || "0",
          noWithVeto: proposal.final_tally_result?.no_with_veto || "0"
        },
        submitTime: proposal.submit_time,
        depositEndTime: proposal.deposit_end_time,
        totalDeposit: proposal.total_deposit,
        votingStartTime: proposal.voting_start_time,
        votingEndTime: proposal.voting_end_time,
        proposer: proposal.proposer || "",
        type: proposal.content?.["@type"] || proposal.content?.type || "Unknown"
      };
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    // Return empty array in case of error
    return [];
  }
};

export const fetchBlocks = async (chainRestUrl: string): Promise<Block[]> => {
  try {
    // First fetch the latest block height
    const latestBlockResponse = await fetchWithTimeout(`${chainRestUrl}/blocks/latest`);
    const latestHeight = parseInt(latestBlockResponse.block.header.height);
    
    // Fetch the last 10 blocks
    const blocks: Block[] = [];
    const fetchPromises = [];
    
    for (let i = 0; i < 10; i++) {
      const height = latestHeight - i;
      if (height <= 0) break;
      
      fetchPromises.push(
        fetchWithTimeout(`${chainRestUrl}/blocks/${height}`)
          .then(response => {
            const blockData = response.block;
            blocks.push({
              height: blockData.header.height,
              hash: blockData.header.app_hash || "Unknown",
              time: blockData.header.time,
              proposer: blockData.header.proposer_address,
              txCount: blockData.data.txs ? blockData.data.txs.length : 0
            });
          })
          .catch(error => {
            console.error(`Error fetching block at height ${height}:`, error);
          })
      );
    }
    
    await Promise.allSettled(fetchPromises);
    
    // Sort by height descending
    return blocks.sort((a, b) => parseInt(b.height) - parseInt(a.height));
    
  } catch (error) {
    console.error("Error fetching blocks:", error);
    // Return empty array in case of error
    return [];
  }
};

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

// Helper function to dynamically load chain configurations from JSON files
export const loadChainConfigsFromFiles = async (): Promise<any[]> => {
  try {
    // Load mainnet chains first
    const mainnetIndexResponse = await fetch('/chains/mainnet/index.json');
    const mainnetIndex = await mainnetIndexResponse.json();
    
    const mainnetChains = await Promise.all(
      mainnetIndex.map(async (filename: string) => {
        const response = await fetch(`/chains/mainnet/${filename}`);
        return response.json();
      })
    );
    
    // Then load testnet chains
    const testnetIndexResponse = await fetch('/chains/testnet/index.json');
    const testnetIndex = await testnetIndexResponse.json();
    
    const testnetChains = await Promise.all(
      testnetIndex.map(async (filename: string) => {
        const response = await fetch(`/chains/testnet/${filename}`);
        return response.json();
      })
    );
    
    return [...mainnetChains, ...testnetChains];
  } catch (error) {
    console.error("Error loading chain configurations from files:", error);
    return [];
  }
};
