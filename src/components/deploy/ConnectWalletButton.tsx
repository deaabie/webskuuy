
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  useConnect, 
  metamaskWallet,
  coinbaseWallet,
  walletConnect
} from "@thirdweb-dev/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";

const ConnectWalletButton = () => {
  const connect = useConnect();
  const metamask = metamaskWallet();
  const coinbase = coinbaseWallet();
  const walletConnector = walletConnect();

  const connectMetamask = async () => {
    try {
      await connect(metamask);
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
    }
  };

  const connectCoinbase = async () => {
    try {
      await connect(coinbase);
    } catch (error) {
      console.error("Failed to connect to Coinbase Wallet:", error);
    }
  };

  const connectWalletConnect = async () => {
    try {
      await connect(walletConnector);
    } catch (error) {
      console.error("Failed to connect using WalletConnect:", error);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={connectMetamask} className="cursor-pointer">
            MetaMask
          </DropdownMenuItem>
          <DropdownMenuItem onClick={connectCoinbase} className="cursor-pointer">
            Coinbase Wallet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={connectWalletConnect} className="cursor-pointer">
            WalletConnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConnectWalletButton;

