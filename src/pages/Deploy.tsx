
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ThirdwebProvider } from "@thirdweb-dev/react";

import DeployHeader from "@/components/deploy/DeployHeader";
import DeployForm from "@/components/deploy/DeployForm";
import DeployInfo from "@/components/deploy/DeployInfo";
import DeployFooter from "@/components/deploy/DeployFooter";
import { NETWORK_CONFIG } from "@/config/deploy-config";

const Deploy = () => {
  // Use the network configuration directly
  const networks = Object.values(NETWORK_CONFIG);
  
  return (
    <ThirdwebProvider
      clientId="14b121e3f60af4f5f33938007bb8c6f8"
      activeChain="ethereum"
    >
      <Helmet>
        <title>Deploy Smart Contracts | Blockchain Tools</title>
        <meta name="description" content="Deploy your own smart contracts to various blockchain networks" />
      </Helmet>
      
      <div className="container max-w-4xl py-6 md:py-12 px-4 md:px-6">
        <DeployHeader 
          title="Deploy Your Smart Contract"
          description="Deploy custom smart contracts to various blockchain networks. Connect your wallet, select a network, and deploy your code with just a few clicks."
        />

        <div className="grid gap-6 md:gap-8 md:grid-cols-[1fr_300px]">
          <DeployForm networks={networks} />
          <DeployInfo />
        </div>

        <DeployFooter />
      </div>
    </ThirdwebProvider>
  );
};

export default Deploy;
