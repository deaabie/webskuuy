
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CosmosChain, checkRpcStatus } from "@/services/cosmosService";

interface ChainDetailModalProps {
  chain: CosmosChain;
  onClose: () => void;
}

const ChainDetailModal = ({ chain, onClose }: ChainDetailModalProps) => {
  const { toast } = useToast();
  const [rpcStatus, setRpcStatus] = useState<Record<string, boolean>>({});
  
  // Check RPC status when a chain is selected
  useEffect(() => {
    const checkEndpoints = async () => {
      const statusMap: Record<string, boolean> = {};
      
      for (const rpc of chain.rpc) {
        const isAlive = await checkRpcStatus(rpc.address);
        statusMap[rpc.address] = isAlive;
      }
      
      setRpcStatus(statusMap);
    };
    
    checkEndpoints();
  }, [chain]);
  
  const handleCopy = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description
    });
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                <img 
                  src={chain.logo} 
                  alt={chain.chain_name}
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{chain.chain_name}</h2>
                <p className="text-muted-foreground">{chain.registry_name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={chain.is_testnet ? "secondary" : "default"}>
                {chain.is_testnet ? "Testnet" : "Mainnet"}
              </Badge>
              <Button variant="outline" size="icon" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6L18 18"></path>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Chain Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Prefix</p>
                <p className="font-mono">{chain.addr_prefix}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Coin Type</p>
                <p className="font-mono">{chain.coin_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">SDK Version</p>
                <p className="font-mono">{chain.sdk_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Min TX Fee</p>
                <p className="font-mono">{chain.min_tx_fee}</p>
              </div>
            </div>
            
            {/* Assets */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Assets</h3>
              <div className="space-y-4">
                {chain.assets.map((asset) => (
                  <div key={asset.base} className="flex items-center p-3 bg-muted rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-background overflow-hidden flex items-center justify-center mr-3">
                      <img 
                        src={asset.logo} 
                        alt={asset.symbol}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{asset.symbol}</p>
                      <p className="text-sm text-muted-foreground">Denom: {asset.base}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Exponent: {asset.exponent}</p>
                      {asset.coingecko_id && (
                        <a 
                          href={`https://www.coingecko.com/en/coins/${asset.coingecko_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View on CoinGecko
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* API Endpoints */}
            <div>
              <h3 className="text-lg font-semibold mb-3">API Endpoints</h3>
              <div className="space-y-2">
                {chain.api.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{api.provider}</p>
                      <p className="text-sm font-mono break-all">{api.address}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      handleCopy(api.address, "API endpoint copied to clipboard");
                    }}>
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* RPC Endpoints */}
            <div>
              <h3 className="text-lg font-semibold mb-3">RPC Endpoints</h3>
              <div className="space-y-2">
                {chain.rpc.map((rpc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{rpc.provider}</p>
                        <Badge variant="outline" className="h-5">
                          <span className="flex items-center gap-1">
                            <span className={`h-2 w-2 rounded-full ${
                              rpcStatus[rpc.address] ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            {rpcStatus[rpc.address] ? 'Online' : 'Offline'}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm font-mono break-all">{rpc.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        handleCopy(rpc.address, "RPC endpoint copied to clipboard");
                      }}>
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        window.open(`${rpc.address}/status`, '_blank');
                      }}>
                        Check
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Keplr Integration */}
            {chain.keplr_features && chain.keplr_features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Keplr Features</h3>
                <div className="flex flex-wrap gap-2">
                  {chain.keplr_features.map((feature) => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* GitHub Repository */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  This chain's data is maintained in our GitHub repository. 
                  <Button variant="link" className="h-auto p-0 text-sm" onClick={() => {
                    toast({
                      title: "GitHub Repository",
                      description: "The link to submit PRs for chain updates will be available soon."
                    });
                  }}>
                    Submit a PR to update this information.
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainDetailModal;
