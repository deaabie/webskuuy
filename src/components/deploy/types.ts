
export interface NetworkConfig {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  chainId: number;
  explorer: string;
  icon: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface ContractDeployment {
  network: string;
  address: string;
  txHash: string;
  timestamp: number;
}

export interface DeploymentStatus {
  status: 'idle' | 'compiling' | 'deploying' | 'success' | 'error';
  message?: string;
  contractAddress?: string;
  txHash?: string;
}
