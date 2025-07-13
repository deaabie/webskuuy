
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenSelector from './TokenSelector';
import ManualInput from './ManualInput';
import CsvInput from './CsvInput';
import TransactionSummary from './TransactionSummary';
import { Button } from "@/components/ui/button";
import { useMultisender } from '@/hooks/use-multisender';

interface MultisenderFormProps {
  network: string;
}

export interface RecipientData {
  address: string;
  amount: string;
}

const MultisenderForm = ({ network }: MultisenderFormProps) => {
  const [selectedToken, setSelectedToken] = useState("");
  const [recipients, setRecipients] = useState<RecipientData[]>([]);
  const [inputMode, setInputMode] = useState("manual");

  const {
    isProcessing,
    handleSendTokens,
    totalAmount,
    transactionHash,
    isSuccess
  } = useMultisender({ network, selectedToken, recipients });

  const handleRecipientsChange = (newRecipients: RecipientData[]) => {
    setRecipients(newRecipients);
  };

  const canProceed = network && selectedToken && recipients.length > 0 && recipients.every(r => r.address && r.amount);

  return (
    <div className="space-y-6">
      <TokenSelector
        network={network}
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
      />

      {selectedToken && (
        <Card>
          <CardHeader>
            <CardTitle>Add Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={inputMode} onValueChange={setInputMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="csv">CSV Import</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <ManualInput 
                  recipients={recipients}
                  onRecipientsChange={handleRecipientsChange}
                />
              </TabsContent>
              
              <TabsContent value="csv" className="space-y-4">
                <CsvInput 
                  onRecipientsChange={handleRecipientsChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {recipients.length > 0 && (
        <TransactionSummary
          recipients={recipients}
          selectedToken={selectedToken}
          network={network}
          totalAmount={totalAmount}
        />
      )}

      {canProceed && !isSuccess && (
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Bulk Transfer - One Transaction Only
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  This will send tokens to all {recipients.length} recipients in a single transaction. You'll only need to confirm once in MetaMask.
                </p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSendTokens}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing Bulk Transfer..." : `Send to ${recipients.length} Recipients (1 Transaction)`}
          </Button>
        </div>
      )}

      {isSuccess && transactionHash && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Bulk Transfer Successful!
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300 mb-4">
                Tokens have been sent to all {recipients.length} recipients in a single transaction
              </p>
              <p className="text-xs text-muted-foreground break-all">
                Transaction Hash: {transactionHash}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultisenderForm;
