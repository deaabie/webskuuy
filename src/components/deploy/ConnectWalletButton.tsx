
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ethers } from 'ethers';
import { toast } from "@/hooks/use-toast";
import { Wallet } from 'lucide-react';

interface ConnectWalletButtonProps {
  onConnectionChange: (connected: boolean, address: string, provider: ethers.Provider | null, signer: ethers.Signer | null) => void;
}

// Define the window ethereum type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
      networkVersion?: string;
    };
  }
}

const ConnectWalletButton = ({ onConnectionChange }: ConnectWalletButtonProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!window.ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return false;
    }

    try {
      // Check if we're authorized to access the user's wallet
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        onConnectionChange(true, accounts[0], provider, signer);
        return true;
      } else {
        setIsConnected(false);
        setWalletAddress("");
        onConnectionChange(false, "", null, null);
        return false;
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
      setIsConnected(false);
      setWalletAddress("");
      onConnectionChange(false, "", null, null);
      return false;
    }
  }, [onConnectionChange]);

  useEffect(() => {
    // Check if wallet is connected when component mounts
    checkIfWalletIsConnected();
    
    // Set up listeners
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setIsConnected(false);
        setWalletAddress("");
        onConnectionChange(false, "", null, null);
        toast({
          title: "Wallet disconnected",
          description: "Your wallet has been disconnected.",
        });
      } else {
        // Account changed
        setWalletAddress(accounts[0]);
        checkIfWalletIsConnected();
      }
    };
    
    const handleChainChanged = () => {
      // When chain changes, refresh the page
      window.location.reload();
    };
    
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    
    // Clean up listeners when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [checkIfWalletIsConnected, onConnectionChange]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "MetaMask not found",
        description: "Please install MetaMask browser extension and reload the page.",
      });
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        onConnectionChange(true, accounts[0], provider, signer);
        
        toast({
          title: "Wallet connected",
          description: "Your wallet has been successfully connected.",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message || "Failed to connect to your wallet.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    onConnectionChange(false, "", null, null);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <div className="space-y-2">
      {!isConnected ? (
        <Button 
          className="w-full py-6 text-lg font-semibold flex items-center justify-center bg-primary/90 hover:bg-primary"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          <Wallet className="mr-2 h-5 w-5" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-muted/50 rounded-md px-4 py-3 border border-border/30">
            <div className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
              </span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={disconnectWallet}
              className="bg-muted hover:bg-muted/80"
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
