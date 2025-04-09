
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ContractTypeSelectorProps {
  deployMode: string;
  setDeployMode: (mode: string) => void;
}

const ContractTypeSelector = ({ deployMode, setDeployMode }: ContractTypeSelectorProps) => {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-xl font-medium">Contract Type</h3>
      <RadioGroup 
        defaultValue="basic" 
        className="grid grid-cols-2 gap-4"
        onValueChange={setDeployMode}
        value={deployMode}
      >
        <div className="flex items-center space-x-2 border border-border/50 rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="basic" id="basic" />
          <Label htmlFor="basic" className="text-lg cursor-pointer">Counter Contract</Label>
        </div>
        <div className="flex items-center space-x-2 border border-border/50 rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="storage" id="storage" />
          <Label htmlFor="storage" className="text-lg cursor-pointer">SimpleStorage Contract</Label>
        </div>
        <div className="flex items-center space-x-2 border border-border/50 rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="token" id="token" />
          <Label htmlFor="token" className="text-lg cursor-pointer">ERC20 Token</Label>
        </div>
        <div className="flex items-center space-x-2 border border-border/50 rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="nft" id="nft" />
          <Label htmlFor="nft" className="text-lg cursor-pointer">ERC721 NFT</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ContractTypeSelector;
