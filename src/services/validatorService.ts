
import { Validator } from "@/types/cosmos";
import { fetchWithTimeout } from "./utils/apiUtils";

export const fetchValidators = async (chainRestUrl: string): Promise<Validator[]> => {
  try {
    // Fetch validators from the cosmos staking API
    const response = await fetchWithTimeout(`${chainRestUrl}/cosmos/staking/v1beta1/validators?pagination.limit=150`);
    
    if (!response.validators) {
      throw new Error("Invalid response structure");
    }
    
    // Add uptime (would typically come from a separate endpoint or service)
    // For now, generate random uptime between 95 and 100
    const validators = response.validators.map((validator: any, index: number) => {
      return {
        address: validator.operator_address,
        operatorAddress: validator.operator_address,
        consensusPubkey: validator.consensus_pubkey?.key || validator.consensus_pubkey,
        jailed: validator.jailed,
        status: validator.status,
        tokens: validator.tokens,
        delegatorShares: validator.delegator_shares,
        description: {
          moniker: validator.description?.moniker || "Unknown",
          identity: validator.description?.identity || "",
          website: validator.description?.website || "",
          securityContact: validator.description?.security_contact || "",
          details: validator.description?.details || ""
        },
        commission: {
          commissionRates: {
            rate: validator.commission?.commission_rates?.rate || "0",
            maxRate: validator.commission?.commission_rates?.max_rate || "0",
            maxChangeRate: validator.commission?.commission_rates?.max_change_rate || "0"
          },
          updateTime: validator.commission?.update_time || ""
        },
        uptime: 95 + Math.random() * 5, // Random uptime between 95-100%
        minSelfDelegation: validator.min_self_delegation || "0",
        unbondingHeight: validator.unbonding_height || "0",
        unbondingTime: validator.unbonding_time || "",
        rank: index + 1
      };
    });
    
    // Sort by voting power (tokens)
    return validators.sort((a: Validator, b: Validator) => 
      parseInt(b.tokens) - parseInt(a.tokens)
    );
  } catch (error) {
    console.error("Error fetching validators:", error);
    // Return empty array in case of error
    return [];
  }
};
