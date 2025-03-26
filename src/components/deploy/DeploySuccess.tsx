
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getNetworkById } from '@/config/deploy-config';
import { NetworkConfig } from '@/components/faucet/types';

interface DeploySuccessProps {
  txHash: string;
  network: string;
  contractAddress: string;
}

const DeploySuccess = ({ txHash, network, contractAddress }: DeploySuccessProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<NetworkConfig | null>(null);
  
  useEffect(() => {
    // Look up network configuration
    const networkConfig = getNetworkById(network);
    if (networkConfig) {
      setNetworkInfo(networkConfig);
    } else {
      // Try to find in custom networks
      try {
        const customNetworks = JSON.parse(localStorage.getItem('customNetworks') || '[]');
        const customNetwork = customNetworks.find((n: NetworkConfig) => n.id === network);
        if (customNetwork) {
          setNetworkInfo(customNetwork);
        }
      } catch (e) {
        console.error('Error loading custom networks:', e);
      }
    }
  }, [network]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    toast({
      title: "Address copied!",
      description: "Contract address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = () => {
    if (!networkInfo) return '#';
    
    if (contractAddress) {
      return networkInfo.explorer.replace('/tx/', '/address/') + contractAddress;
    }
    
    return networkInfo.explorer + txHash;
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Deployment Successful!</h3>
        <p className="text-muted-foreground">
          Your smart contract has been successfully deployed to {networkInfo?.name || network}.
        </p>
      </div>
      
      <div className="bg-muted p-4 rounded-md w-full flex flex-col space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contract Address:</span>
            <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="h-6 px-2">
              {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <p className="font-mono text-sm break-all">{contractAddress}</p>
        </div>
      </div>
      
      <div className="flex gap-4 w-full">
        <Button variant="outline" className="w-1/2" onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </Button>
        <Button className="w-1/2" onClick={() => window.open(getExplorerUrl(), '_blank')}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </Button>
      </div>
    </div>
  );
};

export default DeploySuccess;
