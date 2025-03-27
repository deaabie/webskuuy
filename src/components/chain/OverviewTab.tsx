
import React, { useState } from 'react';
import { Grid, Col } from "@/components/ui/grid";
import ChainInfoCard from './overview/ChainInfoCard';
import RecentBlocksCard from './overview/RecentBlocksCard';
import RecentTransactionsCard from './overview/RecentTransactionsCard';
import TokenomicsCard from './overview/TokenomicsCard';
import BlockDetailsModal from './overview/BlockDetailsModal';
import HashDetailsModal from './overview/HashDetailsModal';
import { Block, Transaction, ChainConfig, BlockchainStats } from '@/services/cosmosService';

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
  stats, 
  blocks, 
  transactions, 
  formatNumber, 
  formatDate,
  apiUrl
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsBlockModalOpen(true);
  };

  const handleTxClick = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ChainInfoCard chain={chain} stats={stats} formatNumber={formatNumber} />
        <TokenomicsCard chain={chain} stats={stats} formatNumber={formatNumber} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentBlocksCard 
          blocks={blocks} 
          formatDate={formatDate} 
          onBlockClick={handleBlockClick} 
          apiUrl={apiUrl}
        />
        <RecentTransactionsCard 
          transactions={transactions} 
          formatDate={formatDate} 
          onTxClick={handleTxClick} 
        />
      </div>
      
      <BlockDetailsModal 
        isOpen={isBlockModalOpen}
        onOpenChange={setIsBlockModalOpen}
        block={selectedBlock}
        formatDate={formatDate}
        apiUrl={apiUrl}
      />
      
      <HashDetailsModal
        isOpen={isTxModalOpen}
        onOpenChange={setIsTxModalOpen}
        transaction={selectedTx}
        formatDate={formatDate}
      />
    </div>
  );
};

export default OverviewTab;
