
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Wallet } from 'lucide-react';
import { ChainConfig, RichAccount } from '@/services/cosmosService';
import AccountDetailsModal from './overview/AccountDetailsModal';

interface AccountsTabProps {
  chain: ChainConfig;
  richAccounts: RichAccount[];
  accountStats: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
  formatNumber: (num: number | string) => string;
  apiUrl?: string;
}

const AccountsTab: React.FC<AccountsTabProps> = ({ 
  chain, 
  richAccounts, 
  accountStats,
  formatNumber, 
  apiUrl 
}) => {
  const [selectedAccount, setSelectedAccount] = useState<RichAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccountClick = (account: RichAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Accounts Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Daily Active Accounts:</p>
                <p className="text-4xl font-bold">{formatNumber(accountStats.dailyActive)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Weekly Active Accounts:</p>
                <p className="text-4xl font-bold">{formatNumber(accountStats.weeklyActive)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Monthly Active Accounts:</p>
                <p className="text-4xl font-bold">{formatNumber(accountStats.monthlyActive)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rich List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-500" />
              Rich List
            </CardTitle>
            <CardDescription>Top accounts by balance from {chain.display_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {richAccounts.map((account, index) => (
                  <TableRow key={account.address}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[300px]">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-mono text-primary hover:underline" 
                        onClick={() => handleAccountClick(account)}
                      >
                        {account.address}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(account.balance)} {chain.assets[0]?.symbol}</TableCell>
                    <TableCell className="text-right">{new Date(account.last_activity).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedAccount && (
        <AccountDetailsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          account={selectedAccount}
          apiUrl={apiUrl}
          chainSymbol={chain.assets[0]?.symbol || ''}
        />
      )}
    </>
  );
};

export default AccountsTab;
