
import axios from 'axios';
import { Transaction } from './types';

/**
 * Fetches recent transactions from a Cosmos blockchain
 */
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
      memo: tx.tx?.body?.memo || '',
      sender: tx.tx?.body?.messages?.[0]?.sender || tx.tx?.body?.messages?.[0]?.delegator_address || tx.tx?.body?.messages?.[0]?.validator_address || ''
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
        memo: tx.tx?.body?.memo || '',
        sender: tx.tx?.body?.messages?.[0]?.sender || tx.tx?.body?.messages?.[0]?.delegator_address || tx.tx?.body?.messages?.[0]?.validator_address || ''
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
                    memo: tx.tx?.body?.memo || '',
                    sender: tx.tx?.body?.messages?.[0]?.sender || tx.tx?.body?.messages?.[0]?.delegator_address || tx.tx?.body?.messages?.[0]?.validator_address || ''
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
                    memo: '',
                    sender: ''
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
            memo: '',
            sender: ''
          }));
        } catch (finalFallbackError) {
          console.error('Final fallback for transactions failed:', finalFallbackError);
          return [];
        }
      }
    }
  }
};
