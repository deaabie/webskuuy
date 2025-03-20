
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Coins, TrendingUp, Database, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';

interface TokenomicsProps {
  apiUrl: string | undefined;
  formatNumber: (num: number | string) => string;
  addrPrefix: string;
}

interface TokenMetric {
  name: string;
  value: number;
  color: string;
}

interface TokenInfoItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const Tokenomics: React.FC<TokenomicsProps> = ({ 
  apiUrl, 
  formatNumber,
  addrPrefix
}) => {
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetric[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const fetchTokenomicsData = async (forceRefresh = false) => {
    if (!apiUrl) {
      setLoading(false);
      setError("API URL not available");
      return;
    }
    
    if (dataFetchedRef.current && !forceRefresh) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get token denom
      let denom = 'stake';
      let denomDisplay = 'STAKE';
      try {
        const supplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply`);
        if (supplyResponse.data?.supply?.[0]?.denom) {
          denom = supplyResponse.data.supply[0].denom;
          // Format denom for display
          denomDisplay = denom.startsWith('u') ? denom.substring(1).toUpperCase() : denom.toUpperCase();
        }
      } catch (error) {
        console.log("Error fetching supply, using default denom:", error);
      }
      
      // Get total supply
      let totalSupply = "0";
      try {
        const totalSupplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply/${denom}`);
        totalSupply = totalSupplyResponse.data?.amount?.amount || "0";
      } catch (error) {
        console.log("Error fetching total supply:", error);
        
        // Fallback to the supply endpoint
        try {
          const supplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply`);
          const supply = supplyResponse.data?.supply?.find((s: any) => s.denom === denom);
          if (supply) {
            totalSupply = supply.amount;
          }
        } catch (fallbackError) {
          console.log("Error fetching supply fallback:", fallbackError);
        }
      }
      
      // Get staked tokens
      let stakedTokens = "0";
      try {
        const stakingResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/pool`);
        stakedTokens = stakingResponse.data?.pool?.bonded_tokens || "0";
      } catch (error) {
        console.log("Error fetching staking pool:", error);
      }
      
      // Get community pool
      let communityPool = "0";
      try {
        const communityPoolResponse = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/community_pool`);
        const poolItem = communityPoolResponse.data?.pool?.find((item: any) => item.denom === denom);
        communityPool = poolItem ? poolItem.amount : "0";
      } catch (error) {
        console.log("Error fetching community pool:", error);
      }
      
      // Get inflation rate
      let inflation = "0";
      try {
        const inflationResponse = await axios.get(`${apiUrl}/cosmos/mint/v1beta1/inflation`);
        inflation = inflationResponse.data?.inflation || "0";
        // Convert to percentage
        inflation = (parseFloat(inflation) * 100).toFixed(2);
      } catch (error) {
        console.log("Error fetching inflation:", error);
      }
      
      // Calculate circulating supply (approximate)
      const totalSupplyNum = parseFloat(totalSupply);
      const stakedTokensNum = parseFloat(stakedTokens);
      const communityPoolNum = parseFloat(communityPool);
      
      const circulatingSupply = Math.max(0, totalSupplyNum - stakedTokensNum - communityPoolNum);
      
      // Prepare pie chart data
      const metricsData: TokenMetric[] = [
        { name: 'Staked', value: stakedTokensNum, color: COLORS[0] },
        { name: 'Community Pool', value: communityPoolNum, color: COLORS[1] },
        { name: 'Circulating', value: circulatingSupply, color: COLORS[2] }
      ];
      
      setTokenMetrics(metricsData);
      
      // Prepare token info
      setTokenInfo([
        {
          label: 'Total Supply',
          value: `${formatNumber(totalSupply)} ${denomDisplay}`,
          icon: <Database className="h-4 w-4" />
        },
        {
          label: 'Staked Tokens',
          value: `${formatNumber(stakedTokens)} ${denomDisplay}`,
          icon: <Gem className="h-4 w-4" />
        },
        {
          label: 'Staking Ratio',
          value: `${(stakedTokensNum / totalSupplyNum * 100).toFixed(2)}%`,
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          label: 'Community Pool',
          value: `${formatNumber(communityPool)} ${denomDisplay}`,
          icon: <Coins className="h-4 w-4" />
        },
        {
          label: 'Inflation Rate',
          value: `${inflation}%`,
          icon: <TrendingUp className="h-4 w-4" />
        }
      ]);
      
      dataFetchedRef.current = true;
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tokenomics data:', err);
      setError("Could not fetch tokenomics data");
      
      // Set up some fallback mock data
      const mockTotalSupply = 1000000000;
      const mockStaked = mockTotalSupply * 0.4;
      const mockCommunityPool = mockTotalSupply * 0.1;
      const mockCirculating = mockTotalSupply - mockStaked - mockCommunityPool;
      
      setTokenMetrics([
        { name: 'Staked', value: mockStaked, color: COLORS[0] },
        { name: 'Community Pool', value: mockCommunityPool, color: COLORS[1] },
        { name: 'Circulating', value: mockCirculating, color: COLORS[2] }
      ]);
      
      setTokenInfo([
        { label: 'Total Supply', value: `${formatNumber(mockTotalSupply)} STAKE`, icon: <Database className="h-4 w-4" /> },
        { label: 'Staked Tokens', value: `${formatNumber(mockStaked)} STAKE`, icon: <Gem className="h-4 w-4" /> },
        { label: 'Staking Ratio', value: '40.00%', icon: <TrendingUp className="h-4 w-4" /> },
        { label: 'Community Pool', value: `${formatNumber(mockCommunityPool)} STAKE`, icon: <Coins className="h-4 w-4" /> },
        { label: 'Inflation Rate', value: '5.00%', icon: <TrendingUp className="h-4 w-4" /> }
      ]);
      
      dataFetchedRef.current = true;
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (apiUrl && !dataFetchedRef.current) {
      fetchTokenomicsData();
    } else if (!apiUrl) {
      setLoading(false);
    }
  }, [apiUrl]);

  const renderSkeletonContent = () => (
    <div className="space-y-4">
      <div className="flex justify-center py-4">
        <div className="h-40 w-40 rounded-full bg-muted animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border rounded shadow-md">
          <p className="font-medium">{`${payload[0].name}: ${formatNumber(payload[0].value)}`}</p>
          <p className="text-sm">{`${(payload[0].value / tokenMetrics.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Tokenomics</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => fetchTokenomicsData(true)}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          renderSkeletonContent()
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenMetrics}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {tokenMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tokenInfo.map((item, index) => (
                <div key={index} className="flex items-center p-2 rounded-lg border bg-card/50">
                  <div className="mr-3 p-2 rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Tokenomics;
