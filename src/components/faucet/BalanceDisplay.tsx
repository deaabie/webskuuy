
import React from "react";
import { Check, X } from "lucide-react";

interface BalanceDisplayProps {
  mainnetBalance: string | null;
}

const BalanceDisplay = ({ mainnetBalance }: BalanceDisplayProps) => {
  if (mainnetBalance === null) return null;
  
  const isBalanceSufficient = parseFloat(mainnetBalance) >= 0.005;
  
  return (
    <div className={`text-sm mt-1 flex items-center gap-1 ${isBalanceSufficient ? 'text-green-600' : 'text-red-600'}`}>
      <span>Mainnet balance: {mainnetBalance} ETH</span>
      {isBalanceSufficient ? 
        <Check className="h-4 w-4" /> : 
        <X className="h-4 w-4" />
      }
    </div>
  );
};

export default BalanceDisplay;
