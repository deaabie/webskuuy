
import { useState, useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { RecipientData } from '@/components/multisender/MultisenderForm';

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
    toast({
      title: "Processing transactions",
      description: "Please confirm the transactions in your wallet",
    });

    try {
      const { ethers } = await import('ethers');
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const isNativeToken = selectedToken.startsWith('native:');
        
        if (isNativeToken) {
          // Send native tokens (ETH, etc.)
          const transactions = [];
          
          for (const recipient of recipients) {
            const tx = await signer.sendTransaction({
              to: recipient.address,
              value: ethers.parseEther(recipient.amount),
            });
            transactions.push(tx);
          }

          // Wait for all transactions to be mined
          await Promise.all(transactions.map(tx => tx.wait()));
          
          setTransactionHash(transactions[0].hash);
          setIsSuccess(true);
          
          toast({
            title: "Tokens sent successfully!",
            description: `Successfully sent tokens to ${recipients.length} recipients`,
          });
        } else {
          // Send ERC-20 tokens
          const tokenAddress = selectedToken.split(':')[1];
          
          // Basic ERC-20 ABI for transfer function
          const erc20Abi = [
            "function transfer(address to, uint256 amount) returns (bool)",
            "function decimals() view returns (uint8)",
            "function balanceOf(address owner) view returns (uint256)"
          ];
          
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
          const decimals = await tokenContract.decimals();
          
          const transactions = [];
          
          for (const recipient of recipients) {
            const amount = ethers.parseUnits(recipient.amount, decimals);
            const tx = await tokenContract.transfer(recipient.address, amount);
            transactions.push(tx);
          }

          // Wait for all transactions to be mined
          await Promise.all(transactions.map(tx => tx.wait()));
          
          setTransactionHash(transactions[0].hash);
          setIsSuccess(true);
          
          toast({
            title: "Tokens sent successfully!",
            description: `Successfully sent tokens to ${recipients.length} recipients`,
          });
        }
      } else {
        throw new Error("Ethereum provider not available");
      }
    } catch (error: any) {
      console.error("Multisender error:", error);
      
      let errorMessage = "There was an error sending the tokens.";
      
      if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User denied")) {
          errorMessage = "Transaction was rejected by the user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds to complete all transactions.";
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
        title: "Transaction failed",
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
