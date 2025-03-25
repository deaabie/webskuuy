
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
            <SelectItem key={net.id} value={net.id} className="flex items-center py-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={net.imageUrl || "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png"} 
                    alt={net.name} 
                  />
                  <AvatarFallback className="text-xs">
                    {net.symbol.substring(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <span>{net.name} ({net.symbol})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkSelector;
