
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NetworkSelectorProps {
  onNetworkChange: (networkId: string) => void;
}

// Network data structure
interface NetworkConfig {
  id: string;
  name: string;
  logo: string;
  type: 'mainnet' | 'testnet';
}

const networks: NetworkConfig[] = [
  { id: 'ethereum', name: 'Ethereum', logo: '🌐', type: 'mainnet' },
  { id: 'goerli', name: 'Goerli', logo: '⚙️', type: 'testnet' },
  { id: 'polygon', name: 'Polygon', logo: '🟣', type: 'mainnet' },
  { id: 'mumbai', name: 'Mumbai', logo: '🟪', type: 'testnet' },
  { id: 'bsc', name: 'BNB Chain', logo: '🟡', type: 'mainnet' },
  { id: 'bsc-testnet', name: 'BNB Testnet', logo: '🟨', type: 'testnet' },
  { id: 'optimism', name: 'Optimism', logo: '🔴', type: 'mainnet' },
  { id: 'optimism-goerli', name: 'Optimism Goerli', logo: '🔺', type: 'testnet' },
  { id: 'arbitrum', name: 'Arbitrum', logo: '🔵', type: 'mainnet' },
  { id: 'arbitrum-goerli', name: 'Arbitrum Goerli', logo: '🔹', type: 'testnet' },
  { id: 'avalanche', name: 'Avalanche', logo: '❄️', type: 'mainnet' },
  { id: 'fuji', name: 'Fuji', logo: '❄', type: 'testnet' },
  { id: 'base', name: 'Base', logo: '🔷', type: 'mainnet' },
  { id: 'base-goerli', name: 'Base Goerli', logo: '🟦', type: 'testnet' },
];

const NetworkSelector = ({ onNetworkChange }: NetworkSelectorProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet'>('mainnet');
  
  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    onNetworkChange(value);
  };

  const filteredNetworks = networks.filter(network => network.type === networkType);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="mainnet" onValueChange={(value) => setNetworkType(value as 'mainnet' | 'testnet')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
          <TabsTrigger value="testnet">Testnet</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
        {filteredNetworks.map((network) => (
          <button
            key={network.id}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              selectedNetwork === network.id
                ? 'border-2 border-yellow-400 bg-yellow-400/10'
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
    </div>
  );
};

export default NetworkSelector;
