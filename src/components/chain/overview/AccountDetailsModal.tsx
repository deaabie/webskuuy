
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RichAccount } from '@/services/cosmosService';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account?: RichAccount;
  address?: string;
  apiUrl?: string;
  chainSymbol: string;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  account: propAccount,
  address,
  apiUrl,
  chainSymbol
}) => {
  const [accountData, setAccountData] = useState<RichAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      // If we already have account data from props, use that
      if (propAccount) {
        setAccountData(propAccount);
        return;
      }
      
      // If we have an address but no account data, try to fetch it
      if (address && apiUrl && isOpen) {
        setLoading(true);
        setError(null);
        
        try {
          // Try to get account data from API
          const response = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/balances/${address}`);
          
          // Create a simplified account object from the response
          if (response.data && response.data.balances) {
            const balanceAmount = response.data.balances[0]?.amount || "0";
            const formattedBalance = parseInt(balanceAmount) / 1000000; // Convert from micro units
            
            setAccountData({
              address: address,
              balance: formattedBalance.toString(),
              last_activity: new Date().toISOString(), // Default to current time
              tx_count: 0 // Default value
            });
          } else {
            // If no balance info found, create minimal account data
            setAccountData({
              address: address,
              balance: "0",
              last_activity: new Date().toISOString(),
              tx_count: 0
            });
          }
        } catch (error) {
          console.error("Error fetching account data:", error);
          setError("Failed to load account data");
          
          // Still create minimal account data so we can show the address
          setAccountData({
            address: address,
            balance: "0",
            last_activity: new Date().toISOString(),
            tx_count: 0
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAccountData();
  }, [propAccount, address, apiUrl, isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Render loading state
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>Loading account information...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render error state
  if (error && !accountData) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>Error loading account</DialogDescription>
          </DialogHeader>
          <div className="p-6 text-center text-destructive">
            <p>{error}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main render with account data
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            Detailed information about this account
          </DialogDescription>
        </DialogHeader>

        {accountData && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <Label className="text-sm text-muted-foreground">Address</Label>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="font-mono text-sm break-all">{accountData.address}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(accountData.address)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Balance Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Balance</Label>
                    <div className="text-xl font-bold mt-1">
                      {accountData.balance} {chainSymbol}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground">Last Activity</Label>
                    <div className="mt-1">{formatDate(accountData.last_activity)}</div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Transaction Count</Label>
                    <div className="mt-1">{accountData.tx_count}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {apiUrl && (
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Data provided by {apiUrl.replace('https://', '').replace('http://', '').split('/')[0]}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsModal;
