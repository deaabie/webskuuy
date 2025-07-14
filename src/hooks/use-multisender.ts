
import { useState, useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { RecipientData } from '@/components/multisender/MultisenderForm';
import { executeNativeBulkTransfer, executeTokenBulkTransfer } from '@/utils/multisenderTransactions';

interface UseMultisenderProps {
  network: string;
  selectedToken: string;
  recipients: RecipientData[];
}

export const useMultisender = ({ network, selectedToken, recipients }: UseMultisenderProps) => {
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const totalAmount = useMemo(() => {
    return recipients.reduce((sum, recipient) => {
      return sum + parseFloat(recipient.amount || '0');
    }, 0).toString();
  }, [recipients]);

  const handleSendTokens = async () => {
    if (!walletClient) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to send tokens",
      });
      return;
    }

    if (recipients.length === 0) {
      toast({
        variant: "destructive",
        title: "No recipients",
        description: "Please add at least one recipient",
      });
      return;
    }

    setIsProcessing(true);
    setTransactionHash("");
    setIsSuccess(false);
    
    try {
      console.log("Starting bulk transfer process...");
      console.log("Selected token:", selectedToken);
      console.log("Recipients count:", recipients.length);
      
      const { ethers } = await import('ethers');
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const isNativeToken = selectedToken.startsWith('native:');
        
        toast({
          title: "Preparing TRUE bulk transfer",
          description: `Deploying contract for ${recipients.length} recipients`,
        });

        let result;
        
        if (isNativeToken) {
          console.log("Executing native token bulk transfer...");
          result = await executeNativeBulkTransfer(signer, recipients);
        } else {
          console.log("Executing ERC-20 token bulk transfer...");
          const tokenAddress = selectedToken.split(':')[1];
          result = await executeTokenBulkTransfer(signer, recipients, tokenAddress);
        }

        if (result.success && result.hash) {
          setTransactionHash(result.hash);
          setIsSuccess(true);
          
          toast({
            title: "TRUE bulk transfer successful! 🎉",
            description: `Successfully sent to ${recipients.length} recipients in a single transaction`,
          });
        } else {
          throw new Error(result.error || "Bulk transfer failed");
        }
      } else {
        throw new Error("Ethereum provider not available");
      }
    } catch (error: any) {
      console.error("Bulk transfer error:", error);
      
      let errorMessage = "Bulk transfer failed. Please try again.";
      
      if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User denied")) {
          errorMessage = "Transaction was rejected by the user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for the transaction.";
        } else if (error.code === 4001) {
          errorMessage = "Transaction was rejected in your wallet.";
        } else {
          errorMessage = error.message.length > 100 ? 
            error.message.substring(0, 100) + "..." : 
            error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Bulk transfer failed",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleSendTokens,
    totalAmount,
    transactionHash,
    isSuccess
  };
};
