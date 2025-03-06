
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const filteredChains = chains.filter(chain => 
    chain.display_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chain.chain_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chain.chain_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <SEO 
        title="Cosmos Ecosystem Explorer" 
        description="Explore Cosmos ecosystem blockchains, including both mainnet and testnet networks." 
        canonicalUrl="https://skuuy.com/explorer" 
      />
      
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Skuuy Ecosystem Explorer</h1>
          <p className="text-muted-foreground">Explore Cosmos ecosystem blockchains</p>
        </div>
        
        <div className="w-full max-w-5xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chains by name or chain ID" 
              className="pl-10" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
        
        <Tabs defaultValue="mainnet" className="w-full max-w-5xl mx-auto mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="mainnet" 
              onClick={() => setNetworkType('mainnet')}
            >
              Mainnet
            </TabsTrigger>
            <TabsTrigger 
              value="testnet" 
              onClick={() => setNetworkType('testnet')}
            >
              Testnet
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mainnet" className="mt-6">
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading mainnet chains...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChains.map(chain => (
                  <ChainCard key={chain.chain_name} chain={chain} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChains.map(chain => (
                  <ChainCard key={chain.chain_name} chain={chain} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ChainCardProps {
  chain: ChainConfig;
}

const ChainCard: React.FC<ChainCardProps> = ({ chain }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/explorer/${chain.chain_name}`}>
        <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-background flex items-center justify-center">
            <img 
              src={chain.logo} 
              alt={chain.display_name} 
              className="w-8 h-8 object-contain" 
              onError={e => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }} 
            />
          </div>
          <div>
            <CardTitle className="text-lg">{chain.display_name}</CardTitle>
            <div className="text-xs text-muted-foreground">{chain.chain_id}</div>
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default CosmosExplorer;
