
import { toast } from "sonner";

// Define types for Cosmos chain data
export interface ChainAsset {
  base: string;
  symbol: string;
  exponent: string;
  coingecko_id?: string;
  logo: string;
}

export interface EndpointInfo {
  provider: string;
  address: string;
}

export interface CosmosChain {
  chain_name: string;
  registry_name: string;
  api: EndpointInfo[];
  rpc: EndpointInfo[];
  sdk_version: string;
  keplr_features?: string[];
  coin_type: string;
  min_tx_fee: string;
  addr_prefix: string;
  logo: string;
  assets: ChainAsset[];
  is_testnet?: boolean;
}

// Function to fetch chains from GitHub repository
export const fetchChains = async (): Promise<CosmosChain[]> => {
  try {
    // In a production environment, this would fetch from a GitHub repository
    // For the demo, we'll use hardcoded sample data
    console.log("Fetching chain data from repository...");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return sampleChains;
  } catch (error) {
    console.error("Error fetching chain data:", error);
    toast.error("Failed to fetch chain data");
    throw error;
  }
};

// Function to check if an RPC endpoint is alive
export const checkRpcStatus = async (url: string): Promise<boolean> => {
  try {
    // Add a timeout to prevent long-running requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${url}/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error(`Error checking RPC status for ${url}:`, error);
    return false;
  }
};

// Function to get chain by its registry name
export const getChainByName = (registryName: string): CosmosChain | undefined => {
  return sampleChains.find(chain => chain.registry_name === registryName);
};

// Sample chains data for development
const sampleChains: CosmosChain[] = [
  {
    chain_name: "Galactica",
    registry_name: "galactica",
    api: [
      { provider: "Skuuy", address: "https://galactica-testnet-api.itrocket.net" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://galactica-testnet-rpc.itrocket.net" }
    ],
    sdk_version: "0.47.6",
    keplr_features: ["eth-address-gen", "eth-key-sign"],
    coin_type: "60",
    min_tx_fee: "10000000000000000",
    addr_prefix: "gala",
    logo: "/logos/galactica.png",
    assets: [{
      base: "agnet",
      symbol: "GNET",
      exponent: "18",
      coingecko_id: "",
      logo: "/logos/galactica.png"
    }],
    is_testnet: true
  },
  {
    chain_name: "Cosmos Hub",
    registry_name: "cosmoshub",
    api: [
      { provider: "Skuuy", address: "https://api.cosmos.network" },
      { provider: "Keplr", address: "https://lcd-cosmoshub.keplr.app" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://rpc.cosmos.network" },
      { provider: "Keplr", address: "https://rpc-cosmoshub.keplr.app" }
    ],
    sdk_version: "0.45.1",
    coin_type: "118",
    min_tx_fee: "500",
    addr_prefix: "cosmos",
    logo: "/logos/cosmos.png",
    assets: [{
      base: "uatom",
      symbol: "ATOM",
      exponent: "6",
      coingecko_id: "cosmos",
      logo: "/logos/cosmos.png"
    }],
    is_testnet: false
  },
  {
    chain_name: "Osmosis",
    registry_name: "osmosis",
    api: [
      { provider: "Skuuy", address: "https://lcd.osmosis.zone" },
      { provider: "Keplr", address: "https://lcd-osmosis.keplr.app" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://rpc.osmosis.zone" },
      { provider: "Keplr", address: "https://rpc-osmosis.keplr.app" }
    ],
    sdk_version: "0.45.0",
    coin_type: "118",
    min_tx_fee: "0",
    addr_prefix: "osmo",
    logo: "/logos/osmosis.png",
    assets: [{
      base: "uosmo",
      symbol: "OSMO",
      exponent: "6",
      coingecko_id: "osmosis",
      logo: "/logos/osmosis.png"
    }],
    is_testnet: false
  },
  {
    chain_name: "Juno",
    registry_name: "juno",
    api: [
      { provider: "Skuuy", address: "https://lcd-juno.itastakers.com" },
      { provider: "Keplr", address: "https://lcd-juno.keplr.app" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://rpc-juno.itastakers.com" },
      { provider: "Keplr", address: "https://rpc-juno.keplr.app" }
    ],
    sdk_version: "0.44.5",
    coin_type: "118",
    min_tx_fee: "5000",
    addr_prefix: "juno",
    logo: "/logos/juno.png",
    assets: [{
      base: "ujuno",
      symbol: "JUNO",
      exponent: "6",
      coingecko_id: "juno-network",
      logo: "/logos/juno.png"
    }],
    is_testnet: false
  },
  {
    chain_name: "Sei Testnet",
    registry_name: "sei-testnet",
    api: [
      { provider: "Skuuy", address: "https://sei-testnet-api.polkachu.com" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://sei-testnet-rpc.polkachu.com" }
    ],
    sdk_version: "0.46.0",
    coin_type: "118",
    min_tx_fee: "300",
    addr_prefix: "sei",
    logo: "/logos/sei.png",
    assets: [{
      base: "usei",
      symbol: "SEI",
      exponent: "6",
      coingecko_id: "sei-network",
      logo: "/logos/sei.png"
    }],
    is_testnet: true
  }
];
