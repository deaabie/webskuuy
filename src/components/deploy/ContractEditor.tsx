
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CONTRACT_TEMPLATES } from "@/config/deploy-config";

interface ContractEditorProps {
  contractCode: string;
  setContractCode: (code: string) => void;
  contractMode: string;
  setContractMode: (mode: string) => void;
}

const ContractEditor: React.FC<ContractEditorProps> = ({
  contractCode,
  setContractCode,
  contractMode,
  setContractMode
}) => {
  const handleModeChange = (value: string) => {
    setContractMode(value);
    
    // Set default code based on template
    if (value === 'basic') {
      setContractCode(CONTRACT_TEMPLATES.basic.code);
    } else if (value === 'erc20') {
      setContractCode(CONTRACT_TEMPLATES.erc20.code);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contract-mode">Contract Type</Label>
        <RadioGroup 
          value={contractMode} 
          onValueChange={handleModeChange}
          className="flex mt-2 space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="basic" id="basic-mode" />
            <Label htmlFor="basic-mode" className="cursor-pointer">Basic Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="erc20" id="erc20-mode" />
            <Label htmlFor="erc20-mode" className="cursor-pointer">ERC20 Mode</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="contract-code">Smart Contract Code</Label>
        <Textarea
          id="contract-code"
          value={contractCode}
          onChange={(e) => setContractCode(e.target.value)}
          className="font-mono mt-2 h-64 bg-card"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Edit your smart contract code above. Make sure it compiles correctly before deploying.
        </p>
      </div>
    </div>
  );
};

export default ContractEditor;
