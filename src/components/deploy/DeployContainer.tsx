import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ConnectWalletButton from './ConnectWalletButton';
import NetworkSelector from './NetworkSelector';
import DeploySuccess from './DeploySuccess';
import { ExternalLink } from 'lucide-react';
import { getContractByMode, getDefaultMessage } from '../../utils/contractUtils';

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
  const [messageToDeploy, setMessageToDeploy] = useState("Hello, Blockchain!");

  const [tokenName, setTokenName] = useState("My Token");
  const [tokenSymbol, setTokenSymbol] = useState("MTK");

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
      const { abi, bytecode, contractArgs } = getContractByMode(
        deployMode, 
        deployMode === 'basic' ? messageToDeploy : { name: tokenName, symbol: tokenSymbol }
      );
      
      console.log("Deploying contract with args:", contractArgs);
      console.log("Bytecode length:", bytecode.length);
      
      if (!bytecode.startsWith('0x') || bytecode.length < 4) {
        throw new Error("Invalid bytecode format");
      }
      
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
      
      console.log("Attempting to deploy contract...");
      const contract = await contractFactory.deploy(...contractArgs);
      
      console.log("Contract deployment transaction hash:", contract.deploymentTransaction()?.hash);
      
      const deploymentTransaction = contract.deploymentTransaction();
      if (deploymentTransaction) {
        setTxHash(deploymentTransaction.hash);
      } else {
        throw new Error("No deployment transaction found");
      }
      
      await contract.waitForDeployment();
      
      const contractAddress = await contract.getAddress();
      console.log("Contract deployed at address:", contractAddress);
      
      setContractAddress(contractAddress);
      setDeploySuccess(true);
      
      toast({
        title: "Smart contract deployed!",
        description: "Your smart contract has been successfully deployed to the blockchain.",
      });
    } catch (error: any) {
      console.error("Deployment error:", error);
      let errorMessage = "There was an error deploying your smart contract.";
      
      if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User denied")) {
          errorMessage = "Transaction was rejected by the user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds to deploy the contract. Please add more ETH to your wallet.";
        } else if (error.message.includes("invalid bytecode")) {
          errorMessage = "Invalid bytecode format. Please try again or contact support.";
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
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic" className="text-lg">Basic Mode</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="erc20" id="erc20" />
                        <Label htmlFor="erc20" className="text-lg">ERC20 Mode</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {deployMode === 'basic' ? (
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Contract Message</h3>
                      <Textarea 
                        placeholder={getDefaultMessage()}
                        className="min-h-24"
                        value={messageToDeploy}
                        onChange={(e) => setMessageToDeploy(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tokenName">Token Name</Label>
                        <Input 
                          id="tokenName"
                          placeholder="My Token" 
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tokenSymbol">Token Symbol</Label>
                        <Input 
                          id="tokenSymbol" 
                          placeholder="MTK" 
                          value={tokenSymbol}
                          onChange={(e) => setTokenSymbol(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full py-6 text-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    onClick={handleDeploy}
                    disabled={isDeploying || !network}
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
