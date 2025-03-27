
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Wallet, TrendingUp } from 'lucide-react';
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
                <p className="text-sm text-gray-400">Daily Active Account:</p>
                <p className="text-4xl font-bold">{formatNumber(accountStats.dailyActive)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Weekly Active Account:</p>
                <p className="text-4xl font-bold">{formatNumber(accountStats.weeklyActive)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Monthly Active Account:</p>
                <p className="text-4xl font-bold">{formatNumber(accountStats.monthlyActive)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rich List Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Accounts
            </CardTitle>
            <CardDescription>Accounts information from {chain.display_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="rich-list" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="rich-list" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Rich List
                </TabsTrigger>
                <TabsTrigger value="most-activators" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Most Activators
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="rich-list">
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
              </TabsContent>
              
              <TabsContent value="most-activators">
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">Coming soon</p>
                </div>
              </TabsContent>
              
              <TabsContent value="trends">
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">Coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
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
