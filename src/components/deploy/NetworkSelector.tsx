
import { useState } from 'react';
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
    </div>
  );
};

export default NetworkSelector;
