
import React from "react";

interface BalanceDisplayProps {
  mainnetBalance: string | null;
}

const BalanceDisplay = ({ mainnetBalance }: BalanceDisplayProps) => {
  if (mainnetBalance === null) return null;
  
  const isBalanceSufficient = parseFloat(mainnetBalance) >= 0.005;
  
  return (
    <div className={`text-sm mt-1 ${isBalanceSufficient ? 'text-green-600' : 'text-red-600'}`}>
      Mainnet balance: {mainnetBalance} ETH {isBalanceSufficient ? '✓' : '✗'}
    </div>
  );
};

export default BalanceDisplay;
