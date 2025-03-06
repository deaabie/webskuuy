
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SEO from '@/components/SEO';
import { 
  ChainConfig, 
  BlockchainStats, 
  Validator, 
  Block, 
  Transaction,
  Proposal,
  getChainConfigs,
  getBlockchainStats,
  getValidators,
  getBlocks,
  getTransactions,
  getProposals
} from '@/services/cosmosService';

import StatsCards from '@/components/chain/StatsCards';
import OverviewTab from '@/components/chain/OverviewTab';
import ValidatorsTab from '@/components/chain/ValidatorsTab';
import BlocksTab from '@/components/chain/BlocksTab';
import GovernmentTab from '@/components/chain/GovernmentTab';
import EndpointsCard from '@/components/chain/EndpointsCard';

const ChainDashboard: React.FC = () => {
  const { chainName } = useParams<{ chainName: string }>();
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState<{api: string, rpc: string}>({api: '', rpc: ''});
  const [activeTab, setActiveTab] = useState('overview');

  const statsPlaceholder: BlockchainStats = {
    height: 0,
    validators: {
      total: 0,
      active: 0,
    },
    supply: {
      total: "0",
      circulating: "0",
    },
    blockTime: 0,
    communityPool: "0",
    inflation: "0%",
    stakingAPR: "0%",
  };

  const fetchBlockchainData = useCallback(async () => {
    if (!chain || !activeEndpoint.api || !activeEndpoint.rpc) return;
    
    try {
      const statsData = await getBlockchainStats(activeEndpoint.rpc, activeEndpoint.api);
      setStats(statsData);
      
      if (activeTab === 'validators' || activeTab === 'overview') {
        const validatorsData = await getValidators(activeEndpoint.api);
        setValidators(validatorsData);
      }
      
      if (activeTab === 'blocks' || activeTab === 'overview') {
        const blocksData = await getBlocks(activeEndpoint.rpc);
        setBlocks(blocksData);
      }
      
      if (activeTab === 'government' || activeTab === 'overview') {
        const proposalsData = await getProposals(activeEndpoint.api, 100);
        setProposals(proposalsData);
      }
      
      if (activeTab === 'transactions') {
        const txsData = await getTransactions(activeEndpoint.api);
        setTransactions(txsData);
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    }
  }, [chain, activeEndpoint, activeTab]);

  useEffect(() => {
    const fetchChainData = async () => {
      setLoading(true);
      
      let chainsData = await getChainConfigs('mainnet');
      let foundChain = chainsData.find(c => c.chain_name === chainName);
      
      if (!foundChain) {
        chainsData = await getChainConfigs('testnet');
        foundChain = chainsData.find(c => c.chain_name === chainName);
      }
      
      if (foundChain) {
        setChain(foundChain);
        
        if (foundChain.api.length > 0 && foundChain.rpc.length > 0) {
          setActiveEndpoint({
            api: foundChain.api[0].address,
            rpc: foundChain.rpc[0].address
          });
        }
      }
      
      setLoading(false);
    };
    
    fetchChainData();
  }, [chainName]);

  useEffect(() => {
    if (chain && activeEndpoint.api && activeEndpoint.rpc) {
      fetchBlockchainData();
    }
  }, [chain, activeEndpoint, fetchBlockchainData, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (chain && activeEndpoint.api && activeEndpoint.rpc) {
        fetchBlockchainData();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [chain, activeEndpoint, fetchBlockchainData]);

  const formatNumber = (num: number | string): string => {
    return Number(num).toLocaleString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !chain) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
        <p>Loading chain data...</p>
      </div>
    );
  }

  if (!chain) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
        <p>Chain not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <SEO 
        title={`${chain.display_name} Explorer`}
        description={`Explore ${chain.display_name} blockchain statistics, validators, blocks, and governance proposals.`}
        canonicalUrl={`https://skuuy.com/explorer/${chain.chain_name}`}
      />
      
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={chain.logo}
              alt={chain.display_name}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div>
              <h1 className="text-3xl font-bold">{chain.display_name}</h1>
              <p className="text-muted-foreground">{chain.chain_id}</p>
            </div>
          </div>
        </div>
        
        <StatsCards stats={stats || statsPlaceholder} formatNumber={formatNumber} />
        
        <Tabs defaultValue="overview" className="w-full mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validators">Validators</TabsTrigger>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="government">Governance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <OverviewTab 
              chain={chain} 
              stats={stats} 
              blocks={blocks} 
              transactions={transactions} 
              formatNumber={formatNumber} 
              formatDate={formatDate}
              apiUrl={activeEndpoint.api}
            />
          </TabsContent>
          
          <TabsContent value="validators" className="space-y-6 mt-6">
            <ValidatorsTab 
              validators={validators} 
              formatNumber={formatNumber} 
            />
          </TabsContent>
          
          <TabsContent value="blocks" className="space-y-6 mt-6">
            <BlocksTab 
              chain={chain} 
              blocks={blocks} 
              formatDate={formatDate}
              apiUrl={activeEndpoint.api}
            />
          </TabsContent>
          
          <TabsContent value="government" className="space-y-6 mt-6">
            <GovernmentTab 
              chain={chain} 
              proposals={proposals} 
              formatNumber={formatNumber} 
              formatDate={formatDate} 
            />
          </TabsContent>
        </Tabs>
        
        <EndpointsCard 
          chain={chain} 
          activeEndpoint={activeEndpoint} 
          setActiveEndpoint={setActiveEndpoint} 
        />
      </div>
    </div>
  );
};

export default ChainDashboard;
