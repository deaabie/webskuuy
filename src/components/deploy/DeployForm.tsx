
import React, { useState } from 'react';
import { NETWORK_CONFIG, CONTRACT_TEMPLATES } from '@/config/deploy-config';
import { useToast } from "@/hooks/use-toast";
import { NetworkConfig, DeploymentStatus as DeploymentStatusType } from './types';
import { useAddress, useSDK, useConnectionStatus } from "@thirdweb-dev/react";

// Import our component
import ContractEditor from './ContractEditor';
import NetworkSelector from './NetworkSelector';
import DeployButton from './DeployButton';
import DeploymentStatus from './DeploymentStatus';
import ConnectWalletButton from './ConnectWalletButton';

interface DeployFormProps {
  networks: NetworkConfig[];
}

const DeployForm: React.FC<DeployFormProps> = ({ networks }) => {
  const [network, setNetwork] = useState("");
  const [contractMode, setContractMode] = useState("basic");
  const [contractCode, setContractCode] = useState(CONTRACT_TEMPLATES.basic.code);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatusType>({ 
    status: 'idle' 
  });

  const { toast } = useToast();
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const sdk = useSDK();

  const handleDeploy = async () => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deploy a contract",
        variant: "destructive",
      });
      return;
    }

    if (!network) {
      toast({
        title: "Network not selected",
        description: "Please select a network to deploy your contract",
        variant: "destructive",
      });
      return;
    }

    if (!contractCode.trim()) {
      toast({
        title: "Empty contract",
        description: "Please enter your contract code before deploying",
        variant: "destructive",
      });
      return;
    }

    // Set status to compiling
    setDeploymentStatus({ 
      status: 'compiling',
      message: 'Compiling your smart contract...'
    });

    try {
      // Simulate compilation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Set status to deploying
      setDeploymentStatus({ 
        status: 'deploying',
        message: 'Deploying your smart contract to the blockchain...'
      });

      console.log("SDK instance:", sdk);
      console.log("Selected network:", network);
      console.log("Connected wallet:", address);

      // In a real implementation, you would use the ThirdWeb SDK to deploy the contract
      // For demo purposes, we'll simulate a successful deployment
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate a transaction hash and contract address
      const mockTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const mockContractAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      // Set success status
      setDeploymentStatus({
        status: 'success',
        contractAddress: mockContractAddress,
        txHash: mockTxHash,
        message: 'Your contract has been successfully deployed!'
      });

      toast({
        title: "Contract deployed",
        description: `Your contract has been successfully deployed to ${networks.find(n => n.id === network)?.name}`,
      });

    } catch (error: any) {
      console.error("Deployment error:", error);
      setDeploymentStatus({ 
        status: 'error',
        message: error.message || 'There was an error deploying your contract'
      });
      
      toast({
        title: "Deployment failed",
        description: error.message || "Failed to deploy contract. Please check your code and try again.",
        variant: "destructive",
      });
    }
  };

  // Get the explorer URL for the selected network
  const selectedNetwork = networks.find(n => n.id === network);
  const explorerUrl = selectedNetwork?.explorer || '';

  return (
    <div className="bg-card rounded-lg p-6 border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Deploy Your Smart Contract</h2>
        <ConnectWalletButton />
      </div>

      <div className="space-y-6">
        <NetworkSelector 
          network={network} 
          setNetwork={setNetwork} 
          networks={networks} 
        />
        
        <ContractEditor 
          contractCode={contractCode} 
          setContractCode={setContractCode} 
          contractMode={contractMode} 
          setContractMode={setContractMode}
        />
        
        <DeployButton 
          loading={deploymentStatus.status === 'compiling' || deploymentStatus.status === 'deploying'} 
          disabled={!address || !network || !contractCode.trim() || connectionStatus !== "connected"}
          onClick={handleDeploy} 
        />

        <DeploymentStatus 
          status={deploymentStatus}
          explorerUrl={explorerUrl}
        />
      </div>
    </div>
  );
};

export default DeployForm;
