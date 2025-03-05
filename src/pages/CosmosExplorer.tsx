
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ChainConfig, getChainConfigs } from '@/services/cosmosService';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SEO from '@/components/SEO';

const CosmosExplorer: React.FC = () => {
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet'>('mainnet');
  const [chains, setChains] = useState<ChainConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChains = async () => {
      setLoading(true);
      const chainsData = await getChainConfigs(networkType);
      setChains(chainsData);
      setLoading(false);
    };

    fetchChains();
  }, [networkType]);

  // Filter chains based on search query
  const filteredChains = chains.filter(chain => 
    chain.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chain.chain_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chain.chain_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="mainnet" onClick={() => setNetworkType('mainnet')}>
            Mainnets <span className="ml-2 px-2 py-1 bg-background/20 rounded-full text-xs">{chains.length}</span>
          </TabsTrigger>
          <TabsTrigger value="testnet" onClick={() => setNetworkType('testnet')}>
            Testnets <span className="ml-2 px-2 py-1 bg-background/20 rounded-full text-xs">{chains.length}</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Search bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Enter network"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-muted rounded-full h-12"
          />
        </div>
        
        <TabsContent value="mainnet" className="mt-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <p>Loading mainnet chains...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredChains.map((chain) => (
                <ChainCard 
                  key={chain.chain_name} 
                  chain={chain} 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredChains.map((chain) => (
                <ChainCard 
                  key={chain.chain_name} 
                  chain={chain} 
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
}

const ChainCard: React.FC<ChainCardProps> = ({ chain }) => {
  return (
    <Link to={`/explorer/${chain.chain_name}`}>
      <Card className="h-full hover:bg-accent/50 transition-colors duration-200 border border-border/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={chain.logo} 
              alt={chain.display_name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="font-medium">{chain.display_name}</div>
            <div className="text-xs text-muted-foreground">{chain.chain_id}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CosmosExplorer;
