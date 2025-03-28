
import axios from 'axios';
import { Proposal } from './types';

/**
 * Fetches governance proposals from a Cosmos blockchain
 */
export const getProposals = async (apiUrl: string, count: number = 100): Promise<Proposal[]> => {
  try {
    // Try fetching proposals with the latest cosmos SDK format
    const response = await axios.get(`${apiUrl}/cosmos/gov/v1/proposals?pagination.limit=${count}`);
    
    const proposals = response.data.proposals.map((p: any) => ({
      id: p.id,
      title: p.title || p.content?.title || "No Title",
      description: p.summary || p.content?.description || "No Description",
      status: p.status,
      voting_start_time: p.voting_start_time,
      voting_end_time: p.voting_end_time,
      total_deposit: p.total_deposit.length > 0 ? p.total_deposit[0].amount : "0",
      proposer: p.proposer || "Unknown"
    }));
    
    // Sort proposals by voting_start_time in descending order (newest first)
    return proposals.sort((a: Proposal, b: Proposal) => 
      new Date(b.voting_start_time).getTime() - new Date(a.voting_start_time).getTime()
    );
  } catch (error) {
    console.error('Error with latest proposal format, trying fallback:', error);
    
    // Fallback for older cosmos SDK versions
    try {
      const fallbackResponse = await axios.get(`${apiUrl}/cosmos/gov/v1beta1/proposals?pagination.limit=${count}`);
      
      const proposals = fallbackResponse.data.proposals.map((p: any) => ({
        id: p.proposal_id,
        title: p.content?.title || "No Title",
        description: p.content?.description || "No Description",
        status: p.status,
        voting_start_time: p.voting_start_time,
        voting_end_time: p.voting_end_time,
        total_deposit: p.total_deposit.length > 0 ? p.total_deposit[0].amount : "0",
        proposer: "Unknown" // v1beta1 doesn't have proposer info
      }));
      
      // Sort proposals by voting_start_time in descending order (newest first)
      return proposals.sort((a: Proposal, b: Proposal) => 
        new Date(b.voting_start_time).getTime() - new Date(a.voting_start_time).getTime()
      );
    } catch (fallbackError) {
      console.error('Error with fallback proposal format:', fallbackError);
      return [];
    }
  }
};

/**
 * Fetches votes for a specific proposal
 */
export const getProposalVotes = async (apiUrl: string, proposalId: string) => {
  try {
    // Try fetching with the newer v1 API format first
    const response = await axios.get(`${apiUrl}/cosmos/gov/v1/proposals/${proposalId}/tally`);
    
    return {
      yes: response.data.tally.yes_count || "0",
      no: response.data.tally.no_count || "0",
      abstain: response.data.tally.abstain_count || "0",
      no_with_veto: response.data.tally.no_with_veto_count || "0",
      total: (
        BigInt(response.data.tally.yes_count || "0") +
        BigInt(response.data.tally.no_count || "0") +
        BigInt(response.data.tally.abstain_count || "0") +
        BigInt(response.data.tally.no_with_veto_count || "0")
      ).toString(),
    };
  } catch (error) {
    console.error('Error with v1 tally format, trying fallback:', error);
    
    // Fallback for older cosmos SDK v1beta1
    try {
      const fallbackResponse = await axios.get(`${apiUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`);
      
      return {
        yes: fallbackResponse.data.tally.yes || "0",
        no: fallbackResponse.data.tally.no || "0",
        abstain: fallbackResponse.data.tally.abstain || "0",
        no_with_veto: fallbackResponse.data.tally.no_with_veto || "0",
        total: (
          BigInt(fallbackResponse.data.tally.yes || "0") +
          BigInt(fallbackResponse.data.tally.no || "0") +
          BigInt(fallbackResponse.data.tally.abstain || "0") +
          BigInt(fallbackResponse.data.tally.no_with_veto || "0")
        ).toString(),
      };
    } catch (fallbackError) {
      console.error('Error with v1beta1 tally format:', fallbackError);
      return null;
    }
  }
};
