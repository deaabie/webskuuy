
import { Helmet } from 'react-helmet-async';
import DeployContainer from '@/components/deploy/DeployContainer';

const Deploy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Deploy Smart Contract | SKUUY</title>
        <meta name="description" content="Deploy your own smart contract on various blockchain networks" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Deploy Your Smart Contract
          </h1>
          
          <div className="prose dark:prose-invert">
            <p className="text-lg">
              Launch your blockchain ideas with just a few clicks. Our easy-to-use platform allows you to deploy 
              smart contracts on multiple networks without complex coding.
            </p>
            
            <div className="bg-card rounded-lg p-6 mt-6 border border-border">
              <h3 className="text-xl font-semibold mb-3">Why Deploy with Us?</h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Multi-network Support:</span> Deploy on both mainnet and testnet networks
                </li>
                <li>
                  <span className="font-medium">Simple Interface:</span> No coding experience required
                </li>
                <li>
                  <span className="font-medium">Secure Deployment:</span> Direct connection with your wallet
                </li>
                <li>
                  <span className="font-medium">ERC20 Templates:</span> Create token contracts with ease
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <DeployContainer />
        </div>
      </div>
    </div>
  );
};

export default Deploy;
