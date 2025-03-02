
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkConfig } from "./types";

interface NetworkSelectorProps {
  network: string;
  setNetwork: (network: string) => void;
  networks: NetworkConfig[];
}

const NetworkSelector = ({ network, setNetwork, networks }: NetworkSelectorProps) => {
  return (
    <div>
      <Label htmlFor="network">Select Network</Label>
      <Select 
        value={network} 
        onValueChange={setNetwork}
      >
        <SelectTrigger id="network" className="mt-1">
          <SelectValue placeholder="Select a network" />
        </SelectTrigger>
        <SelectContent>
          {networks.map((net) => (
            <SelectItem key={net.id} value={net.id}>
              {net.name} ({net.symbol})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkSelector;
