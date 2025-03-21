
import React, { useState, useEffect } from 'react';
import { useNetwork, useNetworkMismatch, useSwitchChain } from '@thirdweb-dev/react';
import { 
  Ethereum,
  Goerli,
  Polygon,
  Mumbai,
  Optimism,
  OptimismGoerli,
  Arbitrum,
  ArbitrumGoerli,
  Base,
  BaseGoerli
} from '@thirdweb-dev/chains';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Plus } from 'lucide-react';
import NetworkIcon from './NetworkIcon';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

// Default networks
const defaultNetworks = [
  { 
    ...Ethereum, 
    mainnet: Ethereum, 
    testnet: Goerli,
    icon: "ethereum"
  },
  { 
    ...Polygon, 
    mainnet: Polygon, 
    testnet: Mumbai,
    icon: "polygon"
  },
  { 
    ...Optimism, 
    mainnet: Optimism, 
    testnet: OptimismGoerli,
    icon: "optimism"
  },
  { 
    ...Arbitrum, 
    mainnet: Arbitrum, 
    testnet: ArbitrumGoerli,
    icon: "arbitrum"
  },
  { 
    ...Base, 
    mainnet: Base, 
    testnet: BaseGoerli,
    icon: "base"
  },
];

// Custom network type
interface CustomNetwork {
  chainId: number;
  name: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer?: {
    name: string;
    url: string;
  };
  testnet: boolean;
  icon: string;
}

