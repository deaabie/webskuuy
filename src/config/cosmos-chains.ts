
import { ChainConfig } from "@/types/cosmos";

// Define network types for organization
export type NetworkType = "mainnet" | "testnet";

// Main configuration for supported Cosmos chains
export const COSMOS_CHAINS: ChainConfig[] = [
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
    network: "mainnet"
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
    network: "mainnet"
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
    network: "mainnet"
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
    network: "mainnet"
  }
];

// Dynamically loaded chains from config files
let dynamicChains: ChainConfig[] = [];

/**
 * Load chain configurations from a JSON file
 * @param jsonConfig The JSON configuration for chains
 * @param network The network type (mainnet/testnet)
 */
export const loadChainsFromJson = (jsonConfig: any, network: NetworkType = "mainnet"): void => {
  try {
    if (!Array.isArray(jsonConfig)) {
      // If it's a single chain object, convert to array
      jsonConfig = [jsonConfig];
    }
    
    const newChains = jsonConfig.map((config: any) => ({
      ...config,
      network: network,
      // Ensure name is lowercase if not provided
      name: config.name || config.id.toLowerCase(),
      // Set default gas price if not provided
      gasPrice: config.gasPrice || `0.025${config.denom}`
    }));
    
    // Filter out any invalid configurations
    const validChains = newChains.filter((chain: any) => 
      chain.id && chain.rpc && chain.rest && chain.denom && chain.symbol
    );
    
    // Add to dynamic chains, replacing any with the same ID
    dynamicChains = dynamicChains.filter(chain => 
      !validChains.some(newChain => newChain.id === chain.id)
    ).concat(validChains);
    
    console.log(`Loaded ${validChains.length} chains for ${network} network`);
  } catch (error) {
    console.error("Error loading chain configurations:", error);
  }
};

/**
 * Get all chains, including both predefined and dynamically loaded ones
 * @param network Optional filter by network type
 * @returns Array of chain configurations
 */
export const getAllChains = (network?: NetworkType): ChainConfig[] => {
  const allChains = [...COSMOS_CHAINS, ...dynamicChains];
  
  if (network) {
    return allChains.filter(chain => 
      chain.network === network || 
      // For backward compatibility with chains that don't have network property
      (network === "mainnet" && !chain.network)
    );
  }
  
  return allChains;
};

/**
 * Add a new chain configuration
 * @param chainConfig The configuration for the new chain
 * @returns The updated array of chain configurations
 */
export const addChainConfig = (chainConfig: ChainConfig): ChainConfig[] => {
  // Check if chain with this ID already exists in predefined chains
  const existingPredefinedIndex = COSMOS_CHAINS.findIndex(chain => chain.id === chainConfig.id);
  
  if (existingPredefinedIndex >= 0) {
    // Update predefined chain
    COSMOS_CHAINS[existingPredefinedIndex] = {
      ...chainConfig,
      network: chainConfig.network || "mainnet"
    };
  } else {
    // Check if exists in dynamic chains
    const existingDynamicIndex = dynamicChains.findIndex(chain => chain.id === chainConfig.id);
    
    if (existingDynamicIndex >= 0) {
      // Update dynamic chain
      dynamicChains[existingDynamicIndex] = {
        ...chainConfig,
        network: chainConfig.network || "mainnet"
      };
    } else {
      // Add to dynamic chains
      dynamicChains.push({
        ...chainConfig,
        network: chainConfig.network || "mainnet"
      });
    }
  }
  
  return getAllChains();
};

/**
 * Remove a chain configuration
 * @param chainId The ID of the chain to remove
 * @returns The updated array of chain configurations
 */
export const removeChainConfig = (chainId: string): ChainConfig[] => {
  // Can only remove from dynamic chains
  dynamicChains = dynamicChains.filter(chain => chain.id !== chainId);
  return getAllChains();
};

/**
 * Get a specific chain configuration by ID
 * @param chainId The ID of the chain to retrieve
 * @returns The chain configuration or undefined if not found
 */
export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return getAllChains().find(chain => chain.id === chainId);
};

/**
 * Helper function to create a new chain configuration
 * @param params The parameters for the new chain
 * @returns A complete chain configuration object
 */
export const createChainConfig = (params: {
  id: string;
  prettyName: string;
  logo: string;
  rpc: string;
  rest: string;
  denom: string;
  symbol: string;
  decimals: number;
  explorerUrl?: string;
  coinGeckoId?: string;
  gasPrice?: string;
  network?: NetworkType;
}): ChainConfig => {
  return {
    id: params.id,
    name: params.id.toLowerCase(),
    prettyName: params.prettyName,
    logo: params.logo,
    rpc: params.rpc,
    rest: params.rest,
    denom: params.denom,
    symbol: params.symbol,
    decimals: params.decimals,
    coinGeckoId: params.coinGeckoId,
    gasPrice: params.gasPrice || `0.025${params.denom}`,
    explorerUrl: params.explorerUrl,
    network: params.network || "mainnet"
  };
};

/**
 * Save a chain configuration to a JSON string
 * @param chain The chain configuration to save
 * @returns JSON string representation of the chain
 */
export const exportChainToJson = (chain: ChainConfig): string => {
  return JSON.stringify(chain, null, 2);
};

/**
 * Check if a hostname contains a network identifier
 * @param hostname The hostname to check
 * @returns The network type or undefined
 */
export const detectNetworkFromHostname = (hostname: string): NetworkType | undefined => {
  if (hostname.includes("testnet")) {
    return "testnet";
  }
  return "mainnet"; // Default to mainnet
};
