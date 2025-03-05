
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Server } from "lucide-react";
import { CosmosChain } from "@/services/cosmosService";

interface ChainCardProps {
  chain: CosmosChain;
  onClick: () => void;
}

const ChainCard = ({ chain, onClick }: ChainCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
              <img 
                src={chain.logo} 
                alt={chain.chain_name}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{chain.chain_name}</CardTitle>
              <CardDescription>{chain.registry_name}</CardDescription>
            </div>
          </div>
          <Badge variant={chain.is_testnet ? "secondary" : "default"}>
            {chain.is_testnet ? "Testnet" : "Mainnet"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assets */}
        <div>
          <p className="text-sm font-medium mb-1">Assets:</p>
          <div className="flex flex-wrap gap-2">
            {chain.assets.map((asset) => (
              <Badge key={asset.base} variant="outline" className="flex items-center gap-1">
                <span>{asset.symbol}</span>
              </Badge>
            ))}
          </div>
        </div>
        
        {/* SDK Version */}
        <div className="flex items-center gap-2 text-sm">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span>SDK: {chain.sdk_version}</span>
        </div>
        
        {/* RPC Endpoints Count */}
        <div className="flex items-center gap-2 text-sm">
          <Link className="h-4 w-4 text-muted-foreground" />
          <span>{chain.rpc.length} RPC Endpoint{chain.rpc.length > 1 ? 's' : ''}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-2 pt-0">
        <div className="flex justify-end w-full">
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChainCard;
