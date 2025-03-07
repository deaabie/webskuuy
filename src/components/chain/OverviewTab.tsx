
import React, { useState } from 'react';
import { Block, Transaction, BlockchainStats, ChainConfig } from '@/services/cosmosService';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import RecentBlocksCard from './overview/RecentBlocksCard';
import BlockDetailsModal from './overview/BlockDetailsModal';
import HashDetailsModal from './overview/HashDetailsModal';
import AccountDetailsModal from './overview/AccountDetailsModal';

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
  const [selectedAccount, setSelectedAccount] = useState<{
    address: string;
    balance: string;
    delegations: string;
    rewards: string;
    unbonding: string;
    validators: Array<{
      address: string;
      moniker: string;
      amount: string;
    }>;
  } | null>(null);
  
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isHashModalOpen, setIsHashModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !apiUrl) return;
    
    // Check if it's a block height (numeric)
    if (/^\d+$/.test(searchQuery)) {
      const height = parseInt(searchQuery);
      const block = blocks.find(b => b.height === height);
      if (block) {
        setSelectedBlock(block);
        setIsBlockModalOpen(true);
      }
    }
    // Check if it's a transaction hash (hex string)
    else if (/^[0-9a-fA-F]+$/.test(searchQuery)) {
      const tx = transactions.find(t => t.hash.toLowerCase().includes(searchQuery.toLowerCase()));
      if (tx) {
        setSelectedTransaction(tx);
        setIsHashModalOpen(true);
      }
    }
    // Assume it's an account address
    else {
      try {
        // This is a mock implementation. In a real app, you would fetch this data from your API
        setSelectedAccount({
          address: searchQuery,
          balance: "1000 ATOM",
          delegations: "500 ATOM",
          rewards: "50 ATOM",
          unbonding: "100 ATOM",
          validators: [
            {
              address: "validator1",
              moniker: "Validator One",
              amount: "300 ATOM"
            },
            {
              address: "validator2",
              moniker: "Validator Two",
              amount: "200 ATOM"
            }
          ]
        });
        setIsAccountModalOpen(true);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }
  };

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsBlockModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="w-full max-w 2xl mx-auto mb-6">
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
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
        accountInfo={selectedAccount}
      />
    </div>
  );
};

export default OverviewTab;
