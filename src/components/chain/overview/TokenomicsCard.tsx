
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
      { name: 'Bonded', value: bondedTokens },
      { name: 'Unbonded', value: unbondedTokens },
    ];
  };

  const CHART_COLORS = ['#8b5cf6', '#ec4899', '#0ea5e9', '#f97316', '#10b981'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-500" />
          Tokenomics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart>
                <Pie
                  data={calculateTokenomicsData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {calculateTokenomicsData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </RechartsChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">Total Supply</span>
              </div>
              <span className="font-medium">{formatNumber(stats?.supply.total || 0)} {chain.assets[0]?.symbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Inflation</span>
              </div>
              <span className="font-medium">{stats?.inflation}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[0] }}></div>
                <span className="text-sm">Bonded Tokens</span>
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
