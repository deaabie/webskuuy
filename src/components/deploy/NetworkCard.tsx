
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkConfig } from "@/components/faucet/types";

interface NetworkCardProps {
  network: NetworkConfig;
  isSelected: boolean;
  onSelect: (networkId: string) => void;
}

const NetworkCard = ({ network, isSelected, onSelect }: NetworkCardProps) => {
  return (
    <Card
      key={network.id}
      className={`p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
        isSelected
          ? "border-2 border-primary bg-primary/5"
          : "border border-border/50 hover:border-primary/50"
      }`}
      onClick={() => onSelect(network.id)}
    >
      <div className="h-12 w-12 flex items-center justify-center mb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={network.imageUrl}
            alt={network.name}
          />
          <AvatarFallback>
            {network.symbol.substring(0, 3)}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-sm font-medium text-center">{network.name}</span>
    </Card>
  );
};

export default NetworkCard;
