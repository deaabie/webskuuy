
import { useState, useEffect } from "react";
import { Block, ChainConfig, CosmosExplorerStats, Proposal, Validator } from "@/types/cosmos";
import { fetchValidators, fetchProposals, fetchBlocks, fetchStats } from "@/services/cosmosService";
import { toast } from "sonner";

export function useCosmosData(selectedChain: ChainConfig, activeTab: string) {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<CosmosExplorerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedChain) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const statsData = await fetchStats(selectedChain.rest);
        setStats(statsData);
        
        if (activeTab === "validators" || !activeTab) {
          const validatorsData = await fetchValidators(selectedChain.rest);
          setValidators(validatorsData);
        }
        
        if (activeTab === "proposals") {
          const proposalsData = await fetchProposals(selectedChain.rest);
          setProposals(proposalsData);
        }
        
        if (activeTab === "blocks") {
          const blocksData = await fetchBlocks(selectedChain.rest);
          setBlocks(blocksData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to fetch data from the blockchain. Please try again later.");
        toast.error("Connection error", {
          description: "Failed to connect to the blockchain. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedChain?.rest, activeTab]);

  const loadDataForTab = async (tabValue: string) => {
    if (tabValue === "validators" && validators.length === 0) {
      try {
        setLoading(true);
        const validatorsData = await fetchValidators(selectedChain.rest);
        setValidators(validatorsData);
      } catch (error) {
        console.error("Error loading validators:", error);
        toast.error("Failed to load validators");
      } finally {
        setLoading(false);
      }
    }
    
    if (tabValue === "proposals" && proposals.length === 0) {
      try {
        setLoading(true);
        const proposalsData = await fetchProposals(selectedChain.rest);
        setProposals(proposalsData);
      } catch (error) {
        console.error("Error loading proposals:", error);
        toast.error("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    }
    
    if (tabValue === "blocks" && blocks.length === 0) {
      try {
        setLoading(true);
        const blocksData = await fetchBlocks(selectedChain.rest);
        setBlocks(blocksData);
      } catch (error) {
        console.error("Error loading blocks:", error);
        toast.error("Failed to load blocks");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    validators,
    proposals,
    blocks,
    stats,
    loading,
    error,
    loadDataForTab
  };
}
