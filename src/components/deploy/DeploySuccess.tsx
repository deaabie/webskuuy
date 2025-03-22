
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface DeploySuccessProps {
  txHash: string;
  network: string;
}

const DeploySuccess = ({ txHash, network }: DeploySuccessProps) => {
  const [copied, setCopied] = useState(false);

  const getExplorerUrl = () => {
    // This is a simplified version - in a real app you'd have a more complete mapping
    const explorers: Record<string, string> = {
      'ethereum': 'https://etherscan.io/tx/',
      'goerli': 'https://goerli.etherscan.io/tx/',
      'polygon': 'https://polygonscan.com/tx/',
      'mumbai': 'https://mumbai.polygonscan.com/tx/',
      'bsc': 'https://bscscan.com/tx/',
      'bsc-testnet': 'https://testnet.bscscan.com/tx/',
      'optimism': 'https://optimistic.etherscan.io/tx/',
      'optimism-goerli': 'https://goerli-optimism.etherscan.io/tx/',
      'arbitrum': 'https://arbiscan.io/tx/',
      'arbitrum-goerli': 'https://goerli.arbiscan.io/tx/',
      'avalanche': 'https://snowtrace.io/tx/',
      'fuji': 'https://testnet.snowtrace.io/tx/',
      'base': 'https://basescan.org/tx/',
      'base-goerli': 'https://goerli.basescan.org/tx/',
    };
    
    return (explorers[network] || 'https://etherscan.io/tx/') + txHash;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-950/30 border border-green-400 rounded-lg p-4 flex items-start">
        <div className="bg-green-500 rounded-full p-1 mr-3 flex-shrink-0">
          <Check className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-green-400">Congratulations, your smart contract has been deployed</h3>
          <p className="text-gray-400 mt-1">Your contract is now live on the blockchain</p>
        </div>
      </div>
      
      <Card className="bg-black/30 border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Transaction Hash:</span>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-yellow-400 hover:text-yellow-500"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 text-yellow-400 hover:text-yellow-500"
              onClick={() => window.open(getExplorerUrl(), '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-1 font-mono text-yellow-400 break-all">{txHash}</div>
      </Card>
      
      <div className="mt-6 space-y-3">
        <Button
          className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white"
          variant="outline"
          onClick={() => window.open(getExplorerUrl(), '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </Button>
        
        <Button
          className="w-full py-2"
          variant="default"
          onClick={() => window.location.reload()}
        >
          Deploy Another Contract
        </Button>
      </div>
    </div>
  );
};

export default DeploySuccess;
