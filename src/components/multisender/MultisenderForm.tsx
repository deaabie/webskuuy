
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
  const isNativeToken = selectedToken.startsWith('native:');

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
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  True Bulk Transfer - Single Transaction
                </h3>
                <div className="text-xs text-green-600 dark:text-green-300 mt-1 space-y-1">
                  {isNativeToken ? (
                    <p>✓ Deploy contract + Send to all {recipients.length} recipients = 1 confirmation total</p>
                  ) : (
                    <>
                      <p>✓ Deploy contract + Approve {totalAmount} tokens + Send to all {recipients.length} recipients</p>
                      <p>✓ Maximum 2 confirmations total (deploy+approve, then bulk send)</p>
                    </>
                  )}
                  <p className="font-semibold">No individual transaction popups!</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSendTokens}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing True Bulk Transfer..." : `Send to ${recipients.length} Recipients (1 Transaction)`}
          </Button>
        </div>
      )}

      {isSuccess && transactionHash && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                True Bulk Transfer Successful! 🎉
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300 mb-4">
                Tokens sent to all {recipients.length} recipients in a single transaction with optimized gas usage
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
