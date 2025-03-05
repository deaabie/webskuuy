
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChainConfig, getChainConfigs, checkEndpointStatus } from '@/services/cosmosService';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const CosmosExplorer: React.FC = () => {
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet'>('mainnet');
  const [chains, setChains] = useState<ChainConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [endpointStatus, setEndpointStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchChains = async () => {
      setLoading(true);
      const chainsData = await getChainConfigs(networkType);
      setChains(chainsData);
      
      // Check endpoint status
      const statusChecks: Record<string, boolean> = {};
      for (const chain of chainsData) {
        if (chain.api.length > 0) {
          statusChecks[`${chain.chain_name}-api`] = await checkEndpointStatus(chain.api[0].address);
        }
        if (chain.rpc.length > 0) {
          statusChecks[`${chain.chain_name}-rpc`] = await checkEndpointStatus(chain.rpc[0].address);
        }
      }
      setEndpointStatus(statusChecks);
      setLoading(false);
    };

    fetchChains();
  }, [networkType]);

  return (
    <div className="container mx-auto py-8 px-4">
      <SEO 
        title="Cosmos Ecosystem Explorer"
        description="Explore Cosmos ecosystem blockchains, including both mainnet and testnet networks."
        canonicalUrl="https://skuuy.com/explorer"
      />
      
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cosmos Ecosystem Explorer</h1>
        <p className="text-muted-foreground">Explore Cosmos ecosystem blockchains</p>
      </div>
      
      <Tabs defaultValue="mainnet" className="w-full max-w-5xl mx-auto mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mainnet" onClick={() => setNetworkType('mainnet')}>Mainnet</TabsTrigger>
          <TabsTrigger value="testnet" onClick={() => setNetworkType('testnet')}>Testnet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mainnet" className="mt-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <p>Loading mainnet chains...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chains.map((chain) => (
                <ChainCard 
                  key={chain.chain_name} 
                  chain={chain} 
                  endpointStatus={endpointStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="testnet" className="mt-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <p>Loading testnet chains...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chains.map((chain) => (
                <ChainCard 
                  key={chain.chain_name} 
                  chain={chain} 
                  endpointStatus={endpointStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ChainCardProps {
  chain: ChainConfig;
  endpointStatus: Record<string, boolean>;
}

const ChainCard: React.FC<ChainCardProps> = ({ chain, endpointStatus }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/explorer/${chain.chain_name}`}>
        <CardHeader className="p-6 flex flex-row items-center space-y-0 gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-background flex items-center justify-center">
            <img 
              src={chain.logo} 
              alt={chain.display_name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <CardTitle className="text-xl">{chain.display_name}</CardTitle>
            <div className="text-sm text-muted-foreground">{chain.chain_id}</div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <div className="text-sm font-medium">API Status</div>
              <Badge variant={endpointStatus[`${chain.chain_name}-api`] ? "default" : "destructive"}>
                {endpointStatus[`${chain.chain_name}-api`] ? "Online" : "Offline"}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium">RPC Status</div>
              <Badge variant={endpointStatus[`${chain.chain_name}-rpc`] ? "default" : "destructive"}>
                {endpointStatus[`${chain.chain_name}-rpc`] ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">Address Prefix:</span> {chain.addr_prefix}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Assets:</span> {chain.assets.map(a => a.symbol).join(', ')}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CosmosExplorer;
