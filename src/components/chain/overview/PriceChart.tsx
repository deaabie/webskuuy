
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChainConfig } from '@/services/cosmosService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from '@/components/ui/use-toast';

const TIME_PERIODS = [
  { label: '24h', value: '1', days: 1 },
  { label: '7d', value: '7', days: 7 },
  { label: '30d', value: '30', days: 30 },
  { label: '90d', value: '90', days: 90 },
  { label: '1y', value: '365', days: 365 },
];

interface PriceChartProps {
  chain: ChainConfig;
}

interface PriceData {
  date: string;
  price: number;
  timestamp: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ chain }) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState('7');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  // Find the first asset with a coingecko_id
  const assetWithCoingeckoId = chain.assets?.find(asset => asset.coingecko_id && asset.coingecko_id.trim() !== '');
  const coingeckoId = assetWithCoingeckoId?.coingecko_id || '';
  const assetSymbol = assetWithCoingeckoId?.symbol || '';

  useEffect(() => {
    const fetchPriceData = async () => {
      if (!coingeckoId) {
        setError("No CoinGecko ID found for this asset");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const days = TIME_PERIODS.find(period => period.value === timePeriod)?.days || 7;
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: days,
              interval: days > 30 ? 'daily' : undefined
            }
          }
        );

        if (response.data && response.data.prices) {
          const formattedData = response.data.prices.map((item: [number, number]) => {
            const date = new Date(item[0]);
            return {
              timestamp: item[0],
              date: date.toLocaleDateString(),
              price: item[1]
            };
          });

          setPriceData(formattedData);

          // Set current price from the last data point
          if (formattedData.length > 0) {
            const lastPrice = formattedData[formattedData.length - 1].price;
            setCurrentPrice(lastPrice);

            // Calculate price change percentage
            const firstPrice = formattedData[0].price;
            const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
            setPriceChange(changePercent);
          }
        }
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError("Failed to fetch price data. CoinGecko API may be rate limited.");
        toast({
          title: "Error fetching price data",
          description: "Could not retrieve price data from CoinGecko. This could be due to API rate limiting.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [coingeckoId, timePeriod]);

  if (!coingeckoId) {
    return null; // Don't render anything if there's no CoinGecko ID
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            {assetSymbol} Price Chart
          </CardTitle>
          <CardDescription>
            {currentPrice !== null ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${currentPrice.toFixed(2)}</span>
                {priceChange !== null && (
                  <span className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                )}
              </div>
            ) : 'Loading price data...'}
          </CardDescription>
        </div>
        <Select
          value={timePeriod}
          onValueChange={setTimePeriod}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {TIME_PERIODS.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[400px] text-muted-foreground">
            {error}
          </div>
        ) : priceData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ChartContainer 
              className="h-full w-full"
              config={{
                price: {
                  label: "Price",
                  theme: {
                    light: "#1E40AF",  // blue-700
                    dark: "#3B82F6",   // blue-500
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={priceData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      // For periods larger than 30 days, format as month
                      if (parseInt(timePeriod) > 30) {
                        const date = new Date(value);
                        return date.toLocaleDateString(undefined, { month: 'short' });
                      }
                      return value;
                    }}
                    minTickGap={30}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                    domain={['auto', 'auto']}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(label, payload) => {
                          if (payload && payload.length > 0) {
                            const data = payload[0].payload;
                            return new Date(data.timestamp).toLocaleString();
                          }
                          return label;
                        }}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="price"
                    stroke="var(--color-price)"
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[400px] text-muted-foreground">
            No price data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
