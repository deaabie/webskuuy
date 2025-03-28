
import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import { Block, ChainConfig, BlockchainStats, Transaction } from '@/services/cosmos';
import ChainInfoCard from './overview/ChainInfoCard';
import TokenomicsCard from './overview/TokenomicsCard';
import RecentBlocksCard from './overview/RecentBlocksCard';
import RecentTransactionsCard from './overview/RecentTransactionsCard';
import AccountDetailsModal from './overview/AccountDetailsModal';
import HashDetailsModal from './overview/HashDetailsModal';
import BlockDetailsModal from './overview/BlockDetailsModal';

interface OverviewTabProps {
  chain: ChainConfig;
  stats: BlockchainStats | null;
  blocks: Block[];
  transactions: Transaction[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
  apiUrl?: string;
  rpcUrl?: string;  // Added rpcUrl prop
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  chain,
  stats,
  blocks,
  transactions,
  formatNumber,
  formatDate,
  apiUrl,
  rpcUrl,  // Accept rpcUrl
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [hashType, setHashType] = useState<'transaction' | 'address' | null>(null);
  const [isHashModalOpen, setIsHashModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsBlockModalOpen(true);
  };

  const handleHashClick = (hash: string, type: 'transaction' | 'address') => {
    setSelectedHash(hash);
    setHashType(type);
    setIsHashModalOpen(true);
  };

  const handleAccountClick = (account: string) => {
    setSelectedAccount(account);
    setIsAccountModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChainInfoCard chain={chain} stats={stats} formatNumber={formatNumber} />
        <TokenomicsCard chain={chain} stats={stats} formatNumber={formatNumber} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBlocksCard
          blocks={blocks}
          formatDate={formatDate}
          onBlockClick={handleBlockClick}
          apiUrl={apiUrl}
          rpcUrl={rpcUrl}  // Pass rpcUrl to RecentBlocksCard
        />
        
        <RecentTransactionsCard
          transactions={transactions}
          formatDate={formatDate}
          onHashClick={handleHashClick}
          onAddressClick={handleAccountClick}
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
        isOpen={isHashModalOpen}
        onOpenChange={setIsHashModalOpen}
        hash={selectedHash}
        type={hashType}
        formatDate={formatDate}
        apiUrl={apiUrl}
      />

      <AccountDetailsModal
        isOpen={isAccountModalOpen}
        onOpenChange={setIsAccountModalOpen}
        address={selectedAccount}
        formatNumber={formatNumber}
        formatDate={formatDate}
        apiUrl={apiUrl}
      />
    </div>
  );
};

export default OverviewTab;
