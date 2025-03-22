
import { Helmet } from 'react-helmet-async';
import DeployContainer from '@/components/deploy/DeployContainer';

const Deploy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Deploy Smart Contract | SKUUY</title>
        <meta name="description" content="Deploy your own smart contract on various blockchain networks" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            With just one step,<br/>
            <span className="text-3xl md:text-4xl">you can also become a developer</span>
          </h1>
          
          <img 
            src="/lovable-uploads/9bace322-b37a-43ae-bc83-3aad9231e5a0.png" 
            alt="Smart Contract Deployment" 
            className="w-full max-w-lg mx-auto md:mx-0"
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <DeployContainer />
        </div>
      </div>
    </div>
  );
};

export default Deploy;
