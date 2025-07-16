
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/monad.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/blast.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/citrea.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/berachain.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/pETH-icon.png',
});

const xrplTestnet = defineChain({
  id: 1449000,
  name: 'XRPL Sidechain',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/XRPLevm.png',
});

const romeProtocol = defineChain({
  id: 121214,
  name: 'ROME EVM',
  nativeCurrency: {
    decimals: 18,
    name: 'Rome',
    symbol: 'RSOL',
  },
  rpcUrls: {
    default: {
      http: ['https://martius-i.testnet.romeprotocol.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Rome Explorer', url: 'https://romescout-martius-i.testnet.romeprotocol.xyz' },
  },
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/rome.png',
});

const nexus = defineChain({
  id: 3940,
  name: 'NEXUS',
  nativeCurrency: {
    decimals: 18,
    name: 'Nexus',
    symbol: 'NEX',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet3.rpc.nexus.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Nexus Explorer', url: 'https://testnet3.explorer.nexus.xyz' },
  },
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/nexus_logo-only%404x.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/blast.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/pETH-icon.png',
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
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/berachain.png',
});

// Add iconUrl to existing chains to ensure images show up
const enhancedMainnet = {
  ...mainnet,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png',
};

const enhancedPolygon = {
  ...polygon,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/polygon.png',
};

const enhancedOptimism = {
  ...optimism,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/optimism-ethereum-op-logo.png',
};

const enhancedArbitrum = {
  ...arbitrum,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/arbitrum-arb-logo.png',
};

const enhancedBase = {
  ...base,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png',
};

const enhancedSepolia = {
  ...sepolia,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png',
};

const enhancedPolygonAmoy = {
  ...polygonAmoy,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/polygon.png',
};

const enhancedOptimismSepolia = {
  ...optimismSepolia,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/optimism-ethereum-op-logo.png',
};

const enhancedArbitrumSepolia = {
  ...arbitrumSepolia,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/arbitrum-arb-logo.png',
};

const enhancedBaseSepolia = {
  ...baseSepolia,
  iconUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png',
};

export const config = getDefaultConfig({
  appName: 'Skuuy Deploy',
  projectId: '42b8f4a9400c7fc2a971e0d728c89600',
  chains: [
    // Mainnets
    enhancedMainnet,
    enhancedPolygon,
    enhancedOptimism,
    enhancedArbitrum,
    enhancedBase,
    blastMainnet,
    plumeMainnet,
    berachainMainnet,
    
    // Testnets
    enhancedSepolia,
    ethereumHolesky,
    enhancedPolygonAmoy,
    enhancedOptimismSepolia,
    enhancedArbitrumSepolia,
    enhancedBaseSepolia,
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
