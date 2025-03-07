
import React, { useState } from 'react';
import { Block, Transaction, BlockchainStats, ChainConfig } from '@/services/cosmosService';
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
  formatNumber,
  formatDate,
  apiUrl
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  
  const [hashDetails, setHashDetails] = useState<{
    hash: string;
    height: number;
    status: string;
    time: string;
    gas: string;
    fee: string;
    memo: string;
  } | null>(null);
  const [isHashModalOpen, setIsHashModalOpen] = useState(false);
  
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsBlockModalOpen(true);
  };
  
  const handleHashSearch = async (hash: string) => {
    if (!apiUrl) return;
    
    try {
      // Try to fetch transaction by hash
      const txResponse = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs/${hash}`);
      const txData = txResponse.data.tx_response;
      
      if (txData) {
        setHashDetails({
          hash: txData.txhash,
          height: parseInt(txData.height),
          status: txData.code === 0 ? 'Success' : 'Failed',
          time: txData.timestamp,
          gas: txData.gas_used + ' / ' + txData.gas_wanted,
          fee: txData.tx.auth_info.fee.amount.length > 0 
            ? `${txData.tx.auth_info.fee.amount[0].amount} ${txData.tx.auth_info.fee.amount[0].denom}` 
            : '0',
          memo: txData.tx.body.memo || ''
        });
        setIsHashModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      // If we failed to fetch, create a basic details object
      setHashDetails({
        hash: hash,
        height: 0,
        status: 'Unknown',
        time: new Date().toISOString(),
        gas: 'Unknown',
        fee: 'Unknown',
        memo: ''
      });
      setIsHashModalOpen(true);
    }
  };
  
  const handleAccountSearch = (account: string) => {
    setSelectedAccount(account);
    setIsAccountModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <RecentBlocksCard 
        blocks={blocks} 
        onBlockClick={handleBlockClick}
        formatDate={formatDate}
        formatNumber={formatNumber}
        apiUrl={apiUrl}
        onHashClick={handleHashSearch}
        onAccountClick={handleAccountSearch}
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
        hashDetails={hashDetails}
        formatDate={formatDate}
      />
      
      <AccountDetailsModal
        isOpen={isAccountModalOpen}
        onOpenChange={setIsAccountModalOpen}
        account={selectedAccount}
        apiUrl={apiUrl}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default OverviewTab;
