
import React from 'react';
import { useNetwork, useNetworkMismatch, useSwitchChain } from '@thirdweb-dev/react';
import { Ethereum, Polygon, Optimism, Arbitrum, Base } from '@thirdweb-dev/chains';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import NetworkIcon from './NetworkIcon';

const networks = [
  { 
    ...Ethereum, 
    mainnet: Ethereum, 
    testnet: { ...Ethereum.testnet.goerli },
    icon: "ethereum"
  },
  { 
    ...Polygon, 
    mainnet: Polygon, 
    testnet: { ...Polygon.testnet.mumbai },
    icon: "polygon"
  },
  { 
    ...Optimism, 
    mainnet: Optimism, 
    testnet: { ...Optimism.testnet.goerli },
    icon: "optimism"
  },
  { 
    ...Arbitrum, 
    mainnet: Arbitrum, 
    testnet: { ...Arbitrum.testnet.goerli },
    icon: "arbitrum"
  },
  { 
    ...Base, 
    mainnet: Base, 
    testnet: { ...Base.testnet.goerli },
    icon: "base"
  },
];

const NetworkSelector = () => {
  const [, switchNetwork] = useNetwork();
  const switchChain = useSwitchChain();
  const isMismatched = useNetworkMismatch();

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchChain(chainId);
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Select Network</h3>
      
      {isMismatched && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your wallet is connected to a different network than the one selected.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {networks.map((network) => (
          <div key={network.chainId} className="flex flex-col space-y-2">
            <Card 
              className="cursor-pointer hover:bg-accent transition-colors p-1"
              onClick={() => handleNetworkSwitch(network.chainId)}
            >
              <CardContent className="flex flex-col items-center p-3">
                <NetworkIcon network={network.icon} className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">{network.name}</span>
              </CardContent>
            </Card>
            <div className="flex justify-center gap-2 text-xs">
              <span 
                className="cursor-pointer text-primary hover:underline" 
                onClick={() => handleNetworkSwitch(network.mainnet.chainId)}
              >
                Mainnet
              </span>
              <span 
                className="cursor-pointer text-primary hover:underline" 
                onClick={() => handleNetworkSwitch(network.testnet.chainId)}
              >
                Testnet
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;
