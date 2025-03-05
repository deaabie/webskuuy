
import { useToast } from "@/hooks/use-toast";

// Define types for blockchain data
export interface BlockchainStats {
  height: number;
  validators: {
    total: number;
    active: number;
    list?: ValidatorInfo[];
  };
  supply: string;
  bondedTokens: string;
  inflation: string;
  communityPool: string;
}

export interface BlockInfo {
  height: number;
  hash: string;
  proposer: string;
  proposerAddress: string;
  txCount: number;
  time: string;
}

export interface TransactionInfo {
  hash: string;
  height: number;
  status: "success" | "failed";
  messages: number;
  fee: string;
  time: string;
  type?: string;
}

export interface ValidatorInfo {
  address: string;
  moniker: string;
  votingPower: string;
  commission: string;
  status: "active" | "inactive" | "jailed";
  uptime: number;
  identity?: string;
  website?: string;
}

// Fetch blockchain stats from RPC endpoints
export const fetchBlockchainStats = async (rpcUrl: string, apiUrl: string): Promise<BlockchainStats> => {
  try {
    console.log(`Fetching blockchain stats from ${rpcUrl}`);
    
    // Fetch latest block
    const blockResponse = await fetch(`${rpcUrl}/block`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!blockResponse.ok) {
      throw new Error(`Failed to fetch latest block: ${blockResponse.statusText}`);
    }
    
    const blockData = await blockResponse.json();
    const latestHeight = blockData.result.block.header.height;
    
    // Fetch validators
    const validatorsResponse = await fetch(`${rpcUrl}/validators?height=${latestHeight}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!validatorsResponse.ok) {
      throw new Error(`Failed to fetch validators: ${validatorsResponse.statusText}`);
    }
    
    const validatorsData = await validatorsResponse.json();
    const totalValidators = validatorsData.result.total;
    
    // For supply and inflation, we would typically use API endpoints
    // For this implementation, we'll use sample data or API if available
    let supply = "0";
    let bondedTokens = "0";
    let inflation = "0%";
    let communityPool = "0";
    
    try {
      // Try to fetch from API for these stats (example endpoints, may vary by chain)
      const supplyResponse = await fetch(`${apiUrl}/cosmos/bank/v1beta1/supply`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (supplyResponse.ok) {
        const supplyData = await supplyResponse.json();
        if (supplyData?.supply && supplyData.supply.length > 0) {
          // Format supply from smallest unit to display unit (example for ATOM)
          const mainSupply = supplyData.supply[0];
          if (mainSupply && mainSupply.amount) {
            const amount = parseInt(mainSupply.amount);
            supply = (amount / 1000000).toLocaleString(); // Adjust denominator based on exponent
          }
        }
      }
      
      // Fetch staking pool for bonded tokens
      const stakingResponse = await fetch(`${apiUrl}/cosmos/staking/v1beta1/pool`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (stakingResponse.ok) {
        const stakingData = await stakingResponse.json();
        if (stakingData?.pool?.bonded_tokens) {
          const bonded = parseInt(stakingData.pool.bonded_tokens);
          bondedTokens = (bonded / 1000000).toLocaleString(); // Adjust denominator based on exponent
        }
      }
      
      // Fetch inflation (if available)
      const inflationResponse = await fetch(`${apiUrl}/cosmos/mint/v1beta1/inflation`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (inflationResponse.ok) {
        const inflationData = await inflationResponse.json();
        if (inflationData?.inflation) {
          const inflationValue = parseFloat(inflationData.inflation) * 100;
          inflation = `${inflationValue.toFixed(1)}%`;
        }
      }
      
      // Fetch community pool
      const communityPoolResponse = await fetch(`${apiUrl}/cosmos/distribution/v1beta1/community_pool`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (communityPoolResponse.ok) {
        const communityPoolData = await communityPoolResponse.json();
        if (communityPoolData?.pool && communityPoolData.pool.length > 0) {
          const poolAmount = parseFloat(communityPoolData.pool[0].amount);
          communityPool = `${(poolAmount / 1000000).toLocaleString()} ATOM`; // Adjust based on denom
        }
      }
      
    } catch (error) {
      console.error("Failed to fetch extended stats:", error);
      // Continue with default values if API fails
    }
    
    return {
      height: parseInt(latestHeight),
      validators: {
        total: parseInt(totalValidators),
        active: 0, // We would calculate this from validator statuses
      },
      supply,
      bondedTokens,
      inflation,
      communityPool,
    };
    
  } catch (error) {
    console.error("Error fetching blockchain stats:", error);
    throw error;
  }
};

// Fetch validator list
export const fetchValidators = async (apiUrl: string): Promise<ValidatorInfo[]> => {
  try {
    console.log(`Fetching validators from ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch validators: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.validators || !Array.isArray(data.validators)) {
      return [];
    }
    
    return data.validators.map((validator: any) => ({
      address: validator.operator_address,
      moniker: validator.description.moniker,
      votingPower: (parseInt(validator.tokens) / 1000000).toLocaleString(), // Adjust denominator based on exponent
      commission: `${(parseFloat(validator.commission.commission_rates.rate) * 100).toFixed(2)}%`,
      status: validator.status === 3 ? "active" : "inactive",
      uptime: 100, // Would need separate API call for this
      identity: validator.description.identity,
      website: validator.description.website
    }));
    
  } catch (error) {
    console.error("Error fetching validators:", error);
    return [];
  }
};

