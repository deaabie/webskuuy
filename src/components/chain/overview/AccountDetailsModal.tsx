
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, CreditCard, Landmark, Timer, ArrowDownToLine } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import axios from 'axios';

interface Delegation {
  validator: string;
  amount: string;
}

interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: string | null;
  apiUrl?: string;
  formatNumber: (num: number | string) => string;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  account,
  apiUrl,
  formatNumber
}) => {
  const [accountDetails, setAccountDetails] = useState<{
    balance: string;
    delegations: Delegation[];
    rewards: string;
    unbonding: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!account || !apiUrl || !isOpen) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch balance
        const balanceResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/balances/${account}`);
        const balance = balanceResponse.data.balances[0]?.amount || "0";
        
        // Fetch delegations
        const delegationsResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/delegations/${account}`);
        const delegations = delegationsResponse.data.delegation_responses.map((d: any) => ({
          validator: d.delegation.validator_address,
          amount: d.balance.amount || "0"
        }));
        
        // Fetch rewards
        const rewardsResponse = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/delegators/${account}/rewards`);
        const rewards = rewardsResponse.data.total[0]?.amount || "0";
        
        // Fetch unbonding
        const unbondingResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/delegators/${account}/unbonding_delegations`);
        let unbondingTotal = "0";
        if (unbondingResponse.data.unbonding_responses) {
          unbondingTotal = unbondingResponse.data.unbonding_responses.reduce((total: number, u: any) => {
            return total + u.entries.reduce((entryTotal: number, entry: any) => {
              return entryTotal + Number(entry.balance);
            }, 0);
          }, 0).toString();
        }
        
        setAccountDetails({
          balance,
          delegations,
          rewards,
          unbonding: unbondingTotal
        });
        
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to fetch account details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountDetails();
  }, [account, apiUrl, isOpen]);
  
  if (!account) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Account Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-500" />
            <span className="font-semibold">Address:</span>
            <div className="font-mono text-xs break-all">{account}</div>
          </div>
          
          <Separator />
          
          {loading ? (
            <div className="py-8 text-center">Loading account details...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : accountDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Balance:</span>
                  </div>
                  <div className="text-xl font-medium">{formatNumber(accountDetails.balance)}</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Rewards:</span>
                  </div>
                  <div className="text-xl font-medium">{formatNumber(parseFloat(accountDetails.rewards).toFixed(6))}</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Unbonding:</span>
                  </div>
                  <div className="text-xl font-medium">{formatNumber(accountDetails.unbonding)}</div>
                </div>
              </div>
              
              {accountDetails.delegations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownToLine className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">Delegations:</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Validator</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountDetails.delegations.map((delegation, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs truncate max-w-[300px]">
                            {delegation.validator}
                          </TableCell>
                          <TableCell className="text-right">{formatNumber(delegation.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsModal;
