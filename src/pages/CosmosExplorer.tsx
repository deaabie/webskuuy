
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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8 px-4">
        <SEO 
          title="Cosmos Ecosystem Explorer"
          description="Explore Cosmos ecosystem blockchains, including both mainnet and testnet networks."
          canonicalUrl="https://skuuy.com/explorer"
        />
        
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Cosmos Ecosystem Explorer</h1>
          <p className="text-muted-foreground text-center">Explore Cosmos ecosystem blockchains</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Tabs 
            defaultValue="mainnet" 
            className="w-full mb-8"
            value={networkType === 'mainnet' ? 'mainnet' : 'testnet'}
            onValueChange={(value) => setNetworkType(value as 'mainnet' | 'testnet')}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 rounded-lg p-1">
              <TabsTrigger 
                value="mainnet" 
                className="data-[state=active]:bg-gray-750 rounded-md py-3"
              >
                Mainnets <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-700/50">{networkType === 'mainnet' ? chains.length : 0}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="testnet" 
                className="data-[state=active]:bg-gray-750 rounded-md py-3"
              >
                Testnets <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-700/50">{networkType === 'testnet' ? chains.length : 0}</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Search bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Enter network"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-none rounded-lg h-12 text-white"
              />
            </div>
            
            <TabsContent value="mainnet" className="mt-6">
              {loading ? (
                <div className="flex justify-center p-4">
                  <p>Loading mainnet chains...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

interface ChainCardProps {
  chain: ChainConfig;
}

const ChainCard: React.FC<ChainCardProps> = ({ chain }) => {
  return (
    <Link to={`/explorer/${chain.chain_name}`}>
      <Card className="bg-gray-800/30 hover:bg-gray-750 transition-colors duration-200 border-none rounded-lg">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700/50 flex items-center justify-center">
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
            <div className="font-medium text-white">{chain.display_name}</div>
            <div className="text-xs text-gray-400">{chain.chain_id}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CosmosExplorer;
