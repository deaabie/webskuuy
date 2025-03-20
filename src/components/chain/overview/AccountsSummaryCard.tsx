
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountBalance {
  address: string;
  balance: string;
  denom: string;
}

interface AccountsSummaryCardProps {
  apiUrl: string | undefined;
  formatNumber: (num: number | string) => string;
  addrPrefix: string;
}

const AccountsSummaryCard: React.FC<AccountsSummaryCardProps> = ({ 
  apiUrl, 
  formatNumber,
  addrPrefix
}) => {
  const [accounts, setAccounts] = useState<AccountBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRichList = async () => {
    if (!apiUrl) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get total supply first to understand the token
      const supplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply`);
      let denom = '';
      
      if (supplyResponse.data?.supply?.[0]?.denom) {
        denom = supplyResponse.data.supply[0].denom;
      }
      
      // Try to fetch account balances - different chains might have different endpoints
      try {
        // First try the bank balances endpoint
        const balancesResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/balances?pagination.limit=100`);
        
        if (balancesResponse.data?.balances) {
          const accountBalances = balancesResponse.data.balances.map((item: any) => ({
            address: item.address,
            balance: item.amount,
            denom: item.denom
          }));
          
          // Sort by balance in descending order
          accountBalances.sort((a: AccountBalance, b: AccountBalance) => 
            Number(b.balance) - Number(a.balance)
          );
          
          setAccounts(accountBalances.slice(0, 10));
        }
      } catch (e) {
        console.error('First rich list fetch method failed, trying alternative', e);
        
        // Try a different approach - this is a fallback
        try {
          // Some chains expose a /bank/accounts endpoint
          const accountsResponse = await axios.get(`${apiUrl}/bank/accounts?limit=100`);
          
          if (accountsResponse.data) {
            const accountBalances = accountsResponse.data
              .filter((acc: any) => acc.value?.coins?.[0])
              .map((acc: any) => ({
                address: acc.value.address,
                balance: acc.value.coins[0].amount,
                denom: acc.value.coins[0].denom
              }));
            
            accountBalances.sort((a: AccountBalance, b: AccountBalance) => 
              Number(b.balance) - Number(a.balance)
            );
            
            setAccounts(accountBalances.slice(0, 10));
          }
        } catch (e2) {
          console.error('Second rich list fetch method failed', e2);
          throw new Error('Could not fetch account balances');
        }
      }
    } catch (err) {
      console.error('Error fetching rich list:', err);
      setError('Could not load account balances. The API may not support this feature.');
      toast({
        title: "Error loading accounts",
        description: "Could not retrieve account balances. The API may not support this feature.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (apiUrl) {
      fetchRichList();
    }
  }, [apiUrl]);
  
  const formatAddress = (address: string) => {
    if (!address) return '';
    if (address.length <= 12) return address;
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };
  
  const formatAmount = (amount: string, denom: string) => {
    if (!amount) return '0';
    
    // Convert to a number
    const numericAmount = parseFloat(amount);
    
    // Format based on size
    let formattedAmount = formatNumber(numericAmount);
    
    // Add formatted denom
    let displayDenom = denom;
    // Remove 'u' prefix if exists (common in Cosmos chains)
    if (denom.startsWith('u')) {
      // Convert from micro (10^-6)
      displayDenom = denom.substring(1).toUpperCase();
    }
    
    return `${formattedAmount} ${displayDenom}`;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Accounts Summary (Top 10)</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={fetchRichList}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No account data available</p>
          </div>
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account, index) => (
                  <TableRow key={account.address}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <a 
                        href={`/explorer/${addrPrefix}?search=${account.address}`}
                        className="hover:text-primary hover:underline"
                      >
                        {formatAddress(account.address)}
                      </a>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatAmount(account.balance, account.denom)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsSummaryCard;
