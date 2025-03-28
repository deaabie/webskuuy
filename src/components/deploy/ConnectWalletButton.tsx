
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Wallet } from 'lucide-react';
import { 
  ConnectWallet, 
  useAddress, 
  useChain, 
  useConnectionStatus, 
  useSigner,
  useDisconnect,
  useWallet
} from "@thirdweb-dev/react";

interface ConnectWalletButtonProps {
  onConnectionChange: (connected: boolean, address: string, provider: any | null, signer: any | null) => void;
}

const ConnectWalletButton = ({ onConnectionChange }: ConnectWalletButtonProps) => {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const signer = useSigner();
  const chain = useChain();
  const wallet = useWallet();
  const disconnect = useDisconnect();
  
  const isConnected = connectionStatus === "connected" && !!address;
  
  // Update parent component when connection status changes
  useEffect(() => {
    if (isConnected && address && signer) {
      onConnectionChange(true, address, wallet?.getProvider(), signer);
      toast({
        title: "Wallet connected",
        description: `Connected to ${chain?.name || 'network'} with address ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
    } else {
      onConnectionChange(false, "", null, null);
    }
  }, [isConnected, address, signer, chain, wallet, onConnectionChange]);

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <div className="space-y-2">
      {!isConnected ? (
        <div className="w-full">
          <ConnectWallet 
            theme="dark"
            btnTitle="Connect Wallet"
            modalTitle="Connect Your Wallet"
            modalSize="wide"
            welcomeScreen={{
              title: "Deploy Smart Contracts",
              subtitle: "Connect your wallet to get started",
            }}
            modalTitleIconUrl=""
            className="!w-full !py-6 !text-lg !font-semibold !flex !items-center !justify-center !bg-primary/90 !hover:bg-primary"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-muted/50 rounded-md px-4 py-3 border border-border/30">
            <div className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
              </span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleDisconnect}
              className="bg-muted hover:bg-muted/80"
            >
              Disconnect
            </Button>
          </div>
          {chain && (
            <div className="flex items-center justify-between bg-muted/50 rounded-md px-4 py-2 border border-border/30">
              <span className="text-xs text-muted-foreground">Network: {chain.name}</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Chain ID: {chain.chainId}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
