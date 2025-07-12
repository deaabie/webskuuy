
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
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

export const config = getDefaultConfig({
  appName: 'Skuuy Deploy',
  projectId: '42b8f4a9400c7fc2a971e0d728c89600',
  chains: [
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
  ],
  ssr: false,
});
