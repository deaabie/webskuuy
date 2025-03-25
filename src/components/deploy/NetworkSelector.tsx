
import { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPLOY_NETWORK_CONFIG } from '@/config/deploy-config';

interface NetworkSelectorProps {
  onNetworkChange: (network: string) => void;
}

const NetworkSelector = ({ onNetworkChange }: NetworkSelectorProps) => {
  const [customNetworks, setCustomNetworks] = useState<any[]>([]);

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

  const handleChange = (value: string) => {
    onNetworkChange(value);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Network" />
      </SelectTrigger>
      <SelectContent>
        {/* Replace the problematic disabled item with a label or separator */}
        <SelectItem value="select_placeholder" disabled className="font-bold">
          Select Network
        </SelectItem>
        
        {/* Testnets from config */}
        <SelectItem value="testnet_header" disabled className="font-bold bg-muted">
          Testnets
        </SelectItem>
        
        {Object.entries(DEPLOY_NETWORK_CONFIG).map(([key, network]) => (
          <SelectItem key={key} value={key} className="pl-6">
            {network.name}
          </SelectItem>
        ))}
        
        {/* Custom networks */}
        {customNetworks.length > 0 && (
          <>
            <SelectItem value="custom_header" disabled className="font-bold bg-muted mt-2">
              Custom Networks
            </SelectItem>
            
            {customNetworks.map((network, index) => (
              <SelectItem key={`custom-${index}`} value={network.id} className="pl-6">
                {network.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default NetworkSelector;
