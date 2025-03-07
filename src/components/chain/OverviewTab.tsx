
import React, { useState } from 'react';
import { Block, Transaction, BlockchainStats, ChainConfig } from '@/services/cosmosService';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import RecentBlocksCard from './overview/RecentBlocksCard';
import BlockDetailsModal from './overview/BlockDetailsModal';
import HashDetailsModal from './overview/HashDetailsModal';
import AccountDetailsModal from './overview/AccountDetailsModal';
import axios from 'axios';

interface OverviewTabProps {
  chain: ChainConfig;
  stats: BlockchainStats | null;
  blocks: Block[];
  transactions: Transaction[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
  apiUrl?: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  chain, 
  blocks, 
  transactions, 
  formatDate,
  apiUrl
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isHashModalOpen, setIsHashModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !apiUrl) return;
    
    setIsSearching(true);
    
    try {
      // Check if it's a block height (numeric)
      if (/^\d+$/.test(searchQuery)) {
        const height = parseInt(searchQuery);
        
        // First check if the block exists in our current blocks array
        const existingBlock = blocks.find(b => b.height === height);
        
        if (existingBlock) {
          setSelectedBlock(existingBlock);
          setIsBlockModalOpen(true);
        } else {
          // If not found, try to fetch it
          try {
            const blockResponse = await axios.get(`${apiUrl.replace('/cosmos', '')}/block?height=${height}`);
            if (blockResponse.data?.result?.block) {
              const block = blockResponse.data.result.block;
              setSelectedBlock({
                height: height,
                hash: block.header.app_hash,
                proposer: block.header.proposer_address,
                txs: block.data.txs ? block.data.txs.length : 0,
                timestamp: block.header.time,
              });
              setIsBlockModalOpen(true);
            }
          } catch (error) {
            console.error('Error fetching block:', error);
            alert('Block not found');
          }
        }
      }
      // Check if it's a transaction hash (hex string)
      else if (/^[0-9a-fA-F]+$/.test(searchQuery)) {
        // First check if the transaction exists in our current transactions array
        const existingTx = transactions.find(t => 
          t.hash.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (existingTx) {
          setSelectedTransaction(existingTx);
          setIsHashModalOpen(true);
        } else {
          // If not found, try to fetch it
          try {
            const txResponse = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs/${searchQuery}`);
            if (txResponse.data?.tx_response) {
              const tx = txResponse.data.tx_response;
              setSelectedTransaction({
                hash: tx.txhash,
                block: parseInt(tx.height),
                type: tx.tx?.body?.messages?.[0]?.['@type']?.split('.')?.pop() || 'unknown',
                fee: tx.tx?.auth_info?.fee?.amount?.[0]?.amount || "0",
                status: tx.code === 0 ? 'Success' : 'Failed',
                timestamp: tx.timestamp || new Date().toISOString(),
                gas: tx.gas_used || 'Unknown',
                memo: tx.tx?.body?.memo || ''
              });
              setIsHashModalOpen(true);
            }
          } catch (error) {
            console.error('Error fetching transaction:', error);
            alert('Transaction not found');
          }
        }
      }
      // Assume it's an account address
      else {
        // Check if it looks like a cosmos address format
        if (searchQuery.startsWith(chain.addr_prefix)) {
          // Directly set the account address and open the modal
          // The actual data will be fetched by the AccountDetailsModal component
          setSelectedAccount(searchQuery);
          setIsAccountModalOpen(true);
        } else {
          alert('Invalid account address format');
        }
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsBlockModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="relative rounded-lg overflow-hidden border border-input">
          <Input 
            type="text" 
            placeholder="Search by block height, transaction hash, or account address" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-12"
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:text-primary transition-colors disabled:opacity-50"
          >
            {isSearching ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <RecentBlocksCard 
        blocks={blocks} 
        onBlockClick={handleBlockClick}
        formatDate={formatDate}
      />

      <BlockDetailsModal
        isOpen={isBlockModalOpen}
        onOpenChange={setIsBlockModalOpen}
        block={selectedBlock}
        formatDate={formatDate}
        apiUrl={apiUrl}
      />

      <HashDetailsModal
        isOpen={isHashModalOpen}
        onOpenChange={setIsHashModalOpen}
        transaction={selectedTransaction}
        formatDate={formatDate}
      />

      <AccountDetailsModal
        isOpen={isAccountModalOpen}
        onOpenChange={setIsAccountModalOpen}
        address={selectedAccount}
        apiUrl={apiUrl}
      />
    </div>
  );
};

export default OverviewTab;
