
import { ExternalLink } from "lucide-react";

interface TransactionDetailsProps {
  details: {
    txHash: string;
    amount: string;
    network: string;
    symbol: string;
    explorerUrl: string;
  };
}

const TransactionDetails = ({ details }: TransactionDetailsProps) => {
  // Format explorer URL correctly
  const getFormattedExplorerUrl = () => {
    if (!details.explorerUrl || !details.txHash) return "#";
    
    // Check if the URL already contains the transaction hash
    if (details.explorerUrl.includes(details.txHash)) {
      return details.explorerUrl;
    }
    
    // Ensure the explorer URL ends with /
    let formattedUrl = details.explorerUrl;
    if (!formattedUrl.endsWith('/')) {
      formattedUrl += '/';
    }
    
    // Add the transaction hash
    return `${formattedUrl}${details.txHash}`;
  };

  return (
    <div className="mt-4 p-4 bg-muted rounded-md border">
      <h3 className="font-medium mb-2">Transaction Details</h3>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Amount:</span> {details.amount} {details.symbol}
        </p>
        <p>
          <span className="font-medium">Network:</span> {details.network}
        </p>
        <p className="flex items-center gap-1">
          <span className="font-medium">Transaction:</span> 
          <a 
            href={getFormattedExplorerUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center"
          >
            View on explorer <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Transaction may take a few minutes to complete.
        </p>
      </div>
    </div>
  );
};

export default TransactionDetails;
