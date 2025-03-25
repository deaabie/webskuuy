
export interface NetworkConfig {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  chainId: number;
  explorer: string;
  imageUrl?: string;
}

export interface TransactionDetails {
  txHash: string;
  amount: string;
  network: string;
  symbol: string;
  explorerUrl: string;
}
