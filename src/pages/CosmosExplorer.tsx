
import React, { useState } from "react";
import { useChainSelector } from "@/hooks/useChainSelector";
import { useCosmosData } from "@/hooks/useCosmosData";
import NetworkTypeSelector from "@/components/cosmos/NetworkTypeSelector";
import CosmosExplorerHeader from "@/components/cosmos/CosmosExplorerHeader";
import ContentTabs from "@/components/cosmos/ContentTabs";
import ExplorerError from "@/components/cosmos/ExplorerError";

const CosmosExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("validators");
  
  const {
    selectedChainId,
    selectedNetworkType,
    availableChains,
    selectedChain,
    handleChainSelect,
    handleNetworkTypeChange
  } = useChainSelector("mainnet");
  
  const {
    validators,
    proposals,
    blocks,
    stats,
    loading,
    error,
    loadDataForTab
  } = useCosmosData(selectedChain, activeTab);

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    await loadDataForTab(value);
  };

  return (
    <div className="container py-6 md:py-8 space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
        <NetworkTypeSelector 
          selectedNetworkType={selectedNetworkType}
          onNetworkTypeChange={handleNetworkTypeChange}
        />
      </div>
      
      <CosmosExplorerHeader
        selectedChain={selectedChain}
        chains={availableChains}
        stats={stats}
        onChainSelect={handleChainSelect}
        loading={loading && !stats}
      />
      
      <ExplorerError message={error} />
      
      <ContentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        validators={validators}
        proposals={proposals}
        blocks={blocks}
        selectedChain={selectedChain}
        loading={loading}
      />
    </div>
  );
};

export default CosmosExplorer;
