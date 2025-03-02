
export interface ChainConfig {
  id: string;
  name: string;
  prettyName: string;
  logo: string;
  rpc: string;
  rest: string;
  denom: string;
  symbol: string;
  decimals: number;
  coinGeckoId?: string;
  gasPrice?: string;
  explorerUrl?: string;
}

export interface Validator {
  address: string;
  operatorAddress: string;
  consensusPubkey: string;
  jailed: boolean;
  status: string;
  tokens: string;
  delegatorShares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    securityContact: string;
    details: string;
  };
  commission: {
    commissionRates: {
      rate: string;
      maxRate: string;
      maxChangeRate: string;
    };
    updateTime: string;
  };
  uptime: number;
  minSelfDelegation: string;
  unbondingHeight: string;
  unbondingTime: string;
  rank?: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: string;
  finalTallyResult: {
    yes: string;
    no: string;
    abstain: string;
    noWithVeto: string;
  };
  submitTime: string;
  depositEndTime: string;
  totalDeposit: Array<{
    denom: string;
    amount: string;
  }>;
  votingStartTime: string;
  votingEndTime: string;
  proposer: string;
  type: string;
}

export interface Block {
  height: string;
  hash: string;
  time: string;
  proposer: string;
  txCount: number;
}

export interface CosmosExplorerStats {
  blockHeight: string;
  blockTime: string;
  totalValidators: number;
  activeValidators: number;
  totalProposals: number;
  activeProposals: number;
  bondedTokens: string;
  totalSupply: string;
  communityPool: string;
  inflation: string;
}
