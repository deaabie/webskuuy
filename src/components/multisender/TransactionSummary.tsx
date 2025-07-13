
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getNetworkById } from '@/config/deploy-config';
import { RecipientData } from './MultisenderForm';

interface TransactionSummaryProps {
  recipients: RecipientData[];
  selectedToken: string;
  network: string;
  totalAmount: string;
}

const TransactionSummary = ({ recipients, selectedToken, network, totalAmount }: TransactionSummaryProps) => {
  const networkConfig = getNetworkById(network);
  const isNativeToken = selectedToken.startsWith('native:');
  const tokenSymbol = isNativeToken ? selectedToken.split(':')[1] : 'TOKEN';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Network</p>
            <p className="font-medium">{networkConfig?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token</p>
            <p className="font-medium">{tokenSymbol}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recipients</p>
            <p className="font-medium">{recipients.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium">{totalAmount} {tokenSymbol}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Recipients List</h4>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((recipient, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">
                      {recipient.address.slice(0, 10)}...{recipient.address.slice(-8)}
                    </TableCell>
                    <TableCell className="text-right">
                      {recipient.amount} {tokenSymbol}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
