
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface PredictionData {
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: string;
  timeframe: string;
  crypto: string;
  factors: string[];
}

interface PredictionDisplayProps {
  prediction: PredictionData;
}

const PredictionDisplay = ({ prediction }: PredictionDisplayProps) => {
  const priceChange = prediction.predictedPrice - prediction.currentPrice;
  const percentageChange = (priceChange / prediction.currentPrice) * 100;
  const isBullish = prediction.trend === 'bullish';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Price Prediction Results</span>
            <Badge variant={isBullish ? "default" : "destructive"} className="flex items-center gap-1">
              {isBullish ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {prediction.trend.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="text-2xl font-bold">{formatPrice(prediction.currentPrice)}</p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(prediction.predictedPrice)}</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Price Change</p>
              <p className={`text-2xl font-bold ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Confidence Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getConfidenceColor(prediction.confidence)} transition-all duration-500`}
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
              <span className="font-bold">{prediction.confidence.toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold mb-2">Analysis Factors</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {prediction.factors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionDisplay;
