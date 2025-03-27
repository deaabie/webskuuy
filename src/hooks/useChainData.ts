
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChainConfig, 
  BlockchainStats, 
  Validator, 
  Block, 
  Transaction,
  Proposal,
  getBlockchainStats,
  getValidators,
  getBlocks,
  getTransactions,
  getProposals
} from '@/services/cosmosService';
import { toast } from '@/components/ui/use-toast';

export const useChainData = (
  chain: ChainConfig | null,
  activeEndpoint: {api: string, rpc: string},
  activeTab: string
) => {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  
  const lastFetchRef = useRef<Record<string, number>>({
    stats: 0,
    validators: 0,
    blocks: 0,
    proposals: 0,
    transactions: 0
  });
  
  const fetchInProgressRef = useRef<Record<string, boolean>>({
    stats: false,
    validators: false,
    blocks: false,
    proposals: false,
    transactions: false
  });

  const statsPlaceholder: BlockchainStats = {
    height: 0,
    validators: {
      total: 0,
      active: 0,
    },
    supply: {
      total: "0",
      circulating: "0",
    },
    blockTime: 0,
    communityPool: "0",
    inflation: "0%",
    stakingAPR: "0%",
    bondedTokens: "0"
  };

  const fetchBlockchainData = useCallback(async (forceRefresh = false) => {
    if (!chain || !activeEndpoint.api || !activeEndpoint.rpc) return;
    
    const now = Date.now();
    const refreshInterval = 2000; // 2 seconds
    
    try {
      if ((forceRefresh || now - lastFetchRef.current.stats > refreshInterval) && !fetchInProgressRef.current.stats) {
        fetchInProgressRef.current.stats = true;
        try {
          console.log("Fetching stats...");
          const statsData = await getBlockchainStats(activeEndpoint.rpc, activeEndpoint.api);
          setStats(prev => {
            if (!prev || statsData.height !== prev.height) {
              return statsData;
            }
            return prev;
          });
          lastFetchRef.current.stats = now;
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          fetchInProgressRef.current.stats = false;
        }
      }
      
      if ((forceRefresh || now - lastFetchRef.current.blocks > refreshInterval) && !fetchInProgressRef.current.blocks) {
        fetchInProgressRef.current.blocks = true;
        try {
          console.log("Fetching blocks...");
          const blocksData = await getBlocks(activeEndpoint.rpc, 10);
          setBlocks(prev => {
            if (blocksData.length > 0 && (!prev.length || blocksData[0].height !== prev[0]?.height)) {
              return blocksData;
            }
            return prev;
          });
          lastFetchRef.current.blocks = now;
        } catch (error) {
          console.error('Error fetching blocks:', error);
        } finally {
          fetchInProgressRef.current.blocks = false;
        }
      }
      
      if ((activeTab === 'validators' || activeTab === 'overview') && 
          (forceRefresh || now - lastFetchRef.current.validators > refreshInterval) && 
          !fetchInProgressRef.current.validators) {
        fetchInProgressRef.current.validators = true;
        try {
          console.log("Fetching validators...");
          const validatorsData = await getValidators(activeEndpoint.api);
          setValidators(validatorsData);
          lastFetchRef.current.validators = now;
        } catch (error) {
          console.error('Error fetching validators:', error);
        } finally {
          fetchInProgressRef.current.validators = false;
        }
      }
      
      if ((activeTab === 'government' || activeTab === 'overview') && 
          (forceRefresh || now - lastFetchRef.current.proposals > refreshInterval) && 
          !fetchInProgressRef.current.proposals) {
        fetchInProgressRef.current.proposals = true;
        try {
          console.log("Fetching proposals...");
          const proposalsData = await getProposals(activeEndpoint.api, 100);
          setProposals(proposalsData);
          lastFetchRef.current.proposals = now;
        } catch (error) {
          console.error('Error fetching proposals:', error);
        } finally {
          fetchInProgressRef.current.proposals = false;
        }
      }
      
      if ((activeTab === 'blocks' || activeTab === 'overview') && 
          (forceRefresh || now - lastFetchRef.current.transactions > refreshInterval) && 
          !fetchInProgressRef.current.transactions) {
        fetchInProgressRef.current.transactions = true;
        try {
          console.log("Fetching transactions...");
          const txsData = await getTransactions(activeEndpoint.api);
          setTransactions(txsData);
          lastFetchRef.current.transactions = now;
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          fetchInProgressRef.current.transactions = false;
        }
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      if (forceRefresh) {
        toast({
          title: "Error fetching data",
          description: "Could not retrieve blockchain data. Please try again later.",
          variant: "destructive"
        });
      }
    }
  }, [chain, activeEndpoint, activeTab]);

  return {
    stats: stats || statsPlaceholder,
    validators,
    blocks,
    transactions,
    proposals,
    fetchBlockchainData
  };
};
