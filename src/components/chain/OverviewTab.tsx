
import React, { useState } from 'react';
import { Block, Transaction, BlockchainStats, ChainConfig } from '@/services/cosmosService';
import RecentTransactionsCard from './overview/RecentTransactionsCard';
import BlockDetailsModal from './overview/BlockDetailsModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <RecentTransactionsCard 
        transactions={transactions} 
        formatDate={formatDate}
        apiUrl={apiUrl}
      />

      <BlockDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        block={selectedBlock}
        formatDate={formatDate}
        apiUrl={apiUrl}
      />
    </div>
  );
};

export default OverviewTab;
