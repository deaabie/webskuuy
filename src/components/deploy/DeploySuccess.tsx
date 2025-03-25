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
    const path = type === 'tx' ? `${txHash}` : `address/${contractAddress}`;
    
    // Try to find network in custom networks first
    const customNetworksStr = localStorage.getItem('customNetworks');
    if (customNetworksStr) {
      try {
        const customNetworks = JSON.parse(customNetworksStr);
        const customNetwork = customNetworks.find((n: any) => n.id === network);
        if (customNetwork && customNetwork.explorer) {
          // Make sure explorer URL ends with /
          const explorerBase = customNetwork.explorer.endsWith('/') 
            ? customNetwork.explorer 
            : `${customNetwork.explorer}/`;
          
          // If explorer already has tx/ or address/ in it, adjust accordingly
          if (type === 'tx' && explorerBase.endsWith('tx/')) {
            return `${explorerBase}${path}`;
          } else if (type === 'address' && explorerBase.endsWith('address/')) {
            return `${explorerBase}${contractAddress}`;
          }
          
          // Otherwise, return appropriate path
          return type === 'tx' 
            ? `${explorerBase}${path}`
            : `${explorerBase}address/${contractAddress}`;
        }
      } catch (e) {
        console.error('Failed to parse custom networks', e);
      }
    }

    // Handle mainnet networks
    if (network.includes('_mainnet') || network === 'ethereum' || network === 'arbitrum' || 
        network === 'optimism' || network === 'base' || network === 'blast') {
      
      switch (network.replace('_mainnet', '')) {
        case "ethereum":
          return `https://etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "polygon":
          return `https://polygonscan.com/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "optimism":
          return `https://optimistic.etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "arbitrum":
          return `https://arbiscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "base":
          return `https://basescan.org/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "blast":
          return `https://blastscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        default:
          return `https://etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
      }
    }
    // Handle testnet networks
    else {
      switch (network.replace('_sepolia', '').replace('_holesky', '')) {
        case "ethereum":
          if (network.includes('sepolia')) {
            return `https://sepolia.etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
          } else if (network.includes('holesky')) {
            return `https://holesky.etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
          }
          return `https://sepolia.etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "arbitrum":
          return `https://sepolia.arbiscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "optimism":
          return `https://sepolia-optimistic.etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "base":
          return `https://sepolia.basescan.org/${type}/${type === 'tx' ? txHash : contractAddress}`;
        case "blast":
          return `https://sepolia.blastscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
        default:
          return `https://sepolia.etherscan.io/${type}/${type === 'tx' ? txHash : contractAddress}`;
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
            onClick={() => {
              const url = getExplorerUrl('tx');
              console.log("Opening transaction URL:", url);
              window.open(url, '_blank');
            }}
          >
            View Transaction <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              const url = getExplorerUrl('address');
              console.log("Opening contract URL:", url);
              window.open(url, '_blank');
            }}
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
