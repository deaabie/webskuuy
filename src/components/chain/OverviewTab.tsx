
import React, { useState } from 'react';
import { Block, Transaction, BlockchainStats, ChainConfig } from '@/services/cosmosService';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import RecentBlocksCard from './overview/RecentBlocksCard';
import BlockDetailsModal from './overview/BlockDetailsModal';
import HashDetailsModal from './overview/HashDetailsModal';
import AccountDetailsModal from './overview/AccountDetailsModal';
import AccountsSummaryCard from './overview/AccountsSummaryCard';
import ParametersTabs from './overview/ParametersTabs';
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
  apiUrl,
  formatNumber
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isHashModalOpen, setIsHashModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Find the active RPC URL that corresponds to the active API URL
  const findMatchingRpcUrl = (): string | undefined => {
    if (!apiUrl || !chain?.api || !chain?.rpc) return undefined;
    
    // Find the matching provider
    const activeApiProvider = chain.api.find(api => api.address === apiUrl)?.provider;
    
    // If we found the provider, find the matching RPC with the same provider
    if (activeApiProvider) {
      const matchingRpc = chain.rpc.find(rpc => rpc.provider === activeApiProvider);
      return matchingRpc?.address;
    }
    
    // Fallback to first RPC if no match
    return chain.rpc[0]?.address;
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !apiUrl) {
      toast({
        title: "Invalid search",
        description: "Please enter a valid block height, transaction hash, or account address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Check if it's a block height (numeric)
      if (/^\d+$/.test(searchQuery)) {
        const height = parseInt(searchQuery);
        const existingBlock = blocks.find(b => b.height === height);
        
        if (existingBlock) {
          setSelectedBlock(existingBlock);
          setIsBlockModalOpen(true);
        } else {
          try {
            const blockResponse = await axios.get(`${apiUrl.replace(/\/cosmos.*$/, '')}/block?height=${height}`);
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
            console.error("Block fetch error:", error);
            toast({
              title: "Block not found",
              description: `Could not find block at height ${height}`,
              variant: "destructive"
            });
          }
        }
      }
      // Check if it's a transaction hash (hex string)
      else if (/^[0-9a-fA-F]{64}$/i.test(searchQuery) || /^[0-9A-F]{40}$/i.test(searchQuery)) {
        try {
          // First try to find the transaction in our cached list
          const existingTx = transactions.find(t => 
            t.hash.toLowerCase() === searchQuery.toLowerCase() || 
            t.hash.includes(searchQuery)
          );
          
          if (existingTx) {
            console.log("Found existing transaction:", existingTx);
            setSelectedTransaction(existingTx);
            setIsHashModalOpen(true);
          } else {
            // If not found in cache, fetch it from the API
            console.log("Fetching transaction from API:", searchQuery);
            let txResponse;
            try {
              txResponse = await axios.get(`${apiUrl}/cosmos/tx/v1beta1/txs/${searchQuery}`);
            } catch (error) {
              console.log("First TX lookup failed, trying alternative format");
              // Try alternative format
              txResponse = await axios.get(`${apiUrl}/txs/${searchQuery}`);
            }
            
            console.log("TX Response:", txResponse.data);
            
            if (txResponse.data?.tx_response || txResponse.data?.tx) {
              const txData = txResponse.data?.tx_response || txResponse.data?.tx;
              setSelectedTransaction({
                hash: txData.txhash || searchQuery,
                block: parseInt(txData.height) || 0,
                type: txData.tx?.body?.messages?.[0]?.['@type']?.split('.')?.pop() || 
                      txData.tx?.type || 'unknown',
                fee: txData.tx?.auth_info?.fee?.amount?.[0]?.amount || 
                     txData.tx?.fee?.amount?.[0]?.amount || "0",
                status: (txData.code === 0 || txData.code === undefined) ? 'Success' : 'Failed',
                timestamp: txData.timestamp || new Date().toISOString(),
                gas: txData.gas_used || txData.gas_wanted || 'Unknown',
                memo: txData.tx?.body?.memo || txData.tx?.memo || ''
              });
              setIsHashModalOpen(true);
            } else {
              throw new Error("Transaction data format not recognized");
            }
          }
        } catch (error) {
          console.error("Transaction fetch error:", error);
          toast({
            title: "Transaction not found",
            description: "Could not find transaction with the provided hash",
            variant: "destructive"
          });
        }
      }
      // Assume it's an account address
      else if (searchQuery.startsWith(chain.addr_prefix)) {
        setSelectedAccount(searchQuery);
        setIsAccountModalOpen(true);
      } else {
        toast({
          title: "Invalid input",
          description: "Please enter a valid block height, transaction hash, or account address",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive"
      });
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBlocksCard 
          blocks={blocks} 
          onBlockClick={handleBlockClick}
          formatDate={formatDate}
        />
        
        <AccountsSummaryCard 
          apiUrl={apiUrl}
          formatNumber={formatNumber}
          addrPrefix={chain.addr_prefix}
        />
      </div>
      
      <ParametersTabs 
        apiUrl={apiUrl}
        rpcUrl={findMatchingRpcUrl()}
        formatNumber={formatNumber}
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
