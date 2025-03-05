
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Coins, TrendingUp } from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChainConfig, BlockchainStats } from '@/services/cosmosService';

interface TokenomicsCardProps {
  chain: ChainConfig;
  stats: BlockchainStats | null;
  extendedInfo: any;
  formatNumber: (num: number | string) => string;
}

const TokenomicsCard: React.FC<TokenomicsCardProps> = ({ 
  chain, 
  stats, 
  extendedInfo,
  formatNumber 
}) => {
  const calculateTokenomicsData = () => {
    if (!stats) return [];
    
    const totalSupply = parseInt(stats.supply.total) || 0;
    const bondedTokens = totalSupply * (parseFloat(stats.stakingAPR.replace('%', '')) / 100) || 0;
    const unbondedTokens = totalSupply - bondedTokens;
    
    return [
      { name: 'Bonded', value: bondedTokens, icon: 'lock' },
      { name: 'Unbonded', value: unbondedTokens, icon: 'unlock' },
    ];
  };

  // Enhanced palette with better colors
  const CHART_COLORS = ['#8b5cf6', '#ec4899', '#0ea5e9', '#f97316', '#10b981'];

  // Custom pie chart label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatNumber(payload[0].value)} {chain.assets[0]?.symbol}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-500" />
          Tokenomics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[220px] animate-fade-in">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart>
                <Pie
                  data={calculateTokenomicsData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                  animationDuration={800}
                >
                  {calculateTokenomicsData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Coins size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">Total Supply</span>
              </div>
              <span className="font-medium">{formatNumber(stats?.supply.total || 0)} {chain.assets[0]?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">Inflation</span>
              </div>
              <span className="font-medium">{stats?.inflation}</span>
            </div>
            
            <div className="flex justify-between items-center px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: CHART_COLORS[0], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="text-white text-xs">%</span>
                </div>
                <span className="text-sm font-medium">Bonded Tokens</span>
              </div>
              <span className="font-medium">{extendedInfo?.bonded_tokens_percentage || "0%"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenomicsCard;
