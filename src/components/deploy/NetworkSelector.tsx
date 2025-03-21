
import React from 'react';
import { Label } from "@/components/ui/label";
import { NetworkConfig } from "./types";
import NetworkIcon from "./NetworkIcon";

interface NetworkSelectorProps {
  network: string;
  setNetwork: (network: string) => void;
  networks: NetworkConfig[];
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  network, 
  setNetwork, 
  networks 
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Network</Label>
      <div className="grid grid-cols-6 gap-3 mt-2">
        {networks.map((net) => (
          <div 
            key={net.id} 
            className="flex flex-col items-center"
            onClick={() => setNetwork(net.id)}
          >
            <NetworkIcon 
              network={net} 
              size={44} 
              selected={network === net.id}
              onClick={() => setNetwork(net.id)}
            />
            <span className="text-xs mt-1 text-center">
              {net.name.split(' ').pop()} {/* Just show the network name */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;
