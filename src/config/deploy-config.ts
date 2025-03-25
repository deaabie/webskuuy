
import { NetworkConfig } from "@/components/faucet/types";

// Network configuration with RPC URLs and explorer information
export const DEPLOY_NETWORK_CONFIG: Record<string, NetworkConfig> = {
  ethereum_sepolia: {
    id: "ethereum_sepolia",
    rpcUrl: 'https://sepolia.drpc.org',
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

// Add gas limit configuration for deployment
export const DEPLOYMENT_GAS_LIMIT = 3000000;

// Gas price configuration (in gwei)
export const GAS_PRICE_CONFIG = {
  maxFeePerGas: "5",
  maxPriorityFeePerGas: "1"
};
