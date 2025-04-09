
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
            This implementation follows the OpenZeppelin ERC20 standard with a fixed supply of 21 million tokens.
            You'll be the owner with access to special functions like token recovery.
          </p>
          <div className="mt-3 pt-3 border-t border-border/30">
            <h5 className="font-medium">Contract Features:</h5>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
              <li>Total Supply: 21,000,000 tokens (with 18 decimals)</li>
              <li>Name: "SKUUY"</li>
              <li>Symbol: "SKUUY"</li>
              <li>Special functions: burn, recoverTokens, recoverETH</li>
              <li>Ownership control through Ownable pattern</li>
            </ul>
          </div>
        </div>
      )}
      {deployMode === 'nft' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">ERC721 NFT Contract</h4>
          <p className="text-muted-foreground">
            Deploy a non-fungible token (NFT) contract following the ERC721 standard.
            Allows for minting, transferring, and managing unique digital assets on the blockchain.
          </p>
          <div className="mt-3 pt-3 border-t border-border/30">
            <h5 className="font-medium">Contract Features:</h5>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
              <li>Name: "SKUUY NFT"</li>
              <li>Symbol: "SKUYNFT"</li>
              <li>Functions: mint, tokenURI, setBaseURI</li>
              <li>Ownership control with minting rights</li>
              <li>Metadata URI support for token content</li>
            </ul>
          </div>
        </div>
      )}
      {deployMode === 'auction' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">Auction Contract</h4>
          <p className="text-muted-foreground">
            Deploy an auction contract that allows users to bid on items with a time limit.
            Includes functions for placing bids, ending auctions, and claiming items after winning.
          </p>
          <div className="mt-3 pt-3 border-t border-border/30">
            <h5 className="font-medium">Contract Features:</h5>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
              <li>Time-based auction mechanism</li>
              <li>Minimum bid increment requirements</li>
              <li>Automatic refunds for outbid participants</li>
              <li>Owner controls auction start/end</li>
              <li>Secure escrow of auction funds</li>
            </ul>
          </div>
        </div>
      )}
      {deployMode === 'crowdfund' && (
        <div className="bg-muted/30 rounded-md p-4 border border-border/30">
          <h4 className="font-medium text-lg mb-2">Crowdfunding Contract</h4>
          <p className="text-muted-foreground">
            Create a crowdfunding campaign where contributors can pledge funds toward a goal.
            Includes functionality for campaign deadlines, fund collection, and refunds if goals aren't met.
          </p>
          <div className="mt-3 pt-3 border-t border-border/30">
            <h5 className="font-medium">Contract Features:</h5>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
              <li>Campaign funding goal</li>
              <li>Time-limited fundraising period</li>
              <li>Automatic fund release upon goal achievement</li>
              <li>Contributor refunds if goal not met</li>
              <li>Campaign status tracking</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetails;
