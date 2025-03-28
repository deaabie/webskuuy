
import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use transactions from props if available
    if (propTransactions && propTransactions.length > 0) {
      setTransactions(propTransactions.slice(0, 5));
      setLoading(false);
      setError(null);
      return;
    }

    // If no transactions in props and API URL is available, fetch them directly
    const fetchTransactions = async () => {
      if (!apiUrl) {
        setLoading(false);
        setError("No API URL provided");
        return;
      }

      try {
        setLoading(true);
        const txs = await getTransactions(apiUrl, 5);
        setTransactions(txs);
        setError(null);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Could not load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      if (apiUrl) {
        fetchTransactions();
      }
    }, 2000); // Update every 2 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
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
                  {loading ? "Loading transactions..." : error ? error : "No transactions found"}
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
