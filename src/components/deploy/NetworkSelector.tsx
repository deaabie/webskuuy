
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEPLOY_NETWORK_CONFIG } from '@/config/deploy-config';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface NetworkSelectorProps {
  onNetworkChange: (network: string) => void;
}

const NetworkSelector = ({ onNetworkChange }: NetworkSelectorProps) => {
  const [activeTab, setActiveTab] = useState<string>("testnet");
  const [customNetworks, setCustomNetworks] = useState<any[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");

  useEffect(() => {
    // Load custom networks from localStorage
    const customNetworksStr = localStorage.getItem('customNetworks');
    if (customNetworksStr) {
      try {
        const parsed = JSON.parse(customNetworksStr);
        setCustomNetworks(parsed);
      } catch (e) {
        console.error('Failed to parse custom networks', e);
        setCustomNetworks([]);
      }
    }
  }, []);

  // Filter networks based on active tab
  const getNetworksByTab = () => {
    switch (activeTab) {
      case "testnet":
        return Object.entries(DEPLOY_NETWORK_CONFIG);
      case "mainnet":
        // We currently don't have mainnet networks defined
        return [];
      case "custom":
        return customNetworks.map(network => [network.id, network]);
      default:
        return [];
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedNetwork(""); // Reset selected network when changing tabs
  };

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
    onNetworkChange(networkId);
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold mb-2">Select Network</div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-gray-900 text-white">
          <TabsTrigger 
            value="testnet" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Testnet
          </TabsTrigger>
          <TabsTrigger 
            value="mainnet"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Mainnet
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {getNetworksByTab().map(([key, network]: [string, any]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedNetwork === key ? 'border-2 border-primary ring-2 ring-primary/20' : 'border border-gray-200'
            }`}
            onClick={() => handleNetworkSelect(key)}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <div className="relative w-full h-28 mb-2 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {network.imageUrl ? (
                  <img 
                    src={network.imageUrl} 
                    alt={network.name} 
                    className="w-16 h-16 object-contain" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                    {network.symbol ? network.symbol.substring(0, 3) : 'ETH'}
                  </div>
                )}
                
                {selectedNetwork === key && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="font-medium text-center">{network.name}</div>
              <div className="text-sm text-gray-500 text-center">{network.symbol || 'ETH'}</div>
            </CardContent>
          </Card>
        ))}
        
        {getNetworksByTab().length === 0 && (
          <div className="col-span-3 py-8 text-center text-gray-500">
            {activeTab === "mainnet" ? (
              <div>Mainnet networks coming soon</div>
            ) : activeTab === "custom" ? (
              <div>No custom networks available</div>
            ) : (
              <div>No networks available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkSelector;
