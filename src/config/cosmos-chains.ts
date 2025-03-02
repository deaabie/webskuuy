import { ChainConfig } from "@/types/cosmos";

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
    explorerUrl: "https://www.mintscan.io/cosmos"
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
    explorerUrl: "https://www.mintscan.io/osmosis"
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
    explorerUrl: "https://www.mintscan.io/juno"
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
    explorerUrl: "https://www.mintscan.io/stargaze"
  }
];

/**
 * Function to add a new chain configuration
 * @param chainConfig The configuration for the new chain
 * @returns The updated array of chain configurations
 */
export const addChainConfig = (chainConfig: ChainConfig): ChainConfig[] => {
  // Check if chain with this ID already exists
  const existingIndex = COSMOS_CHAINS.findIndex(chain => chain.id === chainConfig.id);
  
  // If chain exists, update it
  if (existingIndex >= 0) {
    COSMOS_CHAINS[existingIndex] = chainConfig;
  } else {
    // Otherwise add the new chain
    COSMOS_CHAINS.push(chainConfig);
  }
  
  return [...COSMOS_CHAINS];
};

/**
 * Function to remove a chain configuration
 * @param chainId The ID of the chain to remove
 * @returns The updated array of chain configurations
 */
export const removeChainConfig = (chainId: string): ChainConfig[] => {
  const updatedChains = COSMOS_CHAINS.filter(chain => chain.id !== chainId);
  return updatedChains;
};

/**
 * Get a specific chain configuration by ID
 * @param chainId The ID of the chain to retrieve
 * @returns The chain configuration or undefined if not found
 */
export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return COSMOS_CHAINS.find(chain => chain.id === chainId);
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
    explorerUrl: params.explorerUrl
  };
};
