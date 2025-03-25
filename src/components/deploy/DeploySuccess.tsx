
import { Button } from "../ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface DeploySuccessProps {
  txHash: string;
  network: string;
  contractAddress: string;
}

const DeploySuccess = ({ txHash, network, contractAddress }: DeploySuccessProps) => {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = (text: string, type: 'tx' | 'address') => {
    navigator.clipboard.writeText(text);
    
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
    
    toast({
      title: "Copied to clipboard",
      description: `${type === 'tx' ? 'Transaction hash' : 'Contract address'} has been copied to clipboard`,
    });
  };

  const getExplorerUrl = (type: 'tx' | 'address') => {
    const path = type === 'tx' ? `tx/${txHash}` : `address/${contractAddress}`;
    
    // Handle mainnet networks
    if (network.includes('_mainnet') || !network.includes('_')) {
      switch (network) {
        case "ethereum_mainnet":
          return `https://etherscan.io/${path}`;
        case "polygon_mainnet":
          return `https://polygonscan.com/${path}`;
        case "optimism_mainnet":
          return `https://optimistic.etherscan.io/${path}`;
        case "arbitrum_mainnet":
          return `https://arbiscan.io/${path}`;
        case "base_mainnet":
          return `https://basescan.org/${path}`;
        case "blast_mainnet":
          return `https://blastscan.io/${path}`;
        default:
          // Try to find a custom network first
          const customNetworksStr = localStorage.getItem('customNetworks');
          if (customNetworksStr) {
            try {
              const customNetworks = JSON.parse(customNetworksStr);
              const customNetwork = customNetworks.find((n: any) => n.id === network);
              if (customNetwork && customNetwork.blockExplorer) {
                return `${customNetwork.blockExplorer}/${path}`;
              }
            } catch (e) {
              console.error('Failed to parse custom networks', e);
            }
          }
          // Default fallback
          return `https://etherscan.io/${path}`;
      }
    }
    // Handle testnet networks
    else {
      switch (network) {
        case "ethereum_sepolia":
          return `https://sepolia.etherscan.io/${path}`;
        case "ethereum_holesky":
          return `https://holesky.etherscan.io/${path}`;
        case "arbitrum_sepolia":
          return `https://sepolia.arbiscan.io/${path}`;
        case "optimism_sepolia":
          return `https://sepolia-optimistic.etherscan.io/${path}`;
        case "base_sepolia":
          return `https://sepolia.basescan.org/${path}`;
        case "blast_sepolia":
          return `https://sepolia.blastscan.io/${path}`;
        default:
          // Try to use a custom explorer if available for custom networks
          const customNetworksStr = localStorage.getItem('customNetworks');
          if (customNetworksStr) {
            try {
              const customNetworks = JSON.parse(customNetworksStr);
              const customNetwork = customNetworks.find((n: any) => n.id === network);
              if (customNetwork && customNetwork.blockExplorer) {
                return `${customNetwork.blockExplorer}/${path}`;
              }
            } catch (e) {
              console.error('Failed to parse custom networks', e);
            }
          }
          return `https://etherscan.io/${path}`;
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-center">Contract Deployed Successfully!</h2>
      
      <div className="w-full space-y-4">
        <div className="w-full bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Transaction Hash:</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(txHash, 'tx')}
              className="h-6 px-2"
            >
              {copiedTx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-1 break-all font-mono text-sm">{txHash}</div>
        </div>
        
        <div className="w-full bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contract Address:</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(contractAddress, 'address')}
              className="h-6 px-2"
            >
              {copiedAddress ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-1 break-all font-mono text-sm">{contractAddress}</div>
        </div>
        
        <div className="w-full space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(getExplorerUrl('tx'), '_blank')}
          >
            View Transaction <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(getExplorerUrl('address'), '_blank')}
          >
            View Contract <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Deploy Another Contract
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeploySuccess;
