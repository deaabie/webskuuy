
import React, { useState } from "react";
import { ConnectWallet, useChain, useConnectionStatus, useChainId } from "@thirdweb-dev/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkSelector from "./NetworkSelector";
import SmartContractForm from "./SmartContractForm";
import ConnectWalletButton from "./ConnectWalletButton";
import DeploymentStatus from "./DeploymentStatus";

const DeployContainer = () => {
  const [tab, setTab] = useState("deploy");
  const connectionStatus = useConnectionStatus();
  const chainId = useChainId();
  const chain = useChain();
  
  const isConnected = connectionStatus === "connected";

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Smart Contract Deployment</CardTitle>
        <CardDescription>
          Connect your wallet, select a network, and deploy your smart contract
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
          <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="deploy">Deploy Contract</TabsTrigger>
              <TabsTrigger value="manage">Manage Networks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deploy" className="mt-4">
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
              Please connect your wallet to deploy smart contracts.
            </p>
            <ConnectWalletButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeployContainer;
