
import { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectWalletButton from './ConnectWalletButton';
import NetworkSelector from './NetworkSelector';
import DeploySuccess from './DeploySuccess';
import ContractTypeSelector from './ContractTypeSelector';
import ContractDetails from './ContractDetails';
import DeployAction from './DeployAction';
import { useDeployContract } from '../../hooks/use-deploy-contract';

const DeployContainer = () => {
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [deployMode, setDeployMode] = useState("basic");
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const { 
    isDeploying, 
    deploySuccess, 
    txHash, 
    contractAddress, 
    handleDeploy 
  } = useDeployContract({ 
    connected, 
    network, 
    deployMode, 
    signer 
  });

  const handleWalletConnection = (status: boolean, address: string, providerInstance: ethers.Provider | null, signerInstance: ethers.Signer | null) => {
    setConnected(status);
    setWalletAddress(address);
    setProvider(providerInstance);
    setSigner(signerInstance);
  };

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
                <ConnectWalletButton onConnectionChange={handleWalletConnection} />
              </div>
              
              {connected && (
                <>
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium">Select Network</h3>
                    <NetworkSelector onNetworkChange={handleNetworkChange} />
                  </div>
                  
                  <ContractTypeSelector 
                    deployMode={deployMode} 
                    setDeployMode={setDeployMode} 
                  />
                  
                  <ContractDetails deployMode={deployMode} />
                  
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
