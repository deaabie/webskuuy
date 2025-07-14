
import { useState, useMemo } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { RecipientData } from '@/components/multisender/MultisenderForm';
import { ethers } from 'ethers';

interface UseMultisenderTransferProps {
  network: string;
  selectedToken: string;
  recipients: RecipientData[];
}

export const useMultisenderTransfer = ({ network, selectedToken, recipients }: UseMultisenderTransferProps) => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const totalAmount = useMemo(() => {
    return recipients.reduce((sum, recipient) => {
      return sum + parseFloat(recipient.amount || '0');
    }, 0).toString();
  }, [recipients]);

  const handleSendTokens = async () => {
    if (!walletClient || !address) {
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
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const isNativeToken = selectedToken.startsWith('native:');

        if (isNativeToken) {
          // Handle native token bulk transfer
          await handleNativeBulkTransfer(signer);
        } else {
          // Handle ERC-20 token bulk transfer
          const tokenAddress = selectedToken.split(':')[1];
          await handleTokenBulkTransfer(signer, tokenAddress);
        }
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

  const handleNativeBulkTransfer = async (signer: any) => {
    console.log("Starting native token bulk transfer...");
    
    // Calculate total amount needed
    const totalEther = recipients.reduce((sum, recipient) => {
      return sum + parseFloat(recipient.amount);
    }, 0);

    toast({
      title: "Sending native tokens",
      description: `Preparing to send ${totalEther} tokens to ${recipients.length} recipients`,
    });

    // Send individual transactions for native tokens (this is the standard way)
    const txHashes = [];
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      console.log(`Sending ${recipient.amount} to ${recipient.address}`);
      
      const tx = await signer.sendTransaction({
        to: recipient.address,
        value: ethers.parseEther(recipient.amount),
        gasLimit: 21000
      });
      
      console.log(`Transaction ${i + 1}/${recipients.length} sent:`, tx.hash);
      txHashes.push(tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      console.log(`Transaction ${i + 1}/${recipients.length} confirmed`);
    }

    setTransactionHash(txHashes[0]); // Show first transaction hash
    setIsSuccess(true);
    
    toast({
      title: "Native token transfer successful! 🎉",
      description: `Successfully sent to ${recipients.length} recipients`,
    });
  };

  const handleTokenBulkTransfer = async (signer: any, tokenAddress: string) => {
    console.log("Starting ERC-20 bulk transfer...");
    
    const erc20Abi = [
      "function decimals() view returns (uint8)",
      "function balanceOf(address owner) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)"
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    const userAddress = await signer.getAddress();
    
    // Get token decimals
    const decimals = await tokenContract.decimals();
    console.log("Token decimals:", decimals);
    
    // Calculate total amount needed
    const totalTokenAmount = recipients.reduce((sum, recipient) => {
      return sum + ethers.parseUnits(recipient.amount.toString(), decimals);
    }, BigInt(0));

    console.log("Total tokens needed:", ethers.formatUnits(totalTokenAmount, decimals));

    // Check balance
    const balance = await tokenContract.balanceOf(userAddress);
    if (balance < totalTokenAmount) {
      throw new Error("Insufficient token balance");
    }

    toast({
      title: "Processing ERC-20 bulk transfer",
      description: `Sending ${ethers.formatUnits(totalTokenAmount, decimals)} tokens to ${recipients.length} recipients`,
    });

    // Send individual transactions for ERC-20 tokens
    const txHashes = [];
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const amount = ethers.parseUnits(recipient.amount.toString(), decimals);
      
      console.log(`Sending ${recipient.amount} tokens to ${recipient.address}`);
      
      const tx = await tokenContract.transfer(recipient.address, amount, {
        gasLimit: 65000
      });
      
      console.log(`Transaction ${i + 1}/${recipients.length} sent:`, tx.hash);
      txHashes.push(tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      console.log(`Transaction ${i + 1}/${recipients.length} confirmed`);
    }

    setTransactionHash(txHashes[0]); // Show first transaction hash
    setIsSuccess(true);
    
    toast({
      title: "ERC-20 bulk transfer successful! 🎉",
      description: `Successfully sent to ${recipients.length} recipients`,
    });
  };

  return {
    isProcessing,
    handleSendTokens,
    totalAmount,
    transactionHash,
    isSuccess
  };
};
