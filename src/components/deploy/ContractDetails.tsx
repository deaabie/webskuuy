
interface ContractDetailsProps {
  deployMode: string;
}

const ContractDetails = ({ deployMode }: ContractDetailsProps) => {
  return (
    <div className="space-y-2 pt-2">
      <h3 className="text-xl font-medium">Contract Details</h3>
      {deployMode === 'basic' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">Counter Contract</h4>
          <p className="text-muted-foreground">
            This contract allows you to maintain a counter value that can be incremented and decremented.
            After deployment, you can call 'increment()' and 'decrement()' functions to update the counter.
          </p>
        </div>
      )}
      {deployMode === 'storage' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">SimpleStorage Contract</h4>
          <p className="text-muted-foreground">
            This contract allows you to store and retrieve a simple numeric value on the blockchain.
            After deployment, you can call 'set(uint256)' to store a value and 'get()' to retrieve it.
          </p>
        </div>
      )}
      {deployMode === 'token' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">ERC20 Token Contract</h4>
          <p className="text-muted-foreground">
            Create your own ERC20 token with standard functions like transfer, approve, and balanceOf.
            This token implements the standard ERC20 interface and can be used in any compatible ecosystem.
          </p>
        </div>
      )}
      {deployMode === 'nft' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">ERC721 NFT Contract</h4>
          <p className="text-muted-foreground">
            Deploy a non-fungible token (NFT) contract following the ERC721 standard.
            Allows for minting, transferring, and managing unique digital assets on the blockchain.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContractDetails;
