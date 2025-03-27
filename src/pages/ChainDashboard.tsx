
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ChainConfig, getChainConfigs } from '@/services/cosmosService';
import StatsCards from '@/components/chain/StatsCards';
import EndpointsCard from '@/components/chain/EndpointsCard';
import ChainHeader from '@/components/chain/ChainHeader';
import ChainTabs from '@/components/chain/ChainTabs';
import { useChainData } from '@/hooks/useChainData';
import { formatNumber, formatDate } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';

const ChainDashboard: React.FC = () => {
  const { chainName } = useParams<{ chainName: string }>();
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState<{api: string, rpc: string}>({api: '', rpc: ''});
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use our custom hook to fetch chain data
  const { stats, validators, blocks, transactions, proposals, fetchBlockchainData } = useChainData(
    chain, 
    activeEndpoint, 
    activeTab
  );

  // Fetch chain configuration
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

  // Initial data fetch when chain or endpoints change
  useEffect(() => {
    if (chain && activeEndpoint.api && activeEndpoint.rpc) {
      fetchBlockchainData(true); // Force refresh on initial load
    }
  }, [chain, activeEndpoint, fetchBlockchainData]);

  // Force refresh on tab change
  useEffect(() => {
    if (chain && activeEndpoint.api && activeEndpoint.rpc) {
      fetchBlockchainData(true);
    }
  }, [activeTab, fetchBlockchainData]);

  // Set up regular data polling
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const chainSymbol = chain?.assets && chain.assets.length > 0 
    ? chain.assets[0].symbol 
    : chain?.addr_prefix?.toUpperCase() || '';

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
        <ChainHeader chain={chain} />
        
        <StatsCards 
          stats={stats} 
          formatNumber={formatNumber} 
          chainSymbol={chainSymbol}
        />
        
        <ChainTabs 
          chain={chain}
          stats={stats}
          validators={validators}
          blocks={blocks}
          transactions={transactions}
          proposals={proposals}
          formatNumber={formatNumber}
          formatDate={formatDate}
          activeEndpoint={activeEndpoint}
          onTabChange={handleTabChange}
        />
        
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
