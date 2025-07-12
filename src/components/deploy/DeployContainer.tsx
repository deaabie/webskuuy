
import { useState } from 'react';
import { useAccount, useWalletClient, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RainbowConnectButton from './RainbowConnectButton';
import NetworkSelector from './NetworkSelector';
import DeploySuccess from './DeploySuccess';
import ContractTypeSelector from './ContractTypeSelector';
import ContractDetails from './ContractDetails';
import DeployAction from './DeployAction';
import { useDeployContract } from '../../hooks/use-deploy-contract';

const DeployContainer = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  
  const [network, setNetwork] = useState("");
  const [deployMode, setDeployMode] = useState("basic");
  const [tokenName, setTokenName] = useState("MyToken");
  const [tokenSymbol, setTokenSymbol] = useState("MTK");
  const [tokenSupply, setTokenSupply] = useState("1000000");

  const handleTokenDetailsChange = (name: string, symbol: string, supply: string) => {
    setTokenName(name);
    setTokenSymbol(symbol);
    setTokenSupply(supply);
  };

  const { 
    isDeploying, 
    deploySuccess, 
    txHash, 
    contractAddress, 
    handleDeploy 
  } = useDeployContract({ 
    connected: isConnected, 
    network, 
    deployMode, 
    walletClient,
    tokenDetails: {
      name: tokenName,
      symbol: tokenSymbol,
      supply: tokenSupply
    }
  });

  const handleNetworkChange = (networkId: string) => {
    setNetwork(networkId);
  };

  return (
    <Card className="w-full bg-card border-border dark:bg-gray-900">
      <CardHeader className="border-b border-border/30 pb-4">
        <CardTitle className="text-2xl font-bold text-primary">Deploy Your Smart Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {!deploySuccess ? (
          <>
            <div className="space-y-5">
              <div className="mb-4">
                <RainbowConnectButton />
              </div>
              
              {isConnected && (
                <>
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium">Select Network</h3>
                    <NetworkSelector onNetworkChange={handleNetworkChange} />
                  </div>
                  
                  <ContractTypeSelector 
                    deployMode={deployMode} 
                    setDeployMode={setDeployMode} 
                  />
                  
                  <ContractDetails 
                    deployMode={deployMode} 
                    onTokenDetailsChange={handleTokenDetailsChange}
                  />
                  
                  <DeployAction 
                    isDeploying={isDeploying} 
                    handleDeploy={handleDeploy} 
                  />
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
