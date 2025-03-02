import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Validator, Proposal, Block, CosmosExplorerStats } from "@/types/cosmos";
import { 
  COSMOS_CHAINS, 
  getChainConfig, 
  getChainsByNetwork,
  loadChainConfigs
} from "@/config/cosmos-chains";
import CosmosExplorerHeader from "@/components/cosmos/CosmosExplorerHeader";
import ValidatorsList from "@/components/cosmos/ValidatorsList";
import ProposalsList from "@/components/cosmos/ProposalsList";
import BlocksList from "@/components/cosmos/BlocksList";
import { 
  fetchValidators, 
  fetchProposals, 
  fetchBlocks, 
  fetchStats 
} from "@/services/cosmosService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const CosmosExplorer: React.FC = () => {
  const [selectedChainId, setSelectedChainId] = useState(COSMOS_CHAINS[0]?.id || "");
  const [selectedNetworkType, setSelectedNetworkType] = useState<"mainnet" | "testnet" | undefined>("mainnet");
  const [validators, setValidators] = useState<Validator[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<CosmosExplorerStats | null>(null);
  const [activeTab, setActiveTab] = useState("validators");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableChains, setAvailableChains] = useState(COSMOS_CHAINS);
  
  const selectedChain = getChainConfig(selectedChainId) || COSMOS_CHAINS[0];

  useEffect(() => {
    const initChains = async () => {
      try {
        await loadChainConfigs();
        const filteredChains = getChainsByNetwork(selectedNetworkType);
        setAvailableChains(filteredChains);
        
        if (filteredChains.length > 0 && !selectedChainId) {
          setSelectedChainId(filteredChains[0].id);
        }
      } catch (error) {
        console.error("Error initializing chains:", error);
        toast.error("Failed to load chain configurations");
      }
    };
    
    initChains();
  }, [selectedNetworkType]);

  useEffect(() => {
    if (!selectedChain) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const statsData = await fetchStats(selectedChain.rest);
        setStats(statsData);
        
        if (activeTab === "validators" || !activeTab) {
          const validatorsData = await fetchValidators(selectedChain.rest);
          setValidators(validatorsData);
        }
        
        if (activeTab === "proposals") {
          const proposalsData = await fetchProposals(selectedChain.rest);
          setProposals(proposalsData);
        }
        
        if (activeTab === "blocks") {
          const blocksData = await fetchBlocks(selectedChain.rest);
          setBlocks(blocksData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to fetch data from the blockchain. Please try again later.");
        toast.error("Connection error", {
          description: "Failed to connect to the blockchain. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedChainId, selectedChain?.rest, activeTab]);

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    
    if (value === "validators" && validators.length === 0) {
      try {
        setLoading(true);
        const validatorsData = await fetchValidators(selectedChain.rest);
        setValidators(validatorsData);
      } catch (error) {
        console.error("Error loading validators:", error);
        toast.error("Failed to load validators");
      } finally {
        setLoading(false);
      }
    }
    
    if (value === "proposals" && proposals.length === 0) {
      try {
        setLoading(true);
        const proposalsData = await fetchProposals(selectedChain.rest);
        setProposals(proposalsData);
      } catch (error) {
        console.error("Error loading proposals:", error);
        toast.error("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    }
    
    if (value === "blocks" && blocks.length === 0) {
      try {
        setLoading(true);
        const blocksData = await fetchBlocks(selectedChain.rest);
        setBlocks(blocksData);
      } catch (error) {
        console.error("Error loading blocks:", error);
        toast.error("Failed to load blocks");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChainSelect = (chainId: string) => {
    setSelectedChainId(chainId);
    setValidators([]);
    setProposals([]);
    setBlocks([]);
  };

  const handleNetworkTypeChange = (networkType: "mainnet" | "testnet" | undefined) => {
    setSelectedNetworkType(networkType);
    const filteredChains = getChainsByNetwork(networkType);
    setAvailableChains(filteredChains);
    
    if (filteredChains.length > 0) {
      handleChainSelect(filteredChains[0].id);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );

  return (
    <div className="container py-6 md:py-8 space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
        <div className="w-full md:w-1/3">
          <Select 
            value={selectedNetworkType || "mainnet"} 
            onValueChange={(value) => handleNetworkTypeChange(value as "mainnet" | "testnet" | undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select network type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Network Type</SelectLabel>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <CosmosExplorerHeader
        selectedChain={selectedChain}
        chains={availableChains}
        stats={stats}
        onChainSelect={handleChainSelect}
        loading={loading && !stats}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="proposals">Governance</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validators" className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : validators.length > 0 ? (
            <ValidatorsList validators={validators} chain={selectedChain} />
          ) : (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No validators found</AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="proposals" className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : proposals.length > 0 ? (
            <ProposalsList proposals={proposals} chain={selectedChain} />
          ) : (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No proposals found</AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="blocks" className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : blocks.length > 0 ? (
            <BlocksList blocks={blocks} />
          ) : (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No blocks found</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CosmosExplorer;
