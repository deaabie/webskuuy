
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ConnectWalletButton from './ConnectWalletButton';
import NetworkSelector from './NetworkSelector';
import DeploySuccess from './DeploySuccess';
import { ExternalLink } from 'lucide-react';
import { getContractByMode } from '../../utils/contractUtils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const DeployContainer = () => {
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [deployMode, setDeployMode] = useState("basic");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (provider && walletAddress) {
        try {
          const balance = await provider.getBalance(walletAddress);
          setWalletBalance(ethers.formatEther(balance));
        } catch (error) {
          console.error("Error fetching balance:", error);
          setWalletBalance(null);
        }
      } else {
        setWalletBalance(null);
      }
    };

    getBalance();
  }, [provider, walletAddress, network]);

  const handleWalletConnection = (status: boolean, address: string, providerInstance: ethers.Provider | null, signerInstance: ethers.Signer | null) => {
    setConnected(status);
    setWalletAddress(address);
    setProvider(providerInstance);
    setSigner(signerInstance);
    
    if (!status) {
      setDeploySuccess(false);
      setTxHash("");
      setContractAddress("");
    }
  };

  const handleNetworkChange = (networkId: string) => {
    setNetwork(networkId);
    setDeploySuccess(false);
    setTxHash("");
    setContractAddress("");
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
      // Get contract data based on deployment mode
      const contractData = getContractByMode(deployMode);
      
      console.log(`Deploying ${deployMode} contract`);
      console.log("Contract args:", contractData.contractArgs);
      console.log("Bytecode length:", contractData.bytecode.length);
      
      // Create contract factory
      const contractFactory = new ethers.ContractFactory(
        contractData.abi, 
        contractData.bytecode, 
        signer
      );
      
      console.log("Contract factory created, attempting deployment...");
      
      // Deploy with higher gas limit to ensure it can complete
      const deploymentOptions = {
        gasLimit: 3000000, // Increased gas limit for more complex contracts
      };
      
      // Deploy with or without constructor arguments
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
        
        // Add a timeout for transaction confirmation
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Transaction confirmation timeout")), 180000); // 3 minutes timeout
        });
        
        // Wait for contract deployment with timeout
        try {
          await Promise.race([contract.waitForDeployment(), timeoutPromise]);
          
          const contractAddress = await contract.getAddress();
          console.log("Contract successfully deployed at address:", contractAddress);
          
          setContractAddress(contractAddress);
          setDeploySuccess(true);
          
          toast({
            title: "Smart contract deployed!",
            description: `Your ${deployMode === 'basic' ? 'Counter' : 'SimpleStorage'} contract has been successfully deployed to the blockchain.`,
          });
        } catch (timeoutError) {
          console.warn("Transaction confirmation is taking longer than expected:", timeoutError);
          
          // We don't fail here, just notify the user that it might take longer
          toast({
            title: "Deployment in progress",
            description: "Your transaction is still being processed. This may take a few minutes. Check your wallet for updates.",
          });
          
          // Continue waiting without timeout
          await contract.waitForDeployment();
          
          const contractAddress = await contract.getAddress();
          console.log("Contract successfully deployed at address:", contractAddress);
          
          setContractAddress(contractAddress);
          setDeploySuccess(true);
          
          toast({
            title: "Smart contract deployed!",
            description: `Your ${deployMode === 'basic' ? 'Counter' : 'SimpleStorage'} contract has been successfully deployed to the blockchain.`,
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
      setTxHash("");
      setContractAddress("");
      setDeploySuccess(false);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full bg-primary/5 border-border">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Deploy Your Smart Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!deploySuccess ? (
          <>
            <div className="space-y-4">
              <div className="mb-6">
                <ConnectWalletButton onConnectionChange={handleWalletConnection} />
                
                {walletBalance !== null && connected && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Balance: </span>
                    <span className="font-medium text-green-500">
                      {parseFloat(walletBalance).toFixed(4)} ETH
                    </span>
                  </div>
                )}
              </div>
              
              {connected && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Select Network</h3>
                    <NetworkSelector onNetworkChange={handleNetworkChange} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Deployment Mode</h3>
                    <RadioGroup 
                      defaultValue="basic" 
                      className="flex space-x-4"
                      onValueChange={setDeployMode}
                      value={deployMode}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic" className="text-lg">Counter Contract</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="storage" id="storage" />
                        <Label htmlFor="storage" className="text-lg">SimpleStorage Contract</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {deployMode === 'basic' ? (
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Counter Contract</h3>
                      <p className="text-muted-foreground mb-4">
                        This contract allows you to maintain a counter value that can be incremented and decremented.
                        After deployment, you can call 'increment()' and 'decrement()' functions to update the counter.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">SimpleStorage Contract</h3>
                      <p className="text-muted-foreground mb-4">
                        This contract allows you to store and retrieve a simple numeric value on the blockchain.
                        After deployment, you can call 'set(uint256)' to store a value and 'get()' to retrieve it.
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full py-6 text-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    variant="default"
                  >
                    {isDeploying ? "DEPLOYING..." : "DEPLOY"}
                  </Button>
                  
                  <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center">
                    <span>Need help?</span>
                    <a href="https://docs.skuuy.com/deploy" target="_blank" rel="noopener noreferrer" className="ml-2 flex items-center text-primary hover:underline">
                      View documentation <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <DeploySuccess 
            txHash={txHash} 
            network={network} 
            contractAddress={contractAddress}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DeployContainer;
