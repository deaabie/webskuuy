
import { NetworkConfig } from "@/components/faucet/types";

// ----------------------------------------------
// TESTNET NETWORKS CONFIGURATION
// ----------------------------------------------
const TESTNETS: Record<string, NetworkConfig> = {
  // Ethereum Testnets
  ethereum_sepolia: {
    id: "ethereum_sepolia",
    rpcUrl: 'https://sepolia.drpc.org',
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  ethereum_holesky: {
    id: "ethereum_holesky",
    rpcUrl: 'https://ethereum-holesky.publicnode.com',
    chainId: 17000,
    name: 'Ethereum Holesky',
    symbol: 'ETH',
    explorer: 'https://holesky.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  
  // Layer 2 Testnets
  base_sepolia: {
    id: "base_sepolia",
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    name: 'Base Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.basescan.org/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png'
  },
  optimism_sepolia: {
    id: "optimism_sepolia",
    rpcUrl: 'https://sepolia.optimism.io',
    chainId: 11155420,
    name: 'Optimism Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia-optimism.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/optimism-ethereum-op-logo.png'
  },
  monad_testnet: {
    id: "monad_testnet",
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    chainId: 10143,
    name: 'Monad ',
    symbol: 'MON',
    explorer: 'https://testnet.monadexplorer.com/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/monad.png'
  },
  blast_sepolia: {
    id: "blast_sepolia",
    rpcUrl: 'https://sepolia.blast.io',
    chainId: 168587773,
    name: 'Blast Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.blastscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/blast.png'
  },
  
  // Non-EVM Networks
  citrea_testnet: {
    id: "citrea_testnet",
    rpcUrl: 'https://rpc.testnet.citrea.xyz',
    chainId: 17000,
    name: 'Citrea ',
    symbol: 'cBTC',
    explorer: 'https://explorer.testnet.citrea.xyz/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/citrea.png'
  },
  berachain_testnet: {
    id: "berachain_testnet",
    rpcUrl: 'https://bepolia.rpc.berachain.com',
    chainId: 80069,
    name: 'Berachain Bepolia',
    symbol: 'BERA',
    explorer: 'https://bepolia.beratrail.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/berachain.png'
  },
  Plume_testnet: {
    id: "Plume_testnet",
    rpcUrl: 'https://testnet-rpc.plumenetwork.xyz',
    chainId: 98867,
    name: 'Plume Testnet',
    symbol: 'PLUME',
    explorer: 'https://testnet-explorer.plume.org/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/pETH-icon.png'
  },
  Xrpl_testnet: {
    id: "Xrpl_testnet",
    rpcUrl: 'https://rpc.testnet.xrplevm.org',
    chainId: 1449000,
    name: 'XRPL EVM',
    symbol: 'XRP',
    explorer: 'https://explorer.testnet.xrplevm.org/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/XRPLevm.png'
  },
  Rome_protocol: {
    id: "Rome_protocol",
    rpcUrl: 'https://rome.testnet.romeprotocol.xyz',
    chainId: 200018,
    name: 'ROME EVM',
    symbol: 'ROME',
    explorer: 'https://rome.testnet.romeprotocol.xyz:1000/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/rome.png'
  }
};

// ----------------------------------------------
// MAINNET NETWORKS CONFIGURATION
// ----------------------------------------------
const MAINNETS: Record<string, NetworkConfig> = {
  // Ethereum Mainnet
  ethereum_mainnet: {
    id: "ethereum_mainnet",
    rpcUrl: 'https://eth.public-rpc.com',
    chainId: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  
  // Layer 2 Mainnets
  optimism_mainnet: {
    id: "optimism_mainnet",
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: 10,
    name: 'Optimism',
    symbol: 'ETH',
    explorer: 'https://optimistic.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/optimism-ethereum-op-logo.png'
  },
  arbitrum_mainnet: {
    id: "arbitrum_mainnet",
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/arbitrum-arb-logo.png'
  },
  base_mainnet: {
    id: "base_mainnet",
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    name: 'Base',
    symbol: 'ETH',
    explorer: 'https://basescan.org/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png'
  },
  blast_mainnet: {
    id: "blast_mainnet",
    rpcUrl: 'https://rpc.blast.io',
    chainId: 81457,
    name: 'Blast',
    symbol: 'ETH',
    explorer: 'https://blastscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/blast.png'
  },
  berachain_mainnet: {
    id: "berachain_mainnet",
    rpcUrl: 'https://rpc.berachain.com',
    chainId: 80094,
    name: 'BERA',
    symbol: 'BERA',
    explorer: 'https://berascan.com/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/berachain.png'
  }
};

// ----------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------

/**
 * Get network configuration by id
 * @param networkId The network id to look up
 * @returns The network configuration or undefined if not found
 */
export function getNetworkById(networkId: string): NetworkConfig | undefined {
  return TESTNETS[networkId] || MAINNETS[networkId];
}

/**
 * Get all testnets
 * @returns All testnet configurations
 */
export function getTestnets(): Record<string, NetworkConfig> {
  return TESTNETS;
}

/**
 * Get all mainnets
 * @returns All mainnet configurations
 */
export function getMainnets(): Record<string, NetworkConfig> {
  return MAINNETS;
}

/**
 * Get all networks (both testnet and mainnet)
 * @returns Combined object with all network configurations
 */
export function getAllNetworks(): Record<string, NetworkConfig> {
  return { ...TESTNETS, ...MAINNETS };
}

// Export the combined network configuration for backwards compatibility
export const DEPLOY_NETWORK_CONFIG: Record<string, NetworkConfig> = getAllNetworks();

// Export the separate network configurations
export { TESTNETS, MAINNETS };
