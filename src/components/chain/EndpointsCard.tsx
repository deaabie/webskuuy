
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Server } from 'lucide-react';
import { ChainConfig } from '@/services/cosmosService';

interface EndpointsCardProps {
  chain: ChainConfig;
  activeEndpoint: {api: string, rpc: string};
  setActiveEndpoint: React.Dispatch<React.SetStateAction<{api: string, rpc: string}>>;
}

const EndpointsCard: React.FC<EndpointsCardProps> = ({ 
  chain, 
  activeEndpoint, 
  setActiveEndpoint 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-purple-500" />
          Endpoints
        </CardTitle>
        <CardDescription>API and RPC endpoints for {chain.display_name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">REST API Endpoints</div>
            <div className="space-y-2">
              {chain.api.map((api, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button 
                    variant={activeEndpoint.api === api.address ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveEndpoint({...activeEndpoint, api: api.address})}
                  >
                    {api.provider}
                  </Button>
                  <span className="font-mono text-sm truncate">{api.address}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-sm font-medium mb-2">RPC Endpoints</div>
            <div className="space-y-2">
              {chain.rpc.map((rpc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button 
                    variant={activeEndpoint.rpc === rpc.address ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveEndpoint({...activeEndpoint, rpc: rpc.address})}
                  >
                    {rpc.provider}
                  </Button>
                  <span className="font-mono text-sm truncate">{rpc.address}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointsCard;
