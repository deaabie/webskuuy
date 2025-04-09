
import { useState } from 'react';
import { ethers } from 'ethers';
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
  signer: ethers.Signer | null;
  tokenDetails?: TokenDetails;
}

export const useDeployContract = ({ 
  connected, 
  network, 
  deployMode, 
  signer,
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

    if (!signer) {
      toast({
        variant: "destructive",
        title: "Signer not available",
        description: "Unable to get the signer from your wallet",
      });
      return;
    }

    setIsDeploying(true);
    toast({
      title: "Deployment started",
      description: "Please confirm the transaction in your wallet.",
    });

    try {
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
      
      const deploymentOptions = {
        gasLimit: 3000000,
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
        const txHash = deploymentTransaction.hash;
        console.log("Contract deployment transaction hash:", txHash);
        setTxHash(txHash);
        
        console.log("Waiting for contract deployment to complete...");
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Transaction confirmation timeout")), 180000);
        });
        
        try {
          await Promise.race([contract.waitForDeployment(), timeoutPromise]);
          
          const contractAddress = await contract.getAddress();
          console.log("Contract successfully deployed at address:", contractAddress);
          
          setContractAddress(contractAddress);
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
          
          const contractAddress = await contract.getAddress();
          console.log("Contract successfully deployed at address:", contractAddress);
          
          setContractAddress(contractAddress);
          setDeploySuccess(true);
          
          toast({
            title: "Smart contract deployed!",
            description: `Your ${deployMode === 'basic' ? 'Counter' : deployMode === 'erc20' ? `${tokenDetails.name} (${tokenDetails.symbol}) token` : 'SimpleStorage'} contract has been successfully deployed to the blockchain.`,
          });
        }
      } else {
        throw new Error("No deployment transaction found");
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
