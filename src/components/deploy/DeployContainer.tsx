
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ConnectWalletButton from './ConnectWalletButton';
import NetworkSelector from './NetworkSelector';
import DeploySuccess from './DeploySuccess';
import { ExternalLink } from 'lucide-react';

const DeployContainer = () => {
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [deployMode, setDeployMode] = useState("basic");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleWalletConnection = (status: boolean) => {
    setConnected(status);
  };

  const handleNetworkChange = (networkId: string) => {
    setNetwork(networkId);
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

    setIsDeploying(true);

    try {
      // Simulate contract deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful deployment
      const mockTxHash = "0xE5b4D4573C0f5CF6a2667fc7c21fa5D638031638";
      setTxHash(mockTxHash);
      setDeploySuccess(true);
      
      toast({
        title: "Smart contract deployed!",
        description: "Your smart contract has been successfully deployed.",
      });
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        variant: "destructive",
        title: "Deployment failed",
        description: "There was an error deploying your smart contract.",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Deploy Your Smart Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!deploySuccess ? (
          <>
            <div className="space-y-4">
              <div className="mb-6">
                <ConnectWalletButton onConnectionChange={handleWalletConnection} />
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
          <DeploySuccess txHash={txHash} network={network} />
        )}
      </CardContent>
    </Card>
  );
};

export default DeployContainer;
