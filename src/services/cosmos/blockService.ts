
import axios from 'axios';
import { Block, Validator } from './types';

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

/**
 * Fetches blocks with validator monikers for proposers
 */
export const getBlocksWithValidators = async (rpcUrl: string, apiUrl: string, count: number = 10): Promise<Block[]> => {
  try {
    // First fetch blocks
    const blocks = await getBlocks(rpcUrl, count);
    
    // If no blocks or no API URL provided, return blocks as is
    if (blocks.length === 0 || !apiUrl) {
      return blocks;
    }
    
    // Try to get validator information to map proposer addresses to monikers
    try {
      // Fetch validator set to get consensus addresses
      const validatorSetResponse = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/validatorsets/latest?pagination.limit=200`);
      const validatorSet = validatorSetResponse.data.validators || [];
      
      // Create a map of consensus addresses to pub keys
      const proposerKeyMap: Record<string, string> = {};
      validatorSet.forEach((validator: any) => {
        if (validator.address && validator.pub_key?.key) {
          proposerKeyMap[validator.address.toLowerCase()] = validator.pub_key.key;
        }
      });
      
      // Fetch validator information to get monikers
      const validatorsResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators?pagination.limit=500`);
      const validators = validatorsResponse.data.validators || [];
      
      // Create a map of pub keys to monikers
      const validatorInfo: Record<string, string> = {};
      validators.forEach((validator: any) => {
        if (validator.consensus_pubkey?.key) {
          validatorInfo[validator.consensus_pubkey.key] = validator.description?.moniker || "Unknown Validator";
        }
      });
      
      // Enhance blocks with validator monikers
      return blocks.map(block => {
        const proposerAddress = block.proposer.toLowerCase();
        const pubKey = proposerKeyMap[proposerAddress];
        const moniker = pubKey ? validatorInfo[pubKey] : undefined;
        
        return {
          ...block,
          proposerMoniker: moniker || `${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`
        };
      });
      
    } catch (error) {
      console.error('Error fetching validator information:', error);
      return blocks;
    }
  } catch (error) {
    console.error('Error in getBlocksWithValidators:', error);
    return [];
  }
};
