
import { NetworkConfig } from "@/components/faucet/types";

// IMPORTANT: This is for DEMO purposes only
// In a real application, NEVER store private keys in the frontend code
// Use environment variables or a secure key management service
export const FAUCET_PRIVATE_KEY = "802c18efdad3bf8eddb070847774db4c841d914ac8e04f79707f33ed781daecd";

// Amount to send for each claim (in ether)
export const CLAIM_AMOUNT = "0.001";

// Network configuration with RPC URLs
export const NETWORK_CONFIG: Record<string, NetworkConfig> = {
  ethereum_sepolia: {
    id: "ethereum_sepolia",
    rpcUrl: 'https://sepolia.drpc.org', // Public gateway with API key
    chainId: 11155111, // Sepolia
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io/tx/'
  },
  ethereum_holesky: {
    id: "ethereum_holesky",
    rpcUrl: 'https://ethereum-holesky.publicnode.com',
    chainId: 17000, // Holesky
    name: 'Ethereum Holesky',
    symbol: 'ETH',
    explorer: 'https://holesky.etherscan.io/tx/'
  },
  ethereum_base: {
    id: "ethereum_base",
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532, // Base Goerli
    name: 'Ethereum Base',
    symbol: 'ETH',
    explorer: 'https://sepolia.basescan.org/tx/'
  },
  ethereum_optimism: {
    id: "ethereum_optimism",
    rpcUrl: 'https://sepolia.optimism.io',
    chainId: 11155420, // Optimism Goerli
    name: 'Ethereum Optimism',
    symbol: 'ETH',
    explorer: 'https://sepolia-optimism.etherscan.io//tx/'
  },
  ethereum_arbitrum: {
    id: "ethereum_arbitrum",
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 421613, // Arbitrum Sepolia
    name: 'Ethereum Arbitrum',
    symbol: 'ETH',
    explorer: 'https://sepolia.arbiscan.io/tx/'
  }
};
