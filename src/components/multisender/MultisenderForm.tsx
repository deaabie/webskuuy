
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenSelector from './TokenSelector';
import ManualInput from './ManualInput';
import CsvInput from './CsvInput';
import TransactionSummary from './TransactionSummary';
import { Button } from "@/components/ui/button";
import { useMultisenderTransfer } from '@/hooks/useMultisenderTransfer';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { getNetworkById } from '@/config/deploy-config';

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

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const networkConfig = getNetworkById(network);
  
  // More robust network comparison
  const isCorrectNetwork = network && networkConfig ? networkConfig.chainId === chainId : true;

  console.log("Network debugging:", {
    selectedNetwork: network,
    networkConfig,
    expectedChainId: networkConfig?.chainId,
    currentChainId: chainId,
    isCorrectNetwork
  });

  const {
    isProcessing,
    handleSendTokens,
    totalAmount,
    transactionHash,
    isSuccess
  } = useMultisenderTransfer({ network, selectedToken, recipients });

  const handleRecipientsChange = (newRecipients: RecipientData[]) => {
    setRecipients(newRecipients);
  };

  const handleSwitchNetwork = () => {
    if (networkConfig && switchChain) {
      console.log("Attempting to switch to network:", networkConfig.chainId);
      switchChain({ chainId: networkConfig.chainId });
    }
  };

  const canProceed = network && selectedToken && recipients.length > 0 && recipients.every(r => r.address && r.amount) && isConnected && isCorrectNetwork;
  const isNativeToken = selectedToken.startsWith('native:');

  const handleReset = () => {
    setRecipients([]);
  };

  return (
    <div className="space-y-6">
      {!isConnected && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Wallet Not Connected
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                Please connect your wallet using the button above to continue with the multisender.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isConnected && !isCorrectNetwork && networkConfig && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Wrong Network
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                Please switch to <strong>{networkConfig.name}</strong> (Chain ID: {networkConfig.chainId})
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mb-4">
                Current network: Chain ID {chainId}
              </p>
              <Button
                onClick={handleSwitchNetwork}
                variant="destructive"
                size="sm"
              >
                Switch to {networkConfig.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <TokenSelector
        network={network}
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
      />

      {selectedToken && isConnected && isCorrectNetwork && (
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

      {recipients.length > 0 && isConnected && isCorrectNetwork && (
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
                  Multi-Send Transfer
                </h3>
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-1 space-y-1">
                  <p>• {isNativeToken ? 'Native token transfers' : 'ERC-20 token transfers'}</p>
                  <p>• {recipients.length} individual transaction{recipients.length > 1 ? 's' : ''} will be sent</p>
                  <p>• Each transaction requires gas fees</p>
                  <p className="font-semibold">Using your connected wallet provider</p>
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
            {isProcessing 
              ? `Sending to Recipients... (This may take a while)` 
              : `Send to ${recipients.length} Recipients`
            }
          </Button>
        </div>
      )}

      {isSuccess && transactionHash && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Multi-Send Transfer Complete! 🎉
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300 mb-4">
                Successfully sent to all {recipients.length} recipients
              </p>
              <p className="text-xs text-muted-foreground break-all">
                First Transaction Hash: {transactionHash}
              </p>
              <Button
                className="mt-4"
                onClick={handleReset}
              >
                Send Another Multi-Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultisenderForm;
