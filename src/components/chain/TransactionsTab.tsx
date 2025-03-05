
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Transaction, ChainConfig } from '@/services/cosmosService';

interface TransactionsTabProps {
  chain: ChainConfig;
  transactions: Transaction[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ 
  chain, 
  transactions, 
  formatNumber, 
  formatDate 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Recent transactions from {chain.display_name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{tx.hash}</TableCell>
                  <TableCell>{tx.block}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {tx.type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </TableCell>
                  <TableCell>{formatNumber(tx.fee)}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'Success' ? 'default' : tx.status === 'Failed' ? 'destructive' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No transactions available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;
