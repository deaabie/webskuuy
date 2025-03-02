
import { ChainConfig } from "@/types/cosmos";

export const COSMOS_CHAINS: ChainConfig[] = [
  {
    id: "cosmoshub",
    name: "cosmoshub",
    prettyName: "Cosmos Hub",
    logo: "/cosmos-logos/atom.svg",
    rpc: "https://rpc.cosmos.network",
    rest: "https://rest.cosmos.network",
    denom: "uatom",
    symbol: "ATOM",
    decimals: 6,
    coinGeckoId: "cosmos",
    gasPrice: "0.025uatom",
    explorerUrl: "https://www.mintscan.io/cosmos"
  },
  {
    id: "osmosis",
    name: "osmosis",
    prettyName: "Osmosis",
    logo: "/cosmos-logos/osmo.svg",
    rpc: "https://rpc.osmosis.zone",
    rest: "https://rest.osmosis.zone",
    denom: "uosmo",
    symbol: "OSMO",
    decimals: 6,
    coinGeckoId: "osmosis",
    gasPrice: "0.025uosmo",
    explorerUrl: "https://www.mintscan.io/osmosis"
  },
  {
    id: "juno",
    name: "juno",
    prettyName: "Juno",
    logo: "/cosmos-logos/juno.svg",
    rpc: "https://rpc.juno.strange.love",
    rest: "https://api.juno.strange.love",
    denom: "ujuno",
    symbol: "JUNO",
    decimals: 6,
    coinGeckoId: "juno-network",
    gasPrice: "0.025ujuno",
    explorerUrl: "https://www.mintscan.io/juno"
  },
  {
    id: "stargaze",
    name: "stargaze",
    prettyName: "Stargaze",
    logo: "/cosmos-logos/stars.svg",
    rpc: "https://rpc.stargaze-apis.com",
    rest: "https://rest.stargaze-apis.com",
    denom: "ustars",
    symbol: "STARS",
    decimals: 6,
    coinGeckoId: "stargaze",
    gasPrice: "0.025ustars",
    explorerUrl: "https://www.mintscan.io/stargaze"
  }
];

export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return COSMOS_CHAINS.find(chain => chain.id === chainId);
};
