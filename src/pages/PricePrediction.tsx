
import { Helmet } from 'react-helmet-async';
import PricePredictionContainer from '@/components/price-prediction/PricePredictionContainer';
import { Card, CardContent } from '@/components/ui/card';

const PricePrediction = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 text-foreground">
      <Helmet>
        <title>Skuuy.com | Price Prediction</title>
        <meta name="description" content="AI-powered cryptocurrency price predictions and market analysis" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-primary">
            Price Prediction
          </h1>
          
          <Card className="mb-8 bg-card/40 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-center">
                  Get AI-powered price predictions for your favorite cryptocurrencies. 
                  Analyze market trends and make informed investment decisions.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="bg-primary/5 border-border h-full dark:bg-gray-900">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-semibold mb-6 text-primary">Why Use Our Predictions?</h3>
                  <ul className="space-y-6 flex-grow">
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">AI-Powered Analysis</span>
                        <p className="text-muted-foreground">Advanced algorithms analyze market data</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Real-time Data</span>
                        <p className="text-muted-foreground">Updated market information and trends</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Multiple Timeframes</span>
                        <p className="text-muted-foreground">Short-term and long-term predictions</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-primary font-bold">4</span>
                      </div>
                      <div>
                        <span className="font-medium text-lg block mb-1">Risk Assessment</span>
                        <p className="text-muted-foreground">Understand potential risks and rewards</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mt-8">
                    <h4 className="font-semibold mb-2">Disclaimer</h4>
                    <p className="text-sm text-muted-foreground">
                      Price predictions are for informational purposes only and should not be considered as financial advice. 
                      Always do your own research before making investment decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-8">
              <PricePredictionContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
