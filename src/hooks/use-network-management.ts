
import { useState, useEffect } from 'react';
import { NetworkConfig } from "@/components/faucet/types";
import { getTestnets, getMainnets, getAllNetworks } from "@/config/deploy-config";

// Default custom network image
export const DEFAULT_CUSTOM_NETWORK_IMAGE = "https://raw.githubusercontent.com/deaabie/images/refs/heads/main/custom%20network.png";

// Get custom networks from localStorage
const getCustomNetworks = (): NetworkConfig[] => {
  try {
    const networksStr = localStorage.getItem('customNetworks');
    return networksStr ? JSON.parse(networksStr) : [];
  } catch (error) {
    console.error("Error loading custom networks:", error);
    return [];
  }
};

// Save custom networks to localStorage
const saveCustomNetworks = (networks: NetworkConfig[]) => {
  try {
    localStorage.setItem('customNetworks', JSON.stringify(networks));
  } catch (error) {
    console.error("Error saving custom networks:", error);
  }
};

export function useNetworkManagement() {
  const [customNetworks, setCustomNetworks] = useState<NetworkConfig[]>(getCustomNetworks());
  const [newNetwork, setNewNetwork] = useState<Partial<NetworkConfig>>({
    name: "",
    id: "",
    chainId: 0,
    symbol: "ETH",
    rpcUrl: "",
    explorer: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Get networks from the config
  const testnets = Object.values(getTestnets());
  const mainnets = Object.values(getMainnets());

  const resetNewNetwork = () => {
    setNewNetwork({
      name: "",
      id: "",
      chainId: 0,
      symbol: "ETH",
      rpcUrl: "",
      explorer: "",
    });
    setFormErrors({});
  };

  const validateNetworkForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newNetwork.name) errors.name = "Name is required";
    if (!newNetwork.id) errors.id = "ID is required";
    if (!newNetwork.chainId || newNetwork.chainId <= 0) errors.chainId = "Valid Chain ID is required";
    if (!newNetwork.rpcUrl) errors.rpcUrl = "RPC URL is required";
    if (!newNetwork.explorer) errors.explorer = "Explorer URL is required";
    
    const allNetworks = getAllNetworks();
    if (allNetworks[newNetwork.id || ""] || customNetworks.some(n => n.id === newNetwork.id)) {
      errors.id = "Network ID already exists";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addCustomNetwork = () => {
    if (!validateNetworkForm()) return;
    
    const networkToAdd: NetworkConfig = {
      id: newNetwork.id!,
      name: newNetwork.name!,
      chainId: newNetwork.chainId!,
      symbol: newNetwork.symbol || "ETH",
      rpcUrl: newNetwork.rpcUrl!,
      explorer: newNetwork.explorer!,
      imageUrl: DEFAULT_CUSTOM_NETWORK_IMAGE
    };
    
    const updatedNetworks = [...customNetworks, networkToAdd];
    setCustomNetworks(updatedNetworks);
    saveCustomNetworks(updatedNetworks);
    
    return true;
  };

  const updateNetworkField = (field: string, value: string | number) => {
    setNewNetwork({...newNetwork, [field]: value});
  };

  return {
    customNetworks,
    newNetwork,
    formErrors,
    testnets,
    mainnets,
    resetNewNetwork,
    addCustomNetwork,
    updateNetworkField
  };
}
