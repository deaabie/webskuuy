
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Server, Shield } from "lucide-react";

const DeployInfo: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Smart Contract Deployment</CardTitle>
        <CardDescription>
          Deploy your own smart contracts to various blockchain networks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Code className="h-5 w-5 mt-0.5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Write & Deploy</h3>
            <p className="text-sm text-muted-foreground">
              Choose from our templates or write custom Solidity code for your smart contracts
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Server className="h-5 w-5 mt-0.5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Multiple Networks</h3>
            <p className="text-sm text-muted-foreground">
              Deploy to Ethereum, Polygon, Arbitrum, Optimism and more networks
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 mt-0.5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Safe & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your private keys never leave your browser, and all transactions are signed locally
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-border">
          <h3 className="font-semibold text-sm mb-2">Recent Deployments</h3>
          <p className="text-xs text-muted-foreground italic">
            Connect your wallet to view your recent deployments
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeployInfo;
