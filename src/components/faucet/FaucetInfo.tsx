
const FaucetInfo = () => {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-5 border shadow-sm">
        <h3 className="font-medium mb-2">About Testnet Tokens</h3>
        <p className="text-sm text-muted-foreground">
          These tokens have no real value and are only for testing smart contracts and applications on test networks.
        </p>
      </div>
      
      <div className="bg-card rounded-lg p-5 border shadow-sm">
        <h3 className="font-medium mb-2">Request Limits</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• One request per network every 24 hours</li>
          <li>• 0.001 tokens per request</li>
          <li>• Please use responsibly</li>
        </ul>
      </div>
      
      <div className="bg-card rounded-lg p-5 border shadow-sm">
        <h3 className="font-medium mb-2">Need More Tokens?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          For larger amounts, please consider using official network faucets:
        </p>
        <ul className="text-sm text-primary space-y-1">
          <li>• <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Sepolia Faucet</a></li>
          <li>• <a href="https://mumbaifaucet.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Mumbai Faucet</a></li>
          <li>• <a href="https://faucet.paradigm.xyz/" target="_blank" rel="noopener noreferrer" className="hover:underline">Paradigm Faucet</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FaucetInfo;
