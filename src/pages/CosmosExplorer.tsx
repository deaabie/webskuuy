
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Validator, Proposal, Block, CosmosExplorerStats } from "@/types/cosmos";
import { COSMOS_CHAINS, getChainConfig } from "@/config/cosmos-chains";
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

const CosmosExplorer: React.FC = () => {
  const [selectedChainId, setSelectedChainId] = useState(COSMOS_CHAINS[0].id);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<CosmosExplorerStats | null>(null);
  const [activeTab, setActiveTab] = useState("validators");
  
  const selectedChain = getChainConfig(selectedChainId) || COSMOS_CHAINS[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        const validatorsData = await fetchValidators(selectedChain.rest);
        const proposalsData = await fetchProposals(selectedChain.rest);
        const blocksData = await fetchBlocks(selectedChain.rest);
        const statsData = await fetchStats(selectedChain.rest);
        
        setValidators(validatorsData);
        setProposals(proposalsData);
        setBlocks(blocksData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, [selectedChainId, selectedChain.rest]);

  const handleChainSelect = (chainId: string) => {
    setSelectedChainId(chainId);
  };

  return (
    <div className="container py-6 md:py-8 space-y-6 px-4 md:px-6">
      <CosmosExplorerHeader
        selectedChain={selectedChain}
        chains={COSMOS_CHAINS}
        stats={stats}
        onChainSelect={handleChainSelect}
      />
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="proposals">Governance</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validators" className="space-y-4">
          <ValidatorsList validators={validators} chain={selectedChain} />
        </TabsContent>
        
        <TabsContent value="proposals" className="space-y-4">
          <ProposalsList proposals={proposals} chain={selectedChain} />
        </TabsContent>
        
        <TabsContent value="blocks" className="space-y-4">
          <BlocksList blocks={blocks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CosmosExplorer;
