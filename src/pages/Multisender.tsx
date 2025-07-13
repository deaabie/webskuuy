
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RainbowConnectButton from '@/components/deploy/RainbowConnectButton';
import NetworkSelector from '@/components/deploy/NetworkSelector';
import MultisenderForm from '@/components/multisender/MultisenderForm';
import { useAccount } from 'wagmi';

const Multisender = () => {
  const { isConnected } = useAccount();
  const [network, setNetwork] = useState("");

  const handleNetworkChange = (networkId: string) => {
    setNetwork(networkId);
  };

  return (
    <div className="container max-w-6xl py-6 md:py-12 px-4 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Multi-Sender</h1>
        <p className="text-xl text-muted-foreground">
          Send tokens to multiple addresses in a single transaction
        </p>
      </div>

      <Card className="w-full bg-card border-border dark:bg-gray-900">
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-2xl font-bold text-primary">Send Tokens to Multiple Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
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
                
                <MultisenderForm network={network} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Multisender;
