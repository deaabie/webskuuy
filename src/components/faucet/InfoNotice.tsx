
import React from "react";
import { AlertTriangle } from "lucide-react";

const InfoNotice = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-sm flex gap-2">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
      <div>
        <p className="font-medium">Important Notice:</p>
        <p>You need at least 0.005 ETH on Ethereum mainnet to claim tokens. This helps prevent faucet abuse.</p>
      </div>
    </div>
  );
};

export default InfoNotice;
