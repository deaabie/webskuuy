
import { Validator, Proposal, Block, CosmosExplorerStats } from "@/types/cosmos";

// Mock data for demonstration purposes
// In a real implementation, you would fetch this data from the REST API endpoints
export const fetchValidators = async (chainRestUrl: string): Promise<Validator[]> => {
  // This would be an actual API call in production
  // const response = await fetch(`${chainRestUrl}/cosmos/staking/v1beta1/validators?pagination.limit=150`);
  // const data = await response.json();
  // return data.validators;

  // Mock data for demonstration
  return [
    {
      address: "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0",
      operatorAddress: "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0",
      consensusPubkey: "cosmosvalconspub1zcjduepqdsxgwgkh5nn0mhmx2rttus9mz2mnl04zhgmr0qjmt7x5rv0unjysejt08h",
      jailed: false,
      status: "BOND_STATUS_BONDED",
      tokens: "14528904829",
      delegatorShares: "14528904829.000000000000000000",
      description: {
        moniker: "Binance Node",
        identity: "2116459C0EC3F617",
        website: "https://binance.org",
        securityContact: "",
        details: "Binance Exchange Validator"
      },
      commission: {
        commissionRates: {
          rate: "0.100000000000000000",
          maxRate: "0.200000000000000000",
          maxChangeRate: "0.010000000000000000"
        },
        updateTime: "2019-03-13T23:00:00Z"
      },
      uptime: 99.98,
      minSelfDelegation: "1000000",
      unbondingHeight: "0",
      unbondingTime: "1970-01-01T00:00:00Z",
      rank: 1
    },
    {
      address: "cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf",
      operatorAddress: "cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf",
      consensusPubkey: "cosmosvalconspub1zcjduepqdlqk53a59fsfvz0cn3qpzr8838da0zxy64h5lzcf4qpvx9lyqgtqse3rux",
      jailed: false,
      status: "BOND_STATUS_BONDED",
      tokens: "12365904523",
      delegatorShares: "12365904523.000000000000000000",
      description: {
        moniker: "Kraken",
        identity: "5179D0AF3260191D",
        website: "https://kraken.com",
        securityContact: "",
        details: "Kraken Exchange Validator"
      },
      commission: {
        commissionRates: {
          rate: "0.050000000000000000",
          maxRate: "0.100000000000000000",
          maxChangeRate: "0.010000000000000000"
        },
        updateTime: "2019-05-15T12:00:00Z"
      },
      uptime: 99.95,
      minSelfDelegation: "1000000",
      unbondingHeight: "0",
      unbondingTime: "1970-01-01T00:00:00Z",
      rank: 2
    },
    {
      address: "cosmosvaloper1z8zjv3lntpwxua0rtpvgrcwl0nm0tltgpgs6l7",
      operatorAddress: "cosmosvaloper1z8zjv3lntpwxua0rtpvgrcwl0nm0tltgpgs6l7",
      consensusPubkey: "cosmosvalconspub1zcjduepq0dc9apn3pz2x2qyujcnl2heqq4aceput73rqnkyd4he9up7z83qswuyl7k",
      jailed: false,
      status: "BOND_STATUS_BONDED",
      tokens: "10254782398",
      delegatorShares: "10254782398.000000000000000000",
      description: {
        moniker: "Figment",
        identity: "E5F274B870BDA01D",
        website: "https://figment.io",
        securityContact: "contact@figment.io",
        details: "Enterprise-grade staking infrastructure provider"
      },
      commission: {
        commissionRates: {
          rate: "0.080000000000000000",
          maxRate: "0.200000000000000000",
          maxChangeRate: "0.010000000000000000"
        },
        updateTime: "2019-03-11T10:00:00Z"
      },
      uptime: 100,
      minSelfDelegation: "1000000",
      unbondingHeight: "0",
      unbondingTime: "1970-01-01T00:00:00Z",
      rank: 3
    }
  ];
};

export const fetchProposals = async (chainRestUrl: string): Promise<Proposal[]> => {
  // Mock data for demonstration
  return [
    {
      id: "85",
      title: "Increase Community Pool Allocation",
      description: "This proposal aims to increase the percentage of block rewards that go to the community pool from 2% to 5%.",
      status: "PROPOSAL_STATUS_VOTING_PERIOD",
      finalTallyResult: {
        yes: "0",
        no: "0",
        abstain: "0",
        noWithVeto: "0"
      },
      submitTime: "2023-09-10T15:30:45Z",
      depositEndTime: "2023-09-12T15:30:45Z",
      totalDeposit: [
        {
          denom: "uatom",
          amount: "512000000"
        }
      ],
      votingStartTime: "2023-09-10T16:20:12Z",
      votingEndTime: "2023-09-24T16:20:12Z",
      proposer: "cosmos1abcdefghijklmnopqrstuvwxyz123456789",
      type: "TextProposal"
    },
    {
      id: "84",
      title: "Parameter Change: Reduce Unbonding Period",
      description: "Proposal to reduce the unbonding period from 21 days to 14 days to improve capital efficiency.",
      status: "PROPOSAL_STATUS_PASSED",
      finalTallyResult: {
        yes: "152350400000",
        no: "23450200000",
        abstain: "1256000000",
        noWithVeto: "450300000"
      },
      submitTime: "2023-08-15T10:45:32Z",
      depositEndTime: "2023-08-17T10:45:32Z",
      totalDeposit: [
        {
          denom: "uatom",
          amount: "512000000"
        }
      ],
      votingStartTime: "2023-08-15T11:30:00Z",
      votingEndTime: "2023-08-29T11:30:00Z",
      proposer: "cosmos1qrstuvwxyzabcdefghijklmnop987654321",
      type: "ParameterChangeProposal"
    }
  ];
};

export const fetchBlocks = async (chainRestUrl: string): Promise<Block[]> => {
  // Mock data for demonstration
  const currentTime = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const blockTime = new Date(currentTime);
    blockTime.setSeconds(blockTime.getSeconds() - i * 6);
    return {
      height: (16250000 - i).toString(),
      hash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      time: blockTime.toISOString(),
      proposer: `cosmos1${Math.random().toString(36).substring(2, 12)}`,
      txCount: Math.floor(Math.random() * 20)
    };
  });
};

export const fetchStats = async (chainRestUrl: string): Promise<CosmosExplorerStats> => {
  // Mock data for demonstration
  return {
    blockHeight: "16250000",
    blockTime: "6.05",
    totalValidators: 175,
    activeValidators: 150,
    totalProposals: 85,
    activeProposals: 1,
    bondedTokens: "182456900000000",
    totalSupply: "325764500000000",
    communityPool: "15287300000000",
    inflation: "7.53"
  };
};
