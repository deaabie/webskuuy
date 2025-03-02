import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Validator, Proposal, Block, CosmosExplorerStats } from "@/types/cosmos";
import { 
  getAllChains, 
  getChainConfig, 
  NetworkType, 
  detectNetworkFromHostname, 
  loadChainsFromJson 
} from "@/config/cosmos-chains";
import CosmosExplorerHeader from "@/components/cosmos/CosmosExplorerHeader";
import ValidatorsList from "@/components/cosmos/ValidatorsList";
import ProposalsList from "@/components/cosmos/ProposalsList";
import BlocksList from "@/components/cosmos/BlocksList";
import ChainConfigForm from "@/components/cosmos/ChainConfigForm";
import { 
  fetchValidators, 
  fetchProposals, 
  fetchBlocks, 
  fetchStats 
} from "@/services/cosmosService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Settings, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CosmosExplorer: React.FC = () => {
  const [networkType, setNetworkType] = useState<NetworkType>("mainnet");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [validators, setValidators] = useState<Validator[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<CosmosExplorerStats | null>(null);
  const [activeTab, setActiveTab] = useState("validators");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  // Get chains filtered by network type
  const availableChains = getAllChains(networkType);
  const selectedChain = selectedChainId ? getChainConfig(selectedChainId) : (availableChains[0] || null);

  // Detect network type from hostname on initial load
  useEffect(() => {
    const hostname = window.location.hostname;
    const detectedNetwork = detectNetworkFromHostname(hostname);
    if (detectedNetwork) {
      setNetworkType(detectedNetwork);
    }
  }, []);

  // Set initial selected chain once chains are loaded
  useEffect(() => {
    if (availableChains.length > 0 && !selectedChainId) {
      setSelectedChainId(availableChains[0].id);
    }
  }, [availableChains, selectedChainId]);

  useEffect(() => {
    if (!selectedChain) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // We'll fetch stats first as it's needed for the header
        const statsData = await fetchStats(selectedChain.rest);
        setStats(statsData);
        
        // Fetch data based on the active tab to optimize loading
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

  // Data loading handler for tab changes
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    
    if (!selectedChain) return;
    
    // If we haven't loaded this tab's data yet, load it now
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
    // Clear existing data when changing chains
    setValidators([]);
    setProposals([]);
    setBlocks([]);
  };

  const handleNetworkChange = (network: NetworkType) => {
    setNetworkType(network);
    // Reset selected chain since it might not exist in the new network
    setSelectedChainId("");
    setValidators([]);
    setProposals([]);
    setBlocks([]);
  };

  const handleChainAdded = () => {
    setConfigDialogOpen(false);
    toast.success("Chain configuration updated. New chain is now available in the selector.");
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const json = JSON.parse(content);
        
        // Load the chain configuration
        loadChainsFromJson(json, networkType);
        
        toast.success("Chain configuration imported successfully");
        setImportDialogOpen(false);
        
        // Reset the file input
        event.target.value = "";
      } catch (error) {
        console.error("Error importing chain configuration:", error);
        toast.error("Failed to import chain configuration");
      }
    };
    
    reader.readAsText(file);
  };

  // Loading state UI components
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
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Button 
              variant={networkType === "mainnet" ? "default" : "outline"} 
              onClick={() => handleNetworkChange("mainnet")}
              size="sm"
            >
              Mainnet
            </Button>
            <Button 
              variant={networkType === "testnet" ? "default" : "outline"} 
              onClick={() => handleNetworkChange("testnet")}
              size="sm"
            >
              Testnet
            </Button>
          </div>
          
          {selectedChain && (
            <CosmosExplorerHeader
              selectedChain={selectedChain}
              chains={availableChains}
              stats={stats}
              onChainSelect={handleChainSelect}
              loading={loading && !stats}
            />
          )}
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="Import Chain Configuration">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Import Chain Configuration</DialogTitle>
                <DialogDescription>
                  Select a JSON file with chain configuration
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="chain-json">Chain Configuration File</Label>
                <Input
                  id="chain-json"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  The imported chain will be added to the {networkType} network. 
                  Make sure the file contains valid chain configuration.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="Configure Chains">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Chain Configuration</DialogTitle>
                <DialogDescription>
                  Add and configure Cosmos chains for the explorer
                </DialogDescription>
              </DialogHeader>
              <ChainConfigForm onSuccess={handleChainAdded} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {availableChains.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No chains configured for {networkType} network. 
            Please import a chain configuration or add a new chain using the Configure button.
          </AlertDescription>
        </Alert>
      ) : selectedChain ? (
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
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a chain to explore from the dropdown menu.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CosmosExplorer;
