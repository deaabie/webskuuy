
import { createClient } from '@supabase/supabase-js';
import { NetworkConfig } from '@/components/faucet/types';

const supabaseUrl = 'https://vgxewywkaetxpjgzhxee.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZneGV3eXdrYWV0eHBqZ3poeGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTg1MDUsImV4cCI6MjA1NjIzNDUwNX0.qkoWMH7E4_KsoFDM9bBIvQCsquNYCHS0M8PhbPuLIRU';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
    rpcUrl: 'https://sepolia.infura.io/', // Public gateway
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
    rpcUrl: 'https://goerli.base.org',
    chainId: 84531, // Base Goerli
    name: 'Ethereum Base',
    symbol: 'ETH',
    explorer: 'https://goerli.basescan.org/tx/'
  },
  ethereum_optimism: {
    id: "ethereum_optimism",
    rpcUrl: 'https://goerli.optimism.io',
    chainId: 420, // Optimism Goerli
    name: 'Ethereum Optimism',
    symbol: 'ETH',
    explorer: 'https://goerli-optimism.etherscan.io/tx/'
  },
  ethereum_arbitrum: {
    id: "ethereum_arbitrum",
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    chainId: 421613, // Arbitrum Goerli
    name: 'Ethereum Arbitrum',
    symbol: 'ETH',
    explorer: 'https://goerli.arbiscan.io/tx/'
  }
};