const NetworkSelector = () => {
  const [, switchNetwork] = useNetwork();
  const switchChain = useSwitchChain();
  const isMismatched = useNetworkMismatch();
  const [networks, setNetworks] = useState(defaultNetworks);
  const [customNetworks, setCustomNetworks] = useState<CustomNetwork[]>([]);
  const [activeTab, setActiveTab] = useState('default');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNetwork, setNewNetwork] = useState<Partial<CustomNetwork>>({
    name: '',
    chainId: 0,
    rpcUrls: [''],
    nativeCurrency: {
      name: '',
      symbol: '',
      decimals: 18
    },
    testnet: false,
    icon: 'default'
  });

  // Load custom networks from JSON data in the repository
  useEffect(() => {
    const loadCustomNetworks = async () => {
      try {
        // Load mainnet networks
        const cosmosResponse = await fetch('/src/data/chains/mainnet/cosmos.json');
        
        // Load testnet networks
        const titanResponse = await fetch('/src/data/chains/testnet/titan.json');
        const galacticaResponse = await fetch('/src/data/chains/testnet/galactica.json');
        const alloraResponse = await fetch('/src/data/chains/testnet/allora.json');
        
        if (cosmosResponse.ok && titanResponse.ok && galacticaResponse.ok && alloraResponse.ok) {
          const cosmosData = await cosmosResponse.json();
          const titanData = await titanResponse.json();
          const galacticaData = await galacticaResponse.json();
          const alloraData = await alloraResponse.json();
          
          // Transform the data to match our custom network format
          const customNetworks: CustomNetwork[] = [
            {
              chainId: Number(cosmosData.coin_type) || 118,
              name: cosmosData.display_name,
              rpcUrls: cosmosData.rpc.map((rpc: any) => rpc.address),
              nativeCurrency: {
                name: cosmosData.assets[0]?.symbol || 'ATOM',
                symbol: cosmosData.assets[0]?.symbol || 'ATOM',
                decimals: Number(cosmosData.assets[0]?.exponent) || 6
              },
              blockExplorer: cosmosData.api[0] ? { 
                name: cosmosData.api[0].provider, 
                url: cosmosData.api[0].address 
              } : undefined,
              testnet: false,
              icon: 'default'
            },
            {
              chainId: Number(titanData.coin_type) || 118,
              name: titanData.display_name,
              rpcUrls: titanData.rpc.map((rpc: any) => rpc.address),
              nativeCurrency: {
                name: titanData.assets[0]?.symbol || 'TTNT',
                symbol: titanData.assets[0]?.symbol || 'TTNT',
                decimals: Number(titanData.assets[0]?.exponent) || 6
              },
              blockExplorer: titanData.api[0] ? { 
                name: titanData.api[0].provider, 
                url: titanData.api[0].address 
              } : undefined,
              testnet: true,
              icon: 'default'
            },
            {
              chainId: Number(galacticaData.coin_type) || 60,
              name: galacticaData.display_name,
              rpcUrls: galacticaData.rpc.map((rpc: any) => rpc.address),
              nativeCurrency: {
                name: galacticaData.assets[0]?.symbol || 'GNET',
                symbol: galacticaData.assets[0]?.symbol || 'GNET',
                decimals: Number(galacticaData.assets[0]?.exponent) || 18
              },
              blockExplorer: galacticaData.api[0] ? { 
                name: galacticaData.api[0].provider, 
                url: galacticaData.api[0].address 
              } : undefined,
              testnet: true,
              icon: 'default'
            },
            {
              chainId: Number(alloraData.coin_type) || 118,
              name: alloraData.display_name,
              rpcUrls: alloraData.rpc.map((rpc: any) => rpc.address),
              nativeCurrency: {
                name: alloraData.assets[0]?.symbol || 'ALLO',
                symbol: alloraData.assets[0]?.symbol || 'ALLO',
                decimals: Number(alloraData.assets[0]?.exponent) || 18
              },
              blockExplorer: alloraData.api[0] ? { 
                name: alloraData.api[0].provider, 
                url: alloraData.api[0].address 
              } : undefined,
              testnet: true,
              icon: 'default'
            }
          ];
          
          setCustomNetworks(customNetworks);
        }
      } catch (error) {
        console.error("Failed to load custom networks:", error);
      }
    };
    
    loadCustomNetworks();
  }, []);

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchChain(chainId);
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };
  
  const handleAddNetwork = () => {
    if (newNetwork.name && newNetwork.chainId && newNetwork.rpcUrls && newNetwork.rpcUrls.length > 0) {
      // Create full network object
      const network = {
        ...newNetwork,
        chainId: Number(newNetwork.chainId),
        nativeCurrency: {
          name: newNetwork.nativeCurrency?.name || 'Ether',
          symbol: newNetwork.nativeCurrency?.symbol || 'ETH',
          decimals: newNetwork.nativeCurrency?.decimals || 18
        },
        testnet: Boolean(newNetwork.testnet),
        icon: newNetwork.icon || 'default'
      } as CustomNetwork;
      
      setCustomNetworks([...customNetworks, network]);
      setShowAddForm(false);
      setNewNetwork({
        name: '',
        chainId: 0,
        rpcUrls: [''],
        nativeCurrency: {
          name: '',
          symbol: '',
          decimals: 18
        },
        testnet: false,
        icon: 'default'
      });
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Select Network</h3>
      
      {isMismatched && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your wallet is connected to a different network than the one selected.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Default Networks</TabsTrigger>
          <TabsTrigger value="custom">Custom Networks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="default" className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {networks.map((network) => (
              <div key={network.chainId} className="flex flex-col space-y-2">
                <Card 
                  className="cursor-pointer hover:bg-accent transition-colors p-1"
                  onClick={() => handleNetworkSwitch(network.chainId)}
                >
                  <CardContent className="flex flex-col items-center p-3">
                    <NetworkIcon network={network.icon} className="w-10 h-10 mb-2" />
                    <span className="text-sm font-medium">{network.name}</span>
                  </CardContent>
                </Card>
                <div className="flex justify-center gap-2 text-xs">
                  <span 
                    className="cursor-pointer text-primary hover:underline" 
                    onClick={() => handleNetworkSwitch(network.mainnet.chainId)}
                  >
                    Mainnet
                  </span>
                  <span 
                    className="cursor-pointer text-primary hover:underline" 
                    onClick={() => handleNetworkSwitch(network.testnet.chainId)}
                  >
                    Testnet
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Custom Networks from GitHub</h4>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4" />
              Add Network
            </Button>
          </div>
          
          {showAddForm && (
            <div className="bg-card border rounded-md p-4 mb-4">
              <h5 className="font-medium mb-3">Add Custom Network</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="network-name">Network Name</Label>
                  <Input 
                    id="network-name" 
                    value={newNetwork.name || ''} 
                    onChange={(e) => setNewNetwork({...newNetwork, name: e.target.value})}
                    placeholder="e.g. My Custom Network"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chain-id">Chain ID</Label>
                  <Input 
                    id="chain-id" 
                    type="number" 
                    value={newNetwork.chainId || ''} 
                    onChange={(e) => setNewNetwork({...newNetwork, chainId: parseInt(e.target.value)})}
                    placeholder="e.g. 1337"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpc-url">RPC URL</Label>
                  <Input 
                    id="rpc-url" 
                    value={newNetwork.rpcUrls ? newNetwork.rpcUrls[0] : ''} 
                    onChange={(e) => setNewNetwork({...newNetwork, rpcUrls: [e.target.value]})}
                    placeholder="e.g. https://my-network-rpc.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency-symbol">Currency Symbol</Label>
                  <Input 
                    id="currency-symbol" 
                    value={newNetwork.nativeCurrency?.symbol || ''} 
                    onChange={(e) => setNewNetwork({
                      ...newNetwork, 
                      nativeCurrency: {...newNetwork.nativeCurrency, symbol: e.target.value, name: e.target.value}
                    })}
                    placeholder="e.g. ETH"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="testnet"
                    checked={newNetwork.testnet || false}
                    onChange={(e) => setNewNetwork({...newNetwork, testnet: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="testnet">This is a testnet</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAddNetwork}>Add Network</Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {customNetworks.map((network, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <NetworkIcon network={network.icon} className="w-10 h-10 mb-2" />
                    <h4 className="font-medium text-sm">{network.name}</h4>
                    <p className="text-xs text-muted-foreground">{network.testnet ? "Testnet" : "Mainnet"}</p>
                    <p className="text-xs mt-1">
                      <span className="bg-muted px-1.5 py-0.5 rounded">{network.nativeCurrency.symbol}</span>
                    </p>
                    <Button 
                      className="mt-3 w-full" 
                      size="sm"
                      variant="secondary"
                      onClick={() => handleNetworkSwitch(network.chainId)}
                    >
                      Select Network
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {customNetworks.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p>No custom networks loaded. Add a network or push network config to GitHub.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkSelector;

