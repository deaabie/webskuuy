
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";
import { useAddress, useDisconnect, useConnectionStatus, useConnect } from "@thirdweb-dev/react";

interface ConnectWalletButtonProps {
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className }) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const status = useConnectionStatus();
  const connect = useConnect();

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (status === "unknown" || status === "connecting") {
    return (
      <Button variant="outline" disabled className={className}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
        Connecting...
      </Button>
    );
  }

  if (status === "connected" && address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className={className} onClick={() => disconnect()}>
          <Wallet className="h-4 w-4 mr-2" />
          {truncateAddress(address)}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" className={className} onClick={() => connect()}>
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
