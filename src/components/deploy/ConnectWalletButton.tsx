
import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Wallet, LogOut } from 'lucide-react';

interface ConnectWalletButtonProps {
  onConnectionChange: (status: boolean, address: string, provider: ethers.Provider | null, signer: ethers.Signer | null) => void;
}

const ConnectWalletButton = ({ onConnectionChange }: ConnectWalletButtonProps) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [displayAddress, setDisplayAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const userAddress = accounts[0];
          const truncatedAddress = `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`;
          
          // Create ethers provider and signer
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          const ethersSigner = await ethersProvider.getSigner();
          
          setAddress(userAddress);
          setDisplayAddress(truncatedAddress);
          setConnected(true);
          setProvider(ethersProvider);
          setSigner(ethersSigner);
          
          onConnectionChange(true, userAddress, ethersProvider, ethersSigner);
          
          toast({
            title: "Wallet connected",
            description: `Connected to ${truncatedAddress}`,
          });
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
            if (newAccounts.length === 0) {
              disconnectWallet();
            } else {
              const newAddress = newAccounts[0];
              const newTruncatedAddress = `${newAddress.substring(0, 6)}...${newAddress.substring(newAddress.length - 4)}`;
              setAddress(newAddress);
              setDisplayAddress(newTruncatedAddress);
              
              // Update the signer when account changes
              const updateSigner = async () => {
                if (provider) {
                  const newSigner = await (provider as ethers.BrowserProvider).getSigner();
                  setSigner(newSigner);
                  onConnectionChange(true, newAddress, provider, newSigner);
                }
              };
              
              updateSigner();
            }
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
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
    setDisplayAddress('');
    setProvider(null);
    setSigner(null);
    onConnectionChange(false, '', null, null);
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
    
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
            <span className="text-lg font-medium">{displayAddress}</span>
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
