
import { NetworkConfig } from "@/components/faucet/types";

// IMPORTANT: This is for DEMO purposes only
// In a real application, NEVER store private keys in the frontend code
// Use environment variables or a secure key management service
export const FAUCET_PRIVATE_KEY = "802c18efdad3bf8eddb070847774db4c841d914ac8e04f79707f33ed781daecd";

// Amount to send for each claim (in ether)
export const CLAIM_AMOUNT = "0.001";

// Network configuration with RPC URLs - updated to match the latest testnet networks
export const NETWORK_CONFIG: Record<string, NetworkConfig> = {
  ethereum_sepolia: {
    id: "ethereum_sepolia",
    rpcUrl: 'https://sepolia.drpc.org', // Public gateway with API key
    chainId: 11155111, // Sepolia
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png'
  },
  ethereum_holesky: {
    id: "ethereum_holesky",
    rpcUrl: 'https://ethereum-holesky.publicnode.com',
    chainId: 17000, // Holesky
    name: 'Ethereum Holesky',
    symbol: 'ETH',
    explorer: 'https://holesky.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png'
  },
  base_sepolia: {
    id: "base_sepolia",
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532, // Base Sepolia
    name: 'Base Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.basescan.org/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png'
  },
  optimism_sepolia: {
    id: "optimism_sepolia",
    rpcUrl: 'https://sepolia.optimism.io',
    chainId: 11155420, // Optimism Sepolia
    name: 'Optimism Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia-optimism.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/optimism-logo.svg'
  },
  arbitrum_sepolia: {
    id: "arbitrum_sepolia",
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 421614, // Arbitrum Sepolia
    name: 'Arbitrum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.arbiscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/OffchainLabs/arbitrum-token/main/arbitrum-token-logo.png'
  },
  blast_sepolia: {
    id: "blast_sepolia",
    rpcUrl: 'https://sepolia.blast.io',
    chainId: 168587773, // Blast Sepolia
    name: 'Blast Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.blastscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/blastapi/blast-brand-assets/main/Branding%20Assets/Blast%20Logo%20-%20Black%20Wordmark%20-%20RGB.png'
  }
};
