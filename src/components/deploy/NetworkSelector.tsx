
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface NetworkSelectorProps {
  onNetworkChange: (networkId: string) => void;
}

// Network data structure
interface NetworkConfig {
  id: string;
  name: string;
  logo: string;
  type: 'mainnet' | 'testnet';
  rpcUrl?: string;
  blockExplorer?: string;
}

// Default networks
const defaultNetworks: NetworkConfig[] = [
  { id: 'ethereum', name: 'Ethereum', logo: '🌐', type: 'mainnet' },
  { id: 'polygon', name: 'Polygon', logo: '🟣', type: 'mainnet' },
  { id: 'bsc', name: 'BNB Chain', logo: '🟡', type: 'mainnet' },
  { id: 'optimism', name: 'Optimism', logo: '🔴', type: 'mainnet' },
  { id: 'arbitrum', name: 'Arbitrum', logo: '🔵', type: 'mainnet' },
  { id: 'avalanche', name: 'Avalanche', logo: '❄️', type: 'mainnet' },
  { id: 'base', name: 'Base', logo: '🔷', type: 'mainnet' },
  // Testnets
  { id: 'sepolia', name: 'ETH Sepolia', logo: '⚙️', type: 'testnet' },
  { id: 'arbitrum-sepolia', name: 'Arbitrum Sepolia', logo: '🔹', type: 'testnet' },
  { id: 'optimism-sepolia', name: 'Optimism Sepolia', logo: '🔺', type: 'testnet' },
  { id: 'base-sepolia', name: 'Base Sepolia', logo: '🟦', type: 'testnet' },
  { id: 'blast-sepolia', name: 'Blast Sepolia', logo: '💥', type: 'testnet' },
];

// Custom networks tab (can be populated from GitHub)
const NetworkSelector = ({ onNetworkChange }: NetworkSelectorProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet'>('testnet');
  const [customNetworks, setCustomNetworks] = useState<NetworkConfig[]>([]);
  const [isCustomTab, setIsCustomTab] = useState(false);
  const [newNetworkId, setNewNetworkId] = useState('');
  const [newNetworkName, setNewNetworkName] = useState('');
  const [newNetworkRPC, setNewNetworkRPC] = useState('');
  const [addingNetwork, setAddingNetwork] = useState(false);
  
  // Load custom networks from localStorage on mount
  useEffect(() => {
    const savedNetworks = localStorage.getItem('customNetworks');
    if (savedNetworks) {
      try {
        const parsedNetworks = JSON.parse(savedNetworks);
        setCustomNetworks(parsedNetworks);
      } catch (e) {
        console.error('Failed to parse custom networks', e);
      }
    }
  }, []);

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    onNetworkChange(value);
  };

  const handleAddCustomNetwork = () => {
    if (!newNetworkId || !newNetworkName || !newNetworkRPC) return;
    
    const newNetwork: NetworkConfig = {
      id: newNetworkId,
      name: newNetworkName,
      logo: '🔌',
      type: networkType,
      rpcUrl: newNetworkRPC
    };
    
    const updatedNetworks = [...customNetworks, newNetwork];
    setCustomNetworks(updatedNetworks);
    
    // Save to localStorage
    localStorage.setItem('customNetworks', JSON.stringify(updatedNetworks));
    
    // Reset form
    setNewNetworkId('');
    setNewNetworkName('');
    setNewNetworkRPC('');
    setAddingNetwork(false);
  };

  const filteredDefaultNetworks = defaultNetworks.filter(network => network.type === networkType);
  const filteredCustomNetworks = customNetworks.filter(network => network.type === networkType);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="default" onValueChange={(value) => setIsCustomTab(value === 'custom')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Default Networks</TabsTrigger>
          <TabsTrigger value="custom">Custom Networks</TabsTrigger>
        </TabsList>
        
        <div className="mt-2">
          <Tabs defaultValue="testnet" onValueChange={(value) => setNetworkType(value as 'mainnet' | 'testnet')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
              <TabsTrigger value="testnet">Testnet</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="default" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {filteredDefaultNetworks.map((network) => (
              <button
                key={network.id}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  selectedNetwork === network.id
                    ? 'border-2 border-primary bg-primary/10'
                    : 'border border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleNetworkChange(network.id)}
              >
                <span className="text-2xl mb-1">{network.logo}</span>
                <span className="text-xs font-medium truncate max-w-full">
                  {network.name}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-2 space-y-4">
          {filteredCustomNetworks.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {filteredCustomNetworks.map((network) => (
                <button
                  key={network.id}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                    selectedNetwork === network.id
                      ? 'border-2 border-primary bg-primary/10'
                      : 'border border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => handleNetworkChange(network.id)}
                >
                  <span className="text-2xl mb-1">{network.logo}</span>
                  <span className="text-xs font-medium truncate max-w-full">
                    {network.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No custom {networkType} networks added yet
            </div>
          )}
          
          {addingNetwork ? (
            <div className="space-y-2 border border-border p-3 rounded-md">
              <h4 className="font-medium">Add New Network</h4>
              <div className="space-y-2">
                <Input 
                  placeholder="Network ID (e.g., custom-testnet)"
                  value={newNetworkId}
                  onChange={(e) => setNewNetworkId(e.target.value)}
                />
                <Input 
                  placeholder="Network Name (e.g., My Custom Testnet)"
                  value={newNetworkName}
                  onChange={(e) => setNewNetworkName(e.target.value)}
                />
                <Input 
                  placeholder="RPC URL (e.g., https://rpc.example.com)"
                  value={newNetworkRPC}
                  onChange={(e) => setNewNetworkRPC(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    onClick={handleAddCustomNetwork}
                    disabled={!newNetworkId || !newNetworkName || !newNetworkRPC}
                  >
                    Add Network
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setAddingNetwork(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setAddingNetwork(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Custom Network
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkSelector;
