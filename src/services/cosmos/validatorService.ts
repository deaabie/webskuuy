
import axios from 'axios';
import { Validator } from './types';

/**
 * Fetches validator information from a Cosmos blockchain
 */
export const getValidators = async (apiUrl: string): Promise<Validator[]> => {
  try {
    // Fetch up to 500 validators with pagination to ensure we get all active validators
    const response = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators?pagination.limit=500`);
    
    // First try to fetch consensus addresses to match with block proposers
    let consensusAddressMap: Record<string, string> = {};
    
    try {
      const tmValidators = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/validatorsets/latest?pagination.limit=200`);
      
      if (tmValidators.data?.validators) {
        tmValidators.data.validators.forEach((tmValidator: any) => {
          const address = tmValidator.address;
          const pubKey = tmValidator.pub_key?.key;
          if (address && pubKey) {
            consensusAddressMap[pubKey] = address;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching Tendermint validator set:', error);
    }
    
    return response.data.validators.map((v: any) => {
      let consensusAddress;
      
      // Try to find the consensus address using the validator's pubkey
      if (v.consensus_pubkey?.key) {
        consensusAddress = consensusAddressMap[v.consensus_pubkey.key] || v.consensus_pubkey.key;
      }
      
      return {
        address: v.operator_address,
        moniker: v.description.moniker || "Unknown",
        voting_power: v.tokens || "0",
        commission: (parseFloat(v.commission.commission_rates.rate) * 100).toFixed(2) + "%",
        status: v.status === 'BOND_STATUS_BONDED' ? 'Active' : 'Inactive',
        uptime: "100%", // This would require additional data
        account_address: v.consensus_pubkey?.key ? v.consensus_pubkey.key : undefined,
        website: v.description?.website || undefined,
        details: v.description?.details || undefined,
        consensus_address: consensusAddress
      };
    });
  } catch (error) {
    console.error('Error fetching validators:', error);
    return [];
  }
};
