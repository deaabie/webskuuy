
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Coins, Award, Timer, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountInfo: {
    address: string;
    balance: string;
    delegations: string;
    rewards: string;
    unbonding: string;
    validators: Array<{
      address: string;
      moniker: string;
      amount: string;
    }>;
  } | null;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  accountInfo 
}) => {
  if (!accountInfo) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Account Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="font-mono text-xs break-all mb-4">
            {accountInfo.address}
          </div>
          
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsModal;
