
import React, { useState } from "react";
import { ConnectWallet, useChain, useConnectionStatus, useChainId } from "@thirdweb-dev/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkSelector from "./NetworkSelector";
import SmartContractForm from "./SmartContractForm";
import ConnectWalletButton from "./ConnectWalletButton";
import DeploymentStatus from "./DeploymentStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const DeployContainer = () => {
  const [activeTab, setActiveTab] = useState("deploy");
  const connectionStatus = useConnectionStatus();
  const chainId = useChainId();
  const chain = useChain();
  
  const isConnected = connectionStatus === "connected";

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Smart Contract Deployment</CardTitle>
        <CardDescription>
          Connect your wallet, select a network, and deploy your smart contract to testnet or mainnet
        </CardDescription>
        
        <div className="flex justify-end mt-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {chain?.name || "Unknown network"}
              </span>
              <ConnectWallet theme="dark" />
            </div>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isConnected ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="deploy">Deploy Contract</TabsTrigger>
              <TabsTrigger value="manage">Manage Deployments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deploy" className="mt-4">
              <Alert className="mb-6 bg-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Networks are loaded from your GitHub repository. Add or modify network configurations in the 
                  <code className="mx-1 px-1 py-0.5 bg-background rounded">src/data/chains/</code>
                  directory.
                </AlertDescription>
              </Alert>
              
              <NetworkSelector />
              <SmartContractForm />
            </TabsContent>
            
            <TabsContent value="manage" className="mt-4">
              <DeploymentStatus />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <h3 className="text-xl font-medium mb-4">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Please connect your wallet to deploy smart contracts. You'll be able to select from default networks or custom networks defined in your GitHub repository.
            </p>
            <ConnectWalletButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeployContainer;

