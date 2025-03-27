
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Coins, Award, Timer, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';

interface Validator {
  address: string;
  moniker: string;
  amount: string;
}

interface AccountInfo {
  address: string;
  balance: string;
  delegations: string;
  rewards: string;
  unbonding: string;
  validators: Validator[];
}

interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  address: string | null;
  apiUrl: string | undefined;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  address,
  apiUrl
}) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!address || !apiUrl || !isOpen) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch account balances
        const balanceResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/balances/${address}`);
        const balances = balanceResponse.data.balances;
        const balance = balances.length > 0 ? 
          `${balances[0].amount} ${balances[0].denom}` : 
          "0";
        
        // Fetch delegations
        const delegationsResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/delegations/${address}`);
        const delegationItems = delegationsResponse.data.delegation_responses || [];
        const totalDelegated = delegationItems.reduce((sum: number, item: any) => 
          sum + parseInt(item.balance.amount), 0);
        
        // Fetch rewards
        const rewardsResponse = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/delegators/${address}/rewards`);
        const rewardsTotal = rewardsResponse.data.total || [];
        const rewards = rewardsTotal.length > 0 ? 
          `${Math.floor(parseInt(rewardsTotal[0].amount) / 1000000)} ${rewardsTotal[0].denom}` : 
          "0";
        
        // Fetch unbonding
        const unbondingResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`);
        const unbondingItems = unbondingResponse.data.unbonding_responses || [];
        let totalUnbonding = 0;
        
        unbondingItems.forEach((unbonding: any) => {
          unbonding.entries.forEach((entry: any) => {
            totalUnbonding += parseInt(entry.balance);
          });
        });
        
        // Build validators list with details
        const validators: Validator[] = [];
        for (const delegation of delegationItems) {
          try {
            // Get validator details
            const validatorResponse = await axios.get(
              `${apiUrl}/cosmos/staking/v1beta1/validators/${delegation.delegation.validator_address}`
            );
            
            const validator = validatorResponse.data.validator;
            validators.push({
              address: delegation.delegation.validator_address,
              moniker: validator.description.moniker || "Unknown Validator",
              amount: `${parseInt(delegation.balance.amount) / 1000000} ${delegation.balance.denom}`,
            });
          } catch (err) {
            console.error("Error fetching validator details:", err);
            // Add with limited info if validator details can't be fetched
            validators.push({
              address: delegation.delegation.validator_address,
              moniker: "Unknown Validator",
              amount: `${parseInt(delegation.balance.amount) / 1000000} ${delegation.balance.denom}`,
            });
          }
        }
        
        setAccountInfo({
          address,
          balance: balance,
          delegations: `${totalDelegated / 1000000} ${delegationItems[0]?.balance.denom || "tokens"}`,
          rewards: rewards,
          unbonding: `${totalUnbonding / 1000000} ${delegationItems[0]?.balance.denom || "tokens"}`,
          validators
        });
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError('Failed to fetch account details. Please try again later.');
        
        // Set fallback data
        setAccountInfo({
          address,
          balance: "Unknown",
          delegations: "Unknown",
          rewards: "Unknown",
          unbonding: "Unknown",
          validators: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountDetails();
  }, [address, apiUrl, isOpen]);
  
  if (!address) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Account Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="font-mono text-xs break-all mb-4">
            {address}
          </div>
          
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading account details...</p>
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">
              {error}
            </div>
          ) : accountInfo && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-500" />
                      Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{accountInfo.balance}</CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-500" />
                      Delegations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{accountInfo.delegations}</CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{accountInfo.rewards}</CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Timer className="h-4 w-4 text-purple-500" />
                      Unbonding
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{accountInfo.unbonding}</CardContent>
                </Card>
              </div>
              
              {accountInfo.validators.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-500" />
                      Delegations to Validators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {accountInfo.validators.map((validator, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span>{validator.moniker}</span>
                          <span>{validator.amount}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsModal;
