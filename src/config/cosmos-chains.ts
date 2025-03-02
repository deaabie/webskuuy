
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
  }
];

// Initial array to hold chain configurations
const COSMOS_CHAINS: ChainConfig[] = [];

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
  try {
    // Initialize chains array
    COSMOS_CHAINS.length = 0;
    
    // Load mainnet chains
    const mainnetResponse = await fetch('/chains/mainnet/index.json');
    const mainnetChains = await mainnetResponse.json();
    
    for (const filename of mainnetChains) {
      try {
        const response = await fetch(`/chains/mainnet/${filename}`);
        const chainData = await response.json();
        COSMOS_CHAINS.push({
          ...chainData,
          networkType: "mainnet"
        });
      } catch (error) {
        console.error(`Error loading chain configuration from ${filename}:`, error);
      }
    }
    
    // Load testnet chains
    const testnetResponse = await fetch('/chains/testnet/index.json');
    const testnetChains = await testnetResponse.json();
    
    for (const filename of testnetChains) {
      try {
        const response = await fetch(`/chains/testnet/${filename}`);
        const chainData = await response.json();
        COSMOS_CHAINS.push({
          ...chainData,
          networkType: "testnet"
        });
      } catch (error) {
        console.error(`Error loading chain configuration from ${filename}:`, error);
      }
    }
    
    // If no chains were loaded, use the default chains
    if (COSMOS_CHAINS.length === 0) {
      console.warn("No chain configurations found, using defaults");
      COSMOS_CHAINS.push(...DEFAULT_CHAINS);
    }
    
    return COSMOS_CHAINS;
  } catch (error) {
    console.error("Error loading chain configurations:", error);
    // If there was an error loading the configurations, use the default chains
    COSMOS_CHAINS.length = 0;
    COSMOS_CHAINS.push(...DEFAULT_CHAINS);
    return COSMOS_CHAINS;
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

// Function to export chain configuration as JSON
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
