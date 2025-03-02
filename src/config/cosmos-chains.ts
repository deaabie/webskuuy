
import { ChainConfig } from "@/types/cosmos";

// Default configurations that will be used if no JSON files are found
const DEFAULT_CHAINS: ChainConfig[] = [
  {
    id: "cosmoshub",
    name: "cosmoshub",
    prettyName: "Cosmos Hub",
    logo: "/cosmos-logos/atom.svg",
    rpc: "https://rpc.cosmos.network",
    rest: "https://rest.cosmos.network",
    denom: "uatom",
    symbol: "ATOM",
    decimals: 6,
    coinGeckoId: "cosmos",
    gasPrice: "0.025uatom",
    explorerUrl: "https://www.mintscan.io/cosmos",
    networkType: "mainnet"
  },
  {
    id: "osmosis",
    name: "osmosis",
    prettyName: "Osmosis",
    logo: "/cosmos-logos/osmo.svg",
    rpc: "https://rpc.osmosis.zone",
    rest: "https://rest.osmosis.zone",
    denom: "uosmo",
    symbol: "OSMO",
    decimals: 6,
    coinGeckoId: "osmosis",
    gasPrice: "0.025uosmo",
    explorerUrl: "https://www.mintscan.io/osmosis",
    networkType: "mainnet"
  },
  {
    id: "juno",
    name: "juno",
    prettyName: "Juno",
    logo: "/cosmos-logos/juno.svg",
    rpc: "https://rpc.juno.strange.love",
    rest: "https://api.juno.strange.love",
    denom: "ujuno",
    symbol: "JUNO",
    decimals: 6,
    coinGeckoId: "juno-network",
    gasPrice: "0.025ujuno",
    explorerUrl: "https://www.mintscan.io/juno",
    networkType: "mainnet"
  },
  {
    id: "stargaze",
    name: "stargaze",
    prettyName: "Stargaze",
    logo: "/cosmos-logos/stars.svg",
    rpc: "https://rpc.stargaze-apis.com",
    rest: "https://rest.stargaze-apis.com",
    denom: "ustars",
    symbol: "STARS",
    decimals: 6,
    coinGeckoId: "stargaze",
    gasPrice: "0.025ustars",
    explorerUrl: "https://www.mintscan.io/stargaze",
    networkType: "mainnet"
  }
];

// Mainnet chain configurations - in a real app, these would be loaded from JSON files
const MAINNET_CHAINS: ChainConfig[] = [
  ...DEFAULT_CHAINS
];

// Testnet chain configurations - in a real app, these would be loaded from JSON files
const TESTNET_CHAINS: ChainConfig[] = [
  {
    id: "theta-testnet",
    name: "theta-testnet",
    prettyName: "Cosmos Hub Testnet",
    logo: "/cosmos-logos/atom.svg",
    rpc: "https://rpc.cosmos-testnet.network",
    rest: "https://rest.cosmos-testnet.network",
    denom: "uatom",
    symbol: "ATOM",
    decimals: 6,
    gasPrice: "0.025uatom",
    explorerUrl: "https://testnet.mintscan.io/cosmos-testnet",
    networkType: "testnet"
  }
];

// Combine all chains for the explorer
export const COSMOS_CHAINS: ChainConfig[] = [
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS
];

// Function to get a chain config by ID
export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return COSMOS_CHAINS.find(chain => chain.id === chainId);
};

// Function to get chains by network type
export const getChainsByNetwork = (networkType?: "mainnet" | "testnet"): ChainConfig[] => {
  if (!networkType) return COSMOS_CHAINS;
  return COSMOS_CHAINS.filter(chain => chain.networkType === networkType);
};

// Function to load chain configurations from JSON files
export const loadChainConfigs = async (): Promise<ChainConfig[]> => {
  const chains: ChainConfig[] = [];
  
  try {
    // In a real implementation, this would load JSON files from 
    // the public directory or fetch them from an API
    // For example:
    // const mainnetResponse = await fetch('/chains/mainnet/index.json');
    // const mainnetChains = await mainnetResponse.json();
    
    // For now, we'll use the DEFAULT_CHAINS
    return COSMOS_CHAINS;
  } catch (error) {
    console.error("Error loading chain configurations:", error);
    return DEFAULT_CHAINS;
  }
};

// Function to add a custom chain configuration
export const addCustomChain = (chain: ChainConfig): void => {
  const existingChainIndex = COSMOS_CHAINS.findIndex(c => c.id === chain.id);
  
  if (existingChainIndex !== -1) {
    // Replace existing chain with same ID
    COSMOS_CHAINS[existingChainIndex] = { 
      ...chain, 
      networkType: chain.networkType || "mainnet" 
    };
  } else {
    // Add new chain
    COSMOS_CHAINS.push({ 
      ...chain, 
      networkType: chain.networkType || "mainnet" 
    });
  }
};

// Function to remove a chain configuration
export const removeChain = (chainId: string): boolean => {
  const initialLength = COSMOS_CHAINS.length;
  const filteredChains = COSMOS_CHAINS.filter(chain => chain.id !== chainId);
  
  if (filteredChains.length < initialLength) {
    // Chain was found and removed
    COSMOS_CHAINS.length = 0;
    COSMOS_CHAINS.push(...filteredChains);
    return true;
  }
  
  return false;
};

// Function to save chain configuration as JSON
export const exportChainConfig = (chain: ChainConfig): string => {
  return JSON.stringify(chain, null, 2);
};

// Function to import chain configuration from JSON
export const importChainConfig = (json: string): ChainConfig | null => {
  try {
    const chain = JSON.parse(json) as ChainConfig;
    
    // Validate required fields
    if (!chain.id || !chain.name || !chain.rest || !chain.rpc) {
      throw new Error("Invalid chain configuration: missing required fields");
    }
    
    return chain;
  } catch (error) {
    console.error("Error parsing chain configuration:", error);
    return null;
  }
};

// Create sample JSON files for chains
// This would be used in a development environment to generate sample config files
export const generateSampleConfigs = (): void => {
  DEFAULT_CHAINS.forEach(chain => {
    console.log(`Chain ${chain.id} config:`, exportChainConfig(chain));
  });
};
