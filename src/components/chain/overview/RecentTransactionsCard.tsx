import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { FileCode } from 'lucide-react';
import { Transaction, getTransactions } from '@/services/cosmosService';

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  formatDate: (dateString: string) => string;
  apiUrl?: string;
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ 
  transactions: propTransactions, 
  formatDate,
  apiUrl
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const lastTxHash = useRef<string | null>(null);

  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) {
      setTransactions(prev => {
        if (propTransactions[0].hash !== lastTxHash.current) {
          lastTxHash.current = propTransactions[0].hash;
          return propTransactions.slice(0, 5);
        }
        return prev;
      });
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      if (!apiUrl) {
        setLoading(false);
        return;
      }

      try {
        const txs = await getTransactions(apiUrl, 5);
        setTransactions(prev => {
          if (txs.length > 0 && (!prev.length || txs[0].hash !== prev[0].hash)) {
            return txs;
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    const interval = setInterval(fetchTransactions, 100);

    return () => clearInterval(interval);
  }, [propTransactions, apiUrl]);

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
            {!loading && transactions.length > 0 ? (
              transactions.map((tx) => (
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
                  {loading ? "Loading transactions..." : "No transactions found"}
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
