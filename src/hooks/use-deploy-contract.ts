
import { useState } from 'react';
import { createWalletClient, custom, type WalletClient } from 'viem';
import { toast } from "@/hooks/use-toast";
import { getContractByMode } from '../utils/contractUtils';
import { getNetworkById } from '@/config/deploy-config';

interface TokenDetails {
  name: string;
  symbol: string;
  supply: string;
}

interface UseDeployContractProps {
  connected: boolean;
  network: string;
  deployMode: string;
  walletClient: WalletClient | undefined;
  tokenDetails?: TokenDetails;
}

export const useDeployContract = ({ 
  connected, 
  network, 
  deployMode, 
  walletClient,
  tokenDetails = { name: "MyToken", symbol: "MTK", supply: "1000000" }
}: UseDeployContractProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const resetDeployment = () => {
    setTxHash("");
    setContractAddress("");
    setDeploySuccess(false);
  };

  const handleDeploy = async () => {
    if (!connected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to deploy a smart contract",
      });
      return;
    }

    if (!network) {
      toast({
        variant: "destructive",
        title: "Network not selected",
        description: "Please select a network to deploy your smart contract",
      });
      return;
    }

    if (!walletClient) {
      toast({
        variant: "destructive",
        title: "Wallet client not available",
        description: "Unable to get the wallet client. Please try reconnecting your wallet.",
      });
      return;
    }

    setIsDeploying(true);
    toast({
      title: "Deployment started",
      description: "Please confirm the transaction in your wallet.",
    });

    try {
      console.log("Using wallet client for deployment");
      console.log("Wallet client account:", walletClient.account);
      console.log("Wallet client chain:", walletClient.chain);
      
      // Use the connected wallet client with ethers
      const { ethers } = await import('ethers');
      
      // Create a provider using window.ethereum if available
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        console.log("Signer address:", await signer.getAddress());
        
        const contractData = getContractByMode(deployMode, tokenDetails);
        
        console.log(`Deploying ${deployMode} contract`);
        console.log("Contract args:", contractData.contractArgs);
        console.log("Bytecode length:", contractData.bytecode.length);
        
        const contractFactory = new ethers.ContractFactory(
          contractData.abi, 
          contractData.bytecode, 
          signer
        );
        
        console.log("Contract factory created, attempting deployment...");
        
        // Increase gas limit for more complex contracts like ERC20
        const deploymentOptions = {
          gasLimit: deployMode === 'erc20' ? 5000000 : 3000000,
        };
        
        let contract;
        if (contractData.contractArgs && contractData.contractArgs.length > 0) {
          console.log("Deploying with args:", contractData.contractArgs);
          contract = await contractFactory.deploy(...contractData.contractArgs, deploymentOptions);
        } else {
          console.log("Deploying without args");
          contract = await contractFactory.deploy(deploymentOptions);
        }
        
        console.log("Contract deployment transaction created");
        
        const deploymentTransaction = contract.deploymentTransaction();
        if (deploymentTransaction) {
          const txHashResult = deploymentTransaction.hash;
          console.log("Contract deployment transaction hash:", txHashResult);
          setTxHash(txHashResult);
          
          console.log("Waiting for contract deployment to complete...");
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Transaction confirmation timeout")), 180000);
          });
          
          try {
            await Promise.race([contract.waitForDeployment(), timeoutPromise]);
            
            const contractAddressResult = await contract.getAddress();
            console.log("Contract successfully deployed at address:", contractAddressResult);
            
            setContractAddress(contractAddressResult);
            setDeploySuccess(true);
            
            let successMessage = 'Your contract has been successfully deployed to the blockchain.';
            if (deployMode === 'erc20') {
              successMessage = `Your ${tokenDetails.name} (${tokenDetails.symbol}) token has been successfully deployed to the blockchain.`;
            } else if (deployMode === 'basic') {
              successMessage = 'Your Counter contract has been successfully deployed to the blockchain.';
            } else if (deployMode === 'storage') {
              successMessage = 'Your SimpleStorage contract has been successfully deployed to the blockchain.';
            }
            
            toast({
              title: "Smart contract deployed!",
              description: successMessage,
            });
          } catch (timeoutError) {
            console.warn("Transaction confirmation is taking longer than expected:", timeoutError);
            
            toast({
              title: "Deployment in progress",
              description: "Your transaction is still being processed. This may take a few minutes. Check your wallet for updates.",
            });
            
            await contract.waitForDeployment();
            
            const contractAddressResult = await contract.getAddress();
            console.log("Contract successfully deployed at address:", contractAddressResult);
            
            setContractAddress(contractAddressResult);
            setDeploySuccess(true);
            
            toast({
              title: "Smart contract deployed!",
              description: `Your ${deployMode === 'basic' ? 'Counter' : deployMode === 'erc20' ? `${tokenDetails.name} (${tokenDetails.symbol}) token` : 'SimpleStorage'} contract has been successfully deployed to the blockchain.`,
            });
          }
        } else {
          throw new Error("No deployment transaction found");
        }
      } else {
        throw new Error("Ethereum provider not available");
      }
    } catch (error: any) {
      console.error("Deployment error:", error);
      
      let errorMessage = "There was an error deploying your smart contract.";
      
      if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User denied") || error.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds to deploy the contract. Please add more ETH to your wallet.";
        } else if (error.code === 4001) {
          errorMessage = "Transaction was rejected in your wallet. Please try again.";
        } else if (error.message.length > 100) {
          errorMessage = error.message.substring(0, 100) + "...";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Deployment failed",
        description: errorMessage,
      });
      
      console.log("Resetting deployment state after error");
      resetDeployment();
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    isDeploying,
    deploySuccess,
    txHash,
    contractAddress,
    handleDeploy,
    resetDeployment
  };
};
