
import React from 'react';
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

interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: RichAccount;
  apiUrl?: string;
  chainSymbol: string;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  account,
  apiUrl,
  chainSymbol
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            Detailed information about this account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label className="text-sm text-muted-foreground">Address</Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="font-mono text-sm break-all">{account.address}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(account.address)}
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
                    {account.balance} {chainSymbol}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm text-muted-foreground">Last Activity</Label>
                  <div className="mt-1">{formatDate(account.last_activity)}</div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Transaction Count</Label>
                  <div className="mt-1">{account.tx_count}</div>
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
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsModal;
