
import { Button } from "../ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface DeploySuccessProps {
  txHash: string;
  network: string;
}

const DeploySuccess = ({ txHash, network }: DeploySuccessProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = () => {
    switch (network) {
      case 'ethereum':
        return `https://etherscan.io/tx/${txHash}`;
      case 'polygon':
        return `https://polygonscan.com/tx/${txHash}`;
      case 'bsc':
        return `https://bscscan.com/tx/${txHash}`;
      case 'optimism':
        return `https://optimistic.etherscan.io/tx/${txHash}`;
      case 'arbitrum':
        return `https://arbiscan.io/tx/${txHash}`;
      case 'avalanche':
        return `https://snowtrace.io/tx/${txHash}`;
      case 'base':
        return `https://basescan.org/tx/${txHash}`;
      case 'sepolia':
        return `https://sepolia.etherscan.io/tx/${txHash}`;
      case 'arbitrum-sepolia':
        return `https://sepolia.arbiscan.io/tx/${txHash}`;
      case 'optimism-sepolia':
        return `https://sepolia-optimistic.etherscan.io/tx/${txHash}`;
      case 'base-sepolia':
        return `https://sepolia.basescan.org/tx/${txHash}`;
      case 'blast-sepolia':
        return `https://sepolia.blastscan.io/tx/${txHash}`;
      default:
        return `https://etherscan.io/tx/${txHash}`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-center">Contract Deployed Successfully!</h2>
      
      <div className="w-full bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Transaction Hash:</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={copyToClipboard}
            className="h-6 px-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-1 break-all font-mono text-sm">{txHash}</div>
      </div>
      
      <div className="w-full space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(getExplorerUrl(), '_blank')}
        >
          View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
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
  );
};

export default DeploySuccess;
