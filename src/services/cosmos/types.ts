
// Types for Cosmos blockchain services

export interface ChainConfig {
  chain_name: string;
  display_name: string;
  chain_id: string;
  api: {provider: string; address: string}[];
  rpc: {provider: string; address: string}[];
  sdk_version: string;
  keplr_features?: string[];
  coin_type: string;
  min_tx_fee: string;
  addr_prefix: string;
  logo: string;
  assets: {
    base: string;
    symbol: string;
    exponent: string;
    coingecko_id: string;
    logo: string;
  }[];
}

export interface BlockchainStats {
  height: number;
  validators: {
    total: number;
    active: number;
  };
  supply: {
    total: string;
    circulating: string;
  };
  blockTime: number;
  communityPool: string;
  inflation: string;
  stakingAPR: string;
}

export interface Validator {
  address: string;
  moniker: string;
  voting_power: string;
  commission: string;
  status: string;
  uptime: string;
  account_address?: string;
  website?: string;
  details?: string;
  consensus_address?: string;
}

export interface Block {
  height: number;
  hash: string;
  proposer: string;
  proposerMoniker?: string;  // Add this new field for the moniker
  txs: number;
  timestamp: string;
}

export interface Transaction {
  hash: string;
  block: number;
  type: string;
  fee: string;
  status: string;
  timestamp: string;
  gas?: string;
  memo?: string;
  sender?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: string;
  voting_start_time: string;
  voting_end_time: string;
  total_deposit: string;
  proposer: string;
}

export interface ChainInfoExtended {
  chain_id: string;
  address_prefix: string;
  sdk_version: string;
  coin_type: string;
  min_tx_fee: string;
  latest_block_height: number;
  latest_block_time: string;
  bonded_tokens_percentage: string;
  staking_ratio: string;
}
