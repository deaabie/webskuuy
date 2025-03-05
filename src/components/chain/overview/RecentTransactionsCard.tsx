
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { FileCode } from 'lucide-react';
import { Transaction } from '@/services/cosmosService';

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  formatDate: (dateString: string) => string;
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ 
  transactions, 
  formatDate 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-purple-500" />
          Recent Transactions
        </CardTitle>
        <CardDescription>Last 5 transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{tx.hash}</TableCell>
                  <TableCell>{tx.block}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {tx.type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </TableCell>
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
                <TableCell colSpan={5} className="text-center py-4">
                  Loading transactions...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
