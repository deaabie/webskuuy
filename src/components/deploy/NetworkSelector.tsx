
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface NetworkSelectorProps {
  onNetworkChange: (networkId: string) => void;
}

// Network data structure
interface NetworkConfig {
  id: string;
  name: string;
  imageUrl?: string;
  logo?: string;
  type: 'mainnet' | 'testnet';
  rpcUrl?: string;
  blockExplorer?: string;
}

// Default networks with GitHub image URLs
const defaultNetworks: NetworkConfig[] = [
  { id: 'ethereum', name: 'Ethereum', imageUrl: 'https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/ethereum-logo-wireframe.png', type: 'mainnet' },
  { id: 'polygon', name: 'Polygon', imageUrl: 'https://raw.githubusercontent.com/maticnetwork/matic-docs/master/static/img/polygon-logo.png', type: 'mainnet' },
  { id: 'bsc', name: 'BNB Chain', imageUrl: 'https://raw.githubusercontent.com/bnb-chain/bnb-chain-brand-assets/master/BNB%20Chain/SVG/BNB%20Chain%20Full%20Logo.svg', type: 'mainnet' },
  { id: 'optimism', name: 'Optimism', imageUrl: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Profile-Logo.svg', type: 'mainnet' },
  { id: 'arbitrum', name: 'Arbitrum', imageUrl: 'https://raw.githubusercontent.com/OffchainLabs/arbitrum-brand-kit/main/arbitrum-logo/SVG/Arbitrum_Logo_Full.svg', type: 'mainnet' },
  { id: 'avalanche', name: 'Avalanche', imageUrl: 'https://raw.githubusercontent.com/ava-labs/avalanche-brand-kit/main/ecosystem/avalanche-horizontal-red.svg', type: 'mainnet' },
  { id: 'base', name: 'Base', imageUrl: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/logo-blue.svg', type: 'mainnet' },
  // Testnets
  { id: 'sepolia', name: 'ETH Sepolia', imageUrl: 'https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/ethereum-logo-wireframe.png', type: 'testnet' },
  { id: 'arbitrum-sepolia', name: 'Arbitrum Sepolia', imageUrl: 'https://raw.githubusercontent.com/OffchainLabs/arbitrum-brand-kit/main/arbitrum-logo/SVG/Arbitrum_Logo_Full.svg', type: 'testnet' },
  { id: 'optimism-sepolia', name: 'Optimism Sepolia', imageUrl: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Profile-Logo.svg', type: 'testnet' },
  { id: 'base-sepolia', name: 'Base Sepolia', imageUrl: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/logo-blue.svg', type: 'testnet' },
  { id: 'blast-sepolia', name: 'Blast Sepolia', imageUrl: 'https://raw.githubusercontent.com/blast-io/brand-kit/main/logos/blast.svg', type: 'testnet' },
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
  const [newNetworkImage, setNewNetworkImage] = useState('');
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
      imageUrl: newNetworkImage || undefined,
      logo: newNetworkImage ? '' : '🔌',
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
    setNewNetworkImage('');
    setAddingNetwork(false);
  };

  const filteredDefaultNetworks = defaultNetworks.filter(network => network.type === networkType);
  const filteredCustomNetworks = customNetworks.filter(network => network.type === networkType);

  // Render network card with image or emoji
  const renderNetworkCard = (network: NetworkConfig) => {
    return (
      <button
        key={network.id}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
          selectedNetwork === network.id
            ? 'border-2 border-primary bg-primary/10'
            : 'border border-gray-700 hover:border-gray-500'
        }`}
        onClick={() => handleNetworkChange(network.id)}
      >
        {network.imageUrl ? (
          <div className="w-10 h-10 mb-1 flex items-center justify-center overflow-hidden">
            <img 
              src={network.imageUrl} 
              alt={network.name} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // If image fails to load, show an icon instead
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.textContent = '🔗';
                  fallback.className = 'text-2xl';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        ) : (
          <span className="text-2xl mb-1">{network.logo || '🔗'}</span>
        )}
        <span className="text-xs font-medium truncate max-w-full">
          {network.name}
        </span>
      </button>
    );
  };

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
            {filteredDefaultNetworks.map(renderNetworkCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-2 space-y-4">
          {filteredCustomNetworks.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {filteredCustomNetworks.map(renderNetworkCard)}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No custom {networkType} networks added yet
            </div>
          )}
          
          {addingNetwork ? (
            <Card className="space-y-2 border border-border p-3 rounded-md">
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
                <div className="flex relative">
                  <Input 
                    placeholder="Image URL (GitHub, optional)"
                    value={newNetworkImage}
                    onChange={(e) => setNewNetworkImage(e.target.value)}
                  />
                  <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                </div>
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
            </Card>
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
