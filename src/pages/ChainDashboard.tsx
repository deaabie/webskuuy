import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import UptimeTab from '@/components/chain/UptimeTab';
import GovernmentTab from '@/components/chain/GovernmentTab';
import EndpointsCard from '@/components/chain/EndpointsCard';
import { toast } from '@/components/ui/use-toast';

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
  
  const lastFetchRef = useRef<Record<string, number>>({
    stats: 0,
    validators: 0,
    blocks: 0,
    proposals: 0,
    transactions: 0
  });
  
  const fetchInProgressRef = useRef<Record<string, boolean>>({
    stats: false,
    validators: false,
    blocks: false,
    proposals: false,
    transactions: false
  });

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

  const fetchBlockchainData = useCallback(async (forceRefresh = false) => {
    if (!chain || !activeEndpoint.api || !activeEndpoint.rpc) return;
    
    const now = Date.now();
    const refreshInterval = 2000; // 2 seconds
    
    try {
      if ((forceRefresh || now - lastFetchRef.current.stats > refreshInterval) && !fetchInProgressRef.current.stats) {
        fetchInProgressRef.current.stats = true;
        try {
          console.log("Fetching stats...");
          const statsData = await getBlockchainStats(activeEndpoint.rpc, activeEndpoint.api);
          setStats(prev => {
            if (!prev || statsData.height !== prev.height) {
              return statsData;
            }
            return prev;
          });
          lastFetchRef.current.stats = now;
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          fetchInProgressRef.current.stats = false;
        }
      }
      
      if ((forceRefresh || now - lastFetchRef.current.blocks > refreshInterval) && !fetchInProgressRef.current.blocks) {
        fetchInProgressRef.current.blocks = true;
        try {
          console.log("Fetching blocks...");
          const blocksData = await getBlocks(activeEndpoint.rpc, 10);
          setBlocks(prev => {
            if (blocksData.length > 0 && (!prev.length || blocksData[0].height !== prev[0]?.height)) {
              return blocksData;
            }
            return prev;
          });
          lastFetchRef.current.blocks = now;
        } catch (error) {
          console.error('Error fetching blocks:', error);
        } finally {
          fetchInProgressRef.current.blocks = false;
        }
      }
      
      if ((activeTab === 'validators' || activeTab === 'overview' || activeTab === 'uptime') && 
          (forceRefresh || now - lastFetchRef.current.validators > refreshInterval) && 
          !fetchInProgressRef.current.validators) {
        fetchInProgressRef.current.validators = true;
        try {
          console.log("Fetching validators...");
          const validatorsData = await getValidators(activeEndpoint.api);
          setValidators(validatorsData);
          lastFetchRef.current.validators = now;
        } catch (error) {
          console.error('Error fetching validators:', error);
        } finally {
          fetchInProgressRef.current.validators = false;
        }
      }
      
      if ((activeTab === 'government' || activeTab === 'overview') && 
          (forceRefresh || now - lastFetchRef.current.proposals > refreshInterval) && 
          !fetchInProgressRef.current.proposals) {
        fetchInProgressRef.current.proposals = true;
        try {
          console.log("Fetching proposals...");
          const proposalsData = await getProposals(activeEndpoint.api, 100);
          setProposals(proposalsData);
          lastFetchRef.current.proposals = now;
        } catch (error) {
          console.error('Error fetching proposals:', error);
        } finally {
          fetchInProgressRef.current.proposals = false;
        }
      }
      
      if ((activeTab === 'overview') && 
          (forceRefresh || now - lastFetchRef.current.transactions > refreshInterval) && 
          !fetchInProgressRef.current.transactions) {
        fetchInProgressRef.current.transactions = true;
        try {
          console.log("Fetching transactions...");
          const txsData = await getTransactions(activeEndpoint.api);
          setTransactions(txsData);
          lastFetchRef.current.transactions = now;
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          fetchInProgressRef.current.transactions = false;
        }
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      if (forceRefresh) {
        toast({
          title: "Error fetching data",
          description: "Could not retrieve blockchain data. Please try again later.",
          variant: "destructive"
        });
      }
    }
  }, [chain, activeEndpoint, activeTab]);

  useEffect(() => {
    const fetchChainData = async () => {
      setLoading(true);
      
      try {
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
        } else {
          toast({
            title: "Chain not found",
            description: `Could not find chain with name: ${chainName}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching chain data:', error);
        toast({
          title: "Error loading chain",
          description: "Could not load chain information. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChainData();
  }, [chainName]);

  useEffect(() => {
    if (chain && activeEndpoint.api && activeEndpoint.rpc) {
      fetchBlockchainData(true); // Force refresh on initial load
    }
  }, [chain, activeEndpoint, fetchBlockchainData]);

  useEffect(() => {
    if (chain && activeEndpoint.api && activeEndpoint.rpc) {
      fetchBlockchainData(true); // Force refresh on tab change
    }
  }, [activeTab, fetchBlockchainData]);

  useEffect(() => {
    if (!chain || !activeEndpoint.api || !activeEndpoint.rpc) return;
    
    console.log("Setting up data refresh interval");
    const interval = setInterval(() => {
      fetchBlockchainData(); // Regular updates every 2 seconds
    }, 2000);
    
    return () => {
      console.log("Clearing data refresh interval");
      clearInterval(interval);
    };
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
            <TabsTrigger value="uptime">Uptime</TabsTrigger>
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
          
          <TabsContent value="uptime" className="space-y-6 mt-6">
            <UptimeTab 
              chain={chain}
              validators={validators}
              formatNumber={formatNumber}
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
