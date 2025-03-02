
import { useState, useEffect } from "react";
import { ChainConfig } from "@/types/cosmos";
import { getChainConfig, getChainsByNetwork, loadChainConfigs } from "@/config/cosmos-chains";
import { toast } from "sonner";

export function useChainSelector(initialNetworkType: "mainnet" | "testnet" | undefined = "mainnet") {
  const [selectedChainId, setSelectedChainId] = useState("");
  const [selectedNetworkType, setSelectedNetworkType] = useState<"mainnet" | "testnet" | undefined>(initialNetworkType);
  const [availableChains, setAvailableChains] = useState<ChainConfig[]>([]);
  
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

  const handleChainSelect = (chainId: string) => {
    setSelectedChainId(chainId);
  };

  const handleNetworkTypeChange = (networkType: "mainnet" | "testnet" | undefined) => {
    setSelectedNetworkType(networkType);
    const filteredChains = getChainsByNetwork(networkType);
    setAvailableChains(filteredChains);
    
    if (filteredChains.length > 0) {
      handleChainSelect(filteredChains[0].id);
    }
  };

  const selectedChain = getChainConfig(selectedChainId) || availableChains[0];

  return {
    selectedChainId,
    selectedNetworkType,
    availableChains,
    selectedChain,
    handleChainSelect,
    handleNetworkTypeChange
  };
}
