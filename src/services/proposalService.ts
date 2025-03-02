
import { Proposal } from "@/types/cosmos";
import { fetchWithTimeout } from "./utils/apiUtils";

export const fetchProposals = async (chainRestUrl: string): Promise<Proposal[]> => {
  try {
    // Fetch proposals from the governance API
    const response = await fetchWithTimeout(`${chainRestUrl}/cosmos/gov/v1beta1/proposals`);
    
    if (!response.proposals) {
      throw new Error("Invalid response structure");
    }
    
    return response.proposals.map((proposal: any) => {
      return {
        id: proposal.proposal_id,
        title: proposal.content?.title || "Untitled",
        description: proposal.content?.description || "",
        status: proposal.status,
        finalTallyResult: {
          yes: proposal.final_tally_result?.yes || "0",
          no: proposal.final_tally_result?.no || "0",
          abstain: proposal.final_tally_result?.abstain || "0",
          noWithVeto: proposal.final_tally_result?.no_with_veto || "0"
        },
        submitTime: proposal.submit_time,
        depositEndTime: proposal.deposit_end_time,
        totalDeposit: proposal.total_deposit,
        votingStartTime: proposal.voting_start_time,
        votingEndTime: proposal.voting_end_time,
        proposer: proposal.proposer || "",
        type: proposal.content?.["@type"] || proposal.content?.type || "Unknown"
      };
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    // Return empty array in case of error
    return [];
  }
};
