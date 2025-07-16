
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

// Define custom chains that match your deploy configuration exactly
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
  name: 'Monad',
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
  id: 5115,
  name: 'Citrea',
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

const plumeTestnet = defineChain({
  id: 98867,
  name: 'Plume Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Plume',
    symbol: 'PLUME',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.plumenetwork.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Plume Explorer', url: 'https://testnet-explorer.plume.org' },
  },
});

const xrplTestnet = defineChain({
  id: 1440000,
  name: 'XRPL EVM',
  nativeCurrency: {
    decimals: 18,
    name: 'XRP',
    symbol: 'XRP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.xrplevm.org'],
    },
  },
  blockExplorers: {
    default: { name: 'XRPL Explorer', url: 'https://explorer.testnet.xrplevm.org' },
  },
});

const romeProtocol = defineChain({
  id: 200018,
  name: 'ROME EVM',
  nativeCurrency: {
    decimals: 18,
    name: 'Rome',
    symbol: 'ROME',
  },
  rpcUrls: {
    default: {
      http: ['https://rome.testnet.romeprotocol.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Rome Explorer', url: 'https://rome.testnet.romeprotocol.xyz:1000' },
  },
});

const nexus = defineChain({
  id: 393,
  name: 'NEXUS',
  nativeCurrency: {
    decimals: 18,
    name: 'Nexus',
    symbol: 'NEX',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.nexus.xyz/http'],
    },
  },
  blockExplorers: {
    default: { name: 'Nexus Explorer', url: 'https://nexus-new.explorer.caldera.xyz' },
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

const plumeMainnet = defineChain({
  id: 98866,
  name: 'PLUME',
  nativeCurrency: {
    decimals: 18,
    name: 'Plume',
    symbol: 'PLUME',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.plume.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Plume Explorer', url: 'https://explorer.plume.org' },
  },
});

const berachainMainnet = defineChain({
  id: 80094,
  name: 'BERA',
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
    plumeMainnet,
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
    plumeTestnet,
    xrplTestnet,
    romeProtocol,
    nexus,
  ],
  ssr: false,
});
