
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';

interface AddNetworkCardProps {
  onClick: () => void;
}

const AddNetworkCard = ({ onClick }: AddNetworkCardProps) => {
  return (
    <Card
      className="p-3 flex flex-col items-center justify-center cursor-pointer border border-dashed border-border/50 hover:border-primary/50"
      onClick={onClick}
    >
      <div className="h-12 w-12 flex items-center justify-center mb-2">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium text-center">Add Network</span>
    </Card>
  );
};

export default AddNetworkCard;
