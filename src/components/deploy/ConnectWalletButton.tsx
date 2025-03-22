
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Wallet, LogOut } from 'lucide-react';

interface ConnectWalletButtonProps {
  onConnectionChange: (status: boolean) => void;
}

const ConnectWalletButton = ({ onConnectionChange }: ConnectWalletButtonProps) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const truncatedAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
          
          setAddress(truncatedAddress);
          setConnected(true);
          onConnectionChange(true);
          
          toast({
            title: "Wallet connected",
            description: `Connected to ${truncatedAddress}`,
          });
        } catch (error) {
          console.error("User denied account access", error);
          toast({
            variant: "destructive",
            title: "Connection failed",
            description: "You denied access to your wallet",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "MetaMask not found",
          description: "Please install MetaMask extension to connect your wallet",
        });
      }
    } catch (error) {
      console.error("Connect wallet error:", error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to wallet",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    onConnectionChange(false);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-2">Wallet Connection</h3>
      {!connected ? (
        <Button 
          className="w-full py-6 text-lg"
          variant="outline"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          <Wallet className="mr-2 h-5 w-5" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center mr-3">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-medium">{address}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={disconnectWallet}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
