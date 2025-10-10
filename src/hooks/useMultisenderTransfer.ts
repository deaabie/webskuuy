
import { useState, useMemo } from 'react';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { RecipientData } from '@/components/multisender/MultisenderForm';
import { parseEther, parseUnits, formatEther, formatUnits } from 'viem';

interface UseMultisenderTransferProps {
  network: string;
  selectedToken: string;
  recipients: RecipientData[];
}

export const useMultisenderTransfer = ({ network, selectedToken, recipients }: UseMultisenderTransferProps) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address, chainId } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const totalAmount = useMemo(() => {
    return recipients.reduce((sum, recipient) => {
      return sum + parseFloat(recipient.amount || '0');
    }, 0).toString();
  }, [recipients]);

  const handleSendTokens = async () => {
    if (!walletClient || !address || !publicClient) {
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
      const isNativeToken = selectedToken.startsWith('native:');

      if (isNativeToken) {
        await handleNativeBulkTransfer();
      } else {
        const tokenAddress = selectedToken.split(':')[1];
        await handleTokenBulkTransfer(tokenAddress as `0x${string}`);
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

  const handleNativeBulkTransfer = async () => {
    if (!walletClient || !address || !publicClient) return;
    
    console.log("Starting native token bulk transfer using connected wallet...");
    
    const totalEther = recipients.reduce((sum, recipient) => {
      return sum + parseFloat(recipient.amount);
    }, 0);

    toast({
      title: "Sending native tokens",
      description: `Preparing to send ${totalEther} tokens to ${recipients.length} recipients`,
    });

    const txHashes = [];
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      console.log(`Sending ${recipient.amount} to ${recipient.address}`);
      
      const hash = await walletClient.sendTransaction({
        to: recipient.address as `0x${string}`,
        value: parseEther(recipient.amount)
      } as any);
      
      console.log(`Transaction ${i + 1}/${recipients.length} sent:`, hash);
      txHashes.push(hash);
      
      // Wait for confirmation
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Transaction ${i + 1}/${recipients.length} confirmed`);
      }
    }

    setTransactionHash(txHashes[0]);
    setIsSuccess(true);
    
    toast({
      title: "Native token transfer successful! 🎉",
      description: `Successfully sent to ${recipients.length} recipients`,
    });
  };

  const handleTokenBulkTransfer = async (tokenAddress: `0x${string}`) => {
    if (!walletClient || !address || !publicClient) return;
    
    console.log("Starting ERC-20 bulk transfer using connected wallet...");
    
    const erc20Abi = [
      {
        name: 'decimals',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }],
      },
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ] as const;
    
    // Get token decimals
    const decimals = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'decimals',
    });
    
    console.log("Token decimals:", decimals);
    
    // Calculate total amount needed
    const totalTokenAmount = recipients.reduce((sum, recipient) => {
      return sum + parseUnits(recipient.amount.toString(), decimals);
    }, 0n);

    console.log("Total tokens needed:", formatUnits(totalTokenAmount, decimals));

    // Check balance
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    });

    if (balance < totalTokenAmount) {
      throw new Error("Insufficient token balance");
    }

    toast({
      title: "Processing ERC-20 bulk transfer",
      description: `Sending ${formatUnits(totalTokenAmount, decimals)} tokens to ${recipients.length} recipients`,
    });

    const txHashes = [];
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const amount = parseUnits(recipient.amount.toString(), decimals);
      
      console.log(`Sending ${recipient.amount} tokens to ${recipient.address}`);
      
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient.address as `0x${string}`, amount]
      } as any);
      
      console.log(`Transaction ${i + 1}/${recipients.length} sent:`, hash);
      txHashes.push(hash);
      
      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash });
      console.log(`Transaction ${i + 1}/${recipients.length} confirmed`);
    }

    setTransactionHash(txHashes[0]);
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
