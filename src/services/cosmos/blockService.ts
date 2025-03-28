
import axios from 'axios';
import { Block } from './types';

/**
 * Fetches recent blocks from a Cosmos blockchain
 */
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
