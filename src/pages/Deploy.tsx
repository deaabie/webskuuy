
import { Helmet } from 'react-helmet-async';
import DeployContainer from '@/components/deploy/DeployContainer';
import { Card, CardContent } from '@/components/ui/card';

const Deploy = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 text-foreground">
      <Helmet>
        <title>Skuuy.com | Deploy Smart Contract</title>
        <meta name="description" content="Deploy your own smart contract on various blockchain networks" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-primary">
            Deploy Your Smart Contract
          </h1>
          
          <Card className="mb-8 bg-card/40 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-center">
                  Launch your blockchain ideas with just a few clicks. Our easy-to-use platform allows you to deploy 
                  smart contracts on multiple networks without complex coding.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="bg-primary/5 border-border h-full dark:bg-gray-900">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-semibold mb-6 text-primary">Why Deploy with Us?</h3>
                  <ul className="space-y-6 flex-grow">
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Multi-network Support</span>
                        <p className="text-muted-foreground">Deploy on both mainnet and testnet networks</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Simple Interface</span>
                        <p className="text-muted-foreground">No coding experience required</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Secure Deployment</span>
                        <p className="text-muted-foreground">Direct connection with your wallet</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">4</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Multiple Contract Types</span>
                        <p className="text-muted-foreground">Basic contracts and ERC20 tokens supported</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mt-8">
                    <h4 className="font-semibold mb-2">For Testing</h4>
                    <p className="text-sm text-muted-foreground">
                      Make sure to have some test ETH in your wallet when deploying on testnets.
                      You can get testnet ETH from our <a href="/faucet" className="text-primary hover:underline">Faucet</a> page.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-8">
              <DeployContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deploy;
