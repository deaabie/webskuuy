
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEPLOY_NETWORK_CONFIG } from '@/config/deploy-config';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    onNetworkChange(value);
  };

  return (
    <div className="space-y-4">
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
      
      <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Network" />
        </SelectTrigger>
        <SelectContent>
          {getNetworksByTab().map(([key, network]: [string, any]) => (
            <SelectItem key={key} value={key}>
              {network.name}
            </SelectItem>
          ))}
          
          {getNetworksByTab().length === 0 && (
            <SelectItem value="no_networks" disabled>
              {activeTab === "mainnet" ? "Mainnet networks coming soon" : "No networks available"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkSelector;
