
import { NetworkConfig } from "@/components/faucet/types";
import NetworkCard from "./NetworkCard";
import AddNetworkCard from "./AddNetworkCard";

interface NetworkGridProps {
  networks: NetworkConfig[];
  selectedNetwork: string;
  onNetworkSelect: (networkId: string) => void;
  showAddNetwork?: boolean;
  onAddNetworkClick?: () => void;
  emptyMessage?: string;
}

const NetworkGrid = ({ 
  networks, 
  selectedNetwork, 
  onNetworkSelect,
  showAddNetwork = false,
  onAddNetworkClick,
  emptyMessage
}: NetworkGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {networks.map((network) => (
        <NetworkCard
          key={network.id}
          network={network}
          isSelected={selectedNetwork === network.id}
          onSelect={onNetworkSelect}
        />
      ))}
      
      {showAddNetwork && onAddNetworkClick && (
        <AddNetworkCard onClick={onAddNetworkClick} />
      )}
      
      {networks.length === 0 && emptyMessage && (
        <div className="col-span-3 text-center p-4 text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default NetworkGrid;
