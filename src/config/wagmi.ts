
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  polygonAmoy,
  optimismSepolia,
  arbitrumSepolia,
  baseSepolia,
} from 'wagmi/chains';

// Define custom chains that match your deploy configuration
const ethereumHolesky = defineChain({
  id: 17000,
  name: 'Ethereum Holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://ethereum-holesky.publicnode.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Holesky Explorer', url: 'https://holesky.etherscan.io' },
  },
});

const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
});

const blastSepolia = defineChain({
  id: 168587773,
  name: 'Blast Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.blast.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Blast Sepolia Explorer', url: 'https://sepolia.blastscan.io' },
  },
});

const citreaTestnet = defineChain({
  id: 17000,
  name: 'Citrea Testnet',
  nativeCurrency: {
    decimals: 8,
    name: 'Citrea Bitcoin',
    symbol: 'cBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.citrea.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Citrea Explorer', url: 'https://explorer.testnet.citrea.xyz' },
  },
});

const berachainTestnet = defineChain({
  id: 80069,
  name: 'Berachain Bepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Bera',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://bepolia.rpc.berachain.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Beratrail', url: 'https://bepolia.beratrail.io' },
  },
});

const blastMainnet = defineChain({
  id: 81457,
  name: 'Blast',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.blast.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Blast Explorer', url: 'https://blastscan.io' },
  },
});

const berachainMainnet = defineChain({
  id: 80094,
  name: 'Berachain',
  nativeCurrency: {
    decimals: 18,
    name: 'Bera',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.berachain.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Berascan', url: 'https://berascan.com' },
  },
});

export const config = getDefaultConfig({
  appName: 'Skuuy Deploy',
  projectId: '42b8f4a9400c7fc2a971e0d728c89600',
  chains: [
    // Mainnets
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    blastMainnet,
    berachainMainnet,
    
    // Testnets
    sepolia,
    ethereumHolesky,
    polygonAmoy,
    optimismSepolia,
    arbitrumSepolia,
    baseSepolia,
    monadTestnet,
    blastSepolia,
    citreaTestnet,
    berachainTestnet,
  ],
  ssr: false,
});
