
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Wallet, Database } from 'lucide-react';
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
  // Calculate tokenomics data values
  const calculateTokenomicsData = () => {
    if (!stats) return { bonded: 0, unbonded: 0, totalSupply: 0, bondedPercentage: 0 };
    
    const totalSupply = parseInt(stats.supply.total) || 0;
    const bondedTokens = totalSupply * (parseFloat(stats.stakingAPR.replace('%', '')) / 100) || 0;
    const unbondedTokens = totalSupply - bondedTokens;
    const bondedPercentage = (bondedTokens / totalSupply) * 100 || 0;
    
    return {
      bonded: bondedTokens,
      unbonded: unbondedTokens,
      totalSupply,
      bondedPercentage: bondedPercentage.toFixed(2)
    };
  };

  const tokenData = calculateTokenomicsData();
  
  // Calculate unbonded percentage safely, converting string percentages to numbers first
  const getUnbondedPercentage = () => {
    if (extendedInfo?.bonded_tokens_percentage) {
      // Convert percentage string to number if it's a string
      const bondedPercentage = typeof extendedInfo.bonded_tokens_percentage === 'string' 
        ? parseFloat(extendedInfo.bonded_tokens_percentage.replace('%', ''))
        : extendedInfo.bonded_tokens_percentage;
        
      // Ensure we're working with a number before subtracting
      return typeof bondedPercentage === 'number' 
        ? (100 - bondedPercentage).toFixed(2) + '%' 
        : '0%';
    }
    
    // Use calculated tokenData as fallback
    return (100 - parseFloat(tokenData.bondedPercentage)).toFixed(2) + '%';
  };
  
  const unbondedPercentage = getUnbondedPercentage();

  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-500" />
          Tokenomics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Distribution Visualization */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <Wallet size={36} className="mb-2" />
                <span className="text-xl font-bold">{extendedInfo?.bonded_tokens_percentage || `${tokenData.bondedPercentage}%`}</span>
                <span className="text-sm opacity-90">Bonded Tokens</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <Coins size={36} className="mb-2" />
                <span className="text-xl font-bold">{unbondedPercentage}</span>
                <span className="text-sm opacity-90">Unbonded Tokens</span>
              </div>
            </div>
          </div>
          
          {/* Token Distribution Bar */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Token Distribution</span>
              <span className="text-sm font-medium">{extendedInfo?.bonded_tokens_percentage || `${tokenData.bondedPercentage}%`}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: extendedInfo?.bonded_tokens_percentage || `${tokenData.bondedPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Bonded</span>
              <span>Unbonded</span>
            </div>
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
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Database size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">Bonded Tokens</span>
              </div>
              <span className="font-medium">{extendedInfo?.bonded_tokens_percentage || `${tokenData.bondedPercentage}%`}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenomicsCard;