// Fetch recent blocks
export const fetchRecentBlocks = async (rpcUrl: string): Promise<BlockInfo[]> => {
  try {
    console.log(`Fetching recent blocks from ${rpcUrl}`);
    
    // Get the latest block first
    const latestBlockResponse = await fetch(`${rpcUrl}/block`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!latestBlockResponse.ok) {
      throw new Error(`Failed to fetch latest block: ${latestBlockResponse.statusText}`);
    }
    
    const latestBlockData = await latestBlockResponse.json();
    const latestHeight = parseInt(latestBlockData.result.block.header.height);
    
    // Now fetch the last 10 blocks
    const blocks: BlockInfo[] = [];
    const fetchPromises = [];
    
    for (let i = 0; i < 10; i++) {
      const height = latestHeight - i;
      if (height <= 0) break;
      
      fetchPromises.push(
        fetch(`${rpcUrl}/block?height=${height}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch block at height ${height}`);
          }
          return response.json();
        })
        .then(data => {
          const block = data.result.block;
          const blockTime = new Date(block.header.time);
          
          blocks.push({
            height,
            hash: block.header.last_block_id.hash,
            proposer: block.header.proposer_address, // Would need validator lookup for human-readable name
            proposerAddress: block.header.proposer_address,
            txCount: block.data.txs ? block.data.txs.length : 0,
            time: blockTime.toLocaleString()
          });
        })
        .catch(error => {
          console.error(`Error fetching block at height ${height}:`, error);
        })
      );
    }
    
    await Promise.all(fetchPromises);
    
    // Sort by height in descending order
    return blocks.sort((a, b) => b.height - a.height);
    
  } catch (error) {
    console.error("Error fetching recent blocks:", error);
    return [];
  }
};

// Fetch recent transactions
export const fetchRecentTransactions = async (apiUrl: string): Promise<TransactionInfo[]> => {
  try {
    console.log(`Fetching recent transactions from ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/cosmos/tx/v1beta1/txs?pagination.limit=10&order_by=ORDER_BY_DESC`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.tx_responses || !Array.isArray(data.tx_responses)) {
      return [];
    }
    
    return data.tx_responses.map((tx: any) => ({
      hash: tx.txhash,
      height: parseInt(tx.height),
      status: tx.code === 0 ? "success" : "failed",
      messages: tx.tx.body.messages.length,
      fee: tx.tx.auth_info.fee.amount.length > 0 
        ? `${parseInt(tx.tx.auth_info.fee.amount[0].amount) / 1000000} ${tx.tx.auth_info.fee.amount[0].denom.substring(1).toUpperCase()}`
        : "0",
      time: new Date(tx.timestamp).toLocaleString(),
      type: tx.tx.body.messages.length > 0 ? tx.tx.body.messages[0]["@type"].split('.').pop() : "Unknown"
    }));
    
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return [];
  }
};

// Polling function to get real-time updates
export const startPollingUpdates = (
  rpcUrl: string, 
  apiUrl: string, 
  interval: number,
  onStatsUpdate: (stats: BlockchainStats) => void,
  onValidatorsUpdate?: (validators: ValidatorInfo[]) => void,
  onBlocksUpdate?: (blocks: BlockInfo[]) => void,
  onTransactionsUpdate?: (transactions: TransactionInfo[]) => void
) => {
  // Initial fetch
  fetchBlockchainStats(rpcUrl, apiUrl)
    .then(stats => onStatsUpdate(stats))
    .catch(error => console.error("Initial stats fetch failed:", error));
  
  if (onValidatorsUpdate) {
    fetchValidators(apiUrl)
      .then(validators => onValidatorsUpdate(validators))
      .catch(error => console.error("Initial validators fetch failed:", error));
  }
  
  if (onBlocksUpdate) {
    fetchRecentBlocks(rpcUrl)
      .then(blocks => onBlocksUpdate(blocks))
      .catch(error => console.error("Initial blocks fetch failed:", error));
  }
  
  if (onTransactionsUpdate) {
    fetchRecentTransactions(apiUrl)
      .then(transactions => onTransactionsUpdate(transactions))
      .catch(error => console.error("Initial transactions fetch failed:", error));
  }
  
  // Set up polling interval
  const intervalId = setInterval(() => {
    fetchBlockchainStats(rpcUrl, apiUrl)
      .then(stats => onStatsUpdate(stats))
      .catch(error => console.error("Stats polling failed:", error));
    
    if (onValidatorsUpdate) {
      fetchValidators(apiUrl)
        .then(validators => onValidatorsUpdate(validators))
        .catch(error => console.error("Validators polling failed:", error));
    }
    
    if (onBlocksUpdate) {
      fetchRecentBlocks(rpcUrl)
        .then(blocks => onBlocksUpdate(blocks))
        .catch(error => console.error("Blocks polling failed:", error));
    }
    
    if (onTransactionsUpdate) {
      fetchRecentTransactions(apiUrl)
        .then(transactions => onTransactionsUpdate(transactions))
        .catch(error => console.error("Transactions polling failed:", error));
    }
  }, interval);
  
  // Return a cleanup function
  return () => clearInterval(intervalId);
};
