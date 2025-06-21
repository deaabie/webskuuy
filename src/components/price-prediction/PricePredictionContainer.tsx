
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CryptoSelector from './CryptoSelector';
import TimeframeSelector from './TimeframeSelector';
import PredictionDisplay from './PredictionDisplay';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const PricePredictionContainer = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock prediction data
    const mockPrediction = {
      currentPrice: Math.random() * 50000 + 30000,
      predictedPrice: Math.random() * 60000 + 25000,
      confidence: Math.random() * 30 + 70,
      trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
      timeframe: selectedTimeframe,
      crypto: selectedCrypto,
      factors: [
        'Market sentiment analysis',
        'Technical indicators',
        'Volume analysis',
        'Historical patterns'
      ]
    };
    
    setPrediction(mockPrediction);
    setIsLoading(false);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Price Prediction Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CryptoSelector 
            selectedCrypto={selectedCrypto}
            onCryptoChange={setSelectedCrypto}
          />
          <TimeframeSelector 
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        </div>
        
        <Button 
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Analyzing...' : 'Get Price Prediction'}
        </Button>
        
        {prediction && (
          <PredictionDisplay prediction={prediction} />
        )}
      </CardContent>
    </Card>
  );
};

export default PricePredictionContainer;
