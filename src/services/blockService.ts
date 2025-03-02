
import { Block } from "@/types/cosmos";
import { fetchWithTimeout } from "./utils/apiUtils";

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
