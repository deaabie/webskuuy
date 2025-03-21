
import React from "react";
import { Helmet } from "react-helmet-async";
import { ThirdwebProvider, coinbaseWallet, metamaskWallet, walletConnect } from "@thirdweb-dev/react";
import DeployContainer from "@/components/deploy/DeployContainer";

const Deploy = () => {
  // ThirdWeb client ID
  const clientId = "14b121e3f60af4f5f33938007bb8c6f8";

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Deploy Smart Contracts | Easy Deployment Tool</title>
        <meta name="description" content="Deploy your smart contracts to testnet or mainnet with our easy-to-use tool" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Deploy Smart Contract</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Deploy your smart contract to testnet or mainnet networks with just a few clicks
        </p>

        <ThirdwebProvider 
          clientId={clientId}
          supportedWallets={[
            metamaskWallet(),
            coinbaseWallet(),
            walletConnect()
          ]}
        >
          <DeployContainer />
        </ThirdwebProvider>
      </div>
    </div>
  );
};

export default Deploy;
