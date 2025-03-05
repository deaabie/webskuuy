
import React, { useEffect, useState } from 'react';
import { Block, Transaction, BlockchainStats, ChainConfig, ChainInfoExtended, getExtendedChainInfo } from '@/services/cosmosService';

// Import new component files
import ChainInfoCard from './overview/ChainInfoCard';
import TokenomicsCard from './overview/TokenomicsCard';
import RecentBlocksCard from './overview/RecentBlocksCard';
import RecentTransactionsCard from './overview/RecentTransactionsCard';
import BlockDetailsModal from './overview/BlockDetailsModal';

interface OverviewTabProps {
  chain: ChainConfig;
  stats: BlockchainStats | null;
  blocks: Block[];
  transactions: Transaction[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  chain, 
  stats, 
  blocks, 
  transactions, 
  formatNumber, 
  formatDate 
}) => {
  const [extendedInfo, setExtendedInfo] = useState<ChainInfoExtended | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    const fetchExtendedInfo = async () => {
      if (chain && chain.rpc.length > 0 && chain.api.length > 0) {
        const info = await getExtendedChainInfo(
          chain.rpc[0].address,
          chain.api[0].address,
          chain
        );
        setExtendedInfo(info);
      }
    };
    
    fetchExtendedInfo();
  }, [chain]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChainInfoCard 
          chain={chain} 
          extendedInfo={extendedInfo} 
          formatDate={formatDate}
          formatNumber={formatNumber}
        />
        
        <TokenomicsCard 
          chain={chain} 
          stats={stats} 
          extendedInfo={extendedInfo}
          formatNumber={formatNumber} 
        />
      </div>
      
      <RecentBlocksCard 
        blocks={blocks} 
        formatDate={formatDate}
        onBlockClick={handleBlockClick}
      />
      
      <RecentTransactionsCard 
        transactions={transactions} 
        formatDate={formatDate} 
      />

      <BlockDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        block={selectedBlock}
        formatDate={formatDate}
      />
    </div>
  );
};

export default OverviewTab;
