
import React from "react";

const InfoNotice = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-sm">
      <p className="font-medium">Important Notice:</p>
      <p>You need at least 0.005 ETH on Ethereum mainnet to claim tokens. This helps prevent faucet abuse.</p>
    </div>
  );
};

export default InfoNotice;
