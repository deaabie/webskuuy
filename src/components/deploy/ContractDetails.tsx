
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContractDetailsProps {
  deployMode: string;
  onTokenDetailsChange?: (name: string, symbol: string, supply: string) => void;
}

const ContractDetails = ({ deployMode, onTokenDetailsChange }: ContractDetailsProps) => {
  const [tokenName, setTokenName] = useState('MyToken');
  const [tokenSymbol, setTokenSymbol] = useState('MTK');
  const [tokenSupply, setTokenSupply] = useState('1000000');

  const handleTokenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(e.target.value);
    if (onTokenDetailsChange) {
      onTokenDetailsChange(e.target.value, tokenSymbol, tokenSupply);
    }
  };

  const handleTokenSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenSymbol(e.target.value);
    if (onTokenDetailsChange) {
      onTokenDetailsChange(tokenName, e.target.value, tokenSupply);
    }
  };

  const handleTokenSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenSupply(e.target.value);
    if (onTokenDetailsChange) {
      onTokenDetailsChange(tokenName, tokenSymbol, e.target.value);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-xl font-medium">Contract Details</h3>
      {deployMode === 'basic' ? (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">Counter Contract</h4>
          <p className="text-muted-foreground">
            This contract allows you to maintain a counter value that can be incremented and decremented.
            After deployment, you can call 'increment()' and 'decrement()' functions to update the counter.
          </p>
        </div>
      ) : deployMode === 'storage' ? (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">SimpleStorage Contract</h4>
          <p className="text-muted-foreground">
            This contract allows you to store and retrieve a simple numeric value on the blockchain.
            After deployment, you can call 'set(uint256)' to store a value and 'get()' to retrieve it.
          </p>
        </div>
      ) : deployMode === 'erc20' && (
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-md p-4 border border-border/30">
            <h4 className="font-medium text-lg mb-2">ERC20 Token Contract</h4>
            <p className="text-muted-foreground">
              This contract creates an ERC20 standard token with customizable name and symbol.
              It will mint the entire token supply to your wallet address during deployment.
              After deployment, your token will be transferable and can be used in DeFi applications.
            </p>
          </div>
          
          <div className="grid gap-4 p-4 border border-border/30 rounded-md">
            <div className="grid gap-2">
              <Label htmlFor="tokenName">Token Name</Label>
              <Input 
                id="tokenName" 
                placeholder="MyToken" 
                value={tokenName}
                onChange={handleTokenNameChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input 
                id="tokenSymbol" 
                placeholder="MTK" 
                value={tokenSymbol}
                onChange={handleTokenSymbolChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tokenSupply">Initial Supply</Label>
              <Input 
                id="tokenSupply" 
                placeholder="1000000" 
                type="number"
                min="1"
                value={tokenSupply}
                onChange={handleTokenSupplyChange}
              />
              <p className="text-xs text-muted-foreground">This will be multiplied by 10^18 (standard ERC20 decimals)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetails;
