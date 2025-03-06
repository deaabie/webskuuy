
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Wallet, Database } from 'lucide-react';
import { ChainConfig, BlockchainStats } from '@/services/cosmosService';
import axios from 'axios';

interface TokenomicsCardProps {
  chain: ChainConfig;
  stats: BlockchainStats | null;
  extendedInfo: any;
  formatNumber: (num: number | string) => string;
}

interface TokenomicsData {
  bonded: string;
  unbonded: string;
  totalSupply: string;
  bondedPercentage: string;
  unbondedPercentage: string;
}

const TokenomicsCard: React.FC<TokenomicsCardProps> = ({ 
  chain, 
  stats, 
  extendedInfo,
  formatNumber 
}) => {
  const [tokenomicsData, setTokenomicsData] = useState<TokenomicsData>({
    bonded: '0',
    unbonded: '0',
    totalSupply: '0',
    bondedPercentage: '0',
    unbondedPercentage: '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch accurate tokenomics data directly from the API
  useEffect(() => {
    const fetchTokenomicsData = async () => {
      setIsLoading(true);
      
      try {
        if (!chain || !chain.api || chain.api.length === 0) {
          console.error('No API endpoints available');
          setIsLoading(false);
          return;
        }
        
        const apiUrl = chain.api[0].address;
        
        // Fetch total supply
        const supplyResponse = await axios.get(`${apiUrl}/cosmos/bank/v1beta1/supply`);
        const totalSupplyData = supplyResponse.data.supply.find((s: any) => 
          s.denom === chain.assets[0]?.base
        ) || { amount: '0' };
        
        const totalSupply = totalSupplyData.amount || '0';
        
        // Fetch staking pool to get bonded tokens
        const stakingPoolResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/pool`);
        const bondedTokens = stakingPoolResponse.data.pool.bonded_tokens || '0';
        
        // Calculate unbonded tokens
        const unbondedTokens = BigInt(totalSupply) - BigInt(bondedTokens);
        
        // Calculate percentages
        const totalSupplyBigInt = BigInt(totalSupply);
        const bondedPercentage = totalSupplyBigInt > 0 
          ? (Number(BigInt(bondedTokens) * BigInt(10000) / totalSupplyBigInt) / 100).toFixed(2) 
          : '0';
          
        const unbondedPercentage = totalSupplyBigInt > 0 
          ? (Number(BigInt(unbondedTokens) * BigInt(10000) / totalSupplyBigInt) / 100).toFixed(2) 
          : '0';
        
        setTokenomicsData({
          bonded: bondedTokens,
          unbonded: unbondedTokens.toString(),
          totalSupply,
          bondedPercentage: `${bondedPercentage}%`,
          unbondedPercentage: `${unbondedPercentage}%`
        });
        
      } catch (error) {
        console.error('Error fetching tokenomics data:', error);
        
        // Fallback to stats data if direct API call fails
        if (stats) {
          const totalSupply = stats.supply.total || '0';
          const bondedTokens = extendedInfo?.bonded_tokens 
            || (extendedInfo?.bonded_tokens_percentage 
                ? BigInt(Number(parseFloat(extendedInfo.bonded_tokens_percentage) * 0.01) * Number(totalSupply)) 
                : '0');
          
          const bondedPercentage = extendedInfo?.bonded_tokens_percentage 
            ? extendedInfo.bonded_tokens_percentage.toString().replace(/%/g, '') 
            : '0';
          
          const unbondedPercentage = (100 - Number(bondedPercentage)).toFixed(2);
          
          setTokenomicsData({
            bonded: bondedTokens.toString(),
            unbonded: (BigInt(totalSupply) - BigInt(bondedTokens.toString())).toString(),
            totalSupply,
            bondedPercentage: `${bondedPercentage}%`,
            unbondedPercentage: `${unbondedPercentage}%`
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenomicsData();
  }, [chain, stats, extendedInfo]);

  // Format numbers for display
  const formatTokenAmount = (amount: string | number): string => {
    try {
      if (typeof amount === 'string' && amount.includes('E')) {
        return formatNumber(Number(amount));
      }
      
      // If we have a very large integer, format it properly
      if (typeof amount === 'string' && amount.length > 15) {
        const amountBigInt = BigInt(amount);
        const divisor = BigInt(10 ** (chain.assets[0]?.exponent ? parseInt(chain.assets[0].exponent) : 6));
        const formattedAmount = Number(amountBigInt / divisor);
        return formatNumber(formattedAmount);
      }
      
      return formatNumber(amount);
    } catch (error) {
      console.error('Error formatting token amount:', error);
      return '0';
    }
  };

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
                <span className="text-xl font-bold">{tokenomicsData.bondedPercentage}</span>
                <span className="text-sm opacity-90">Bonded Tokens</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <Coins size={36} className="mb-2" />
                <span className="text-xl font-bold">{tokenomicsData.unbondedPercentage}</span>
                <span className="text-sm opacity-90">Unbonded Tokens</span>
              </div>
            </div>
          </div>
          
          {/* Token Distribution Bar */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Token Distribution</span>
              <span className="text-sm font-medium">{tokenomicsData.bondedPercentage}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: tokenomicsData.bondedPercentage }}
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
              <span className="font-medium">{formatTokenAmount(tokenomicsData.totalSupply)} {chain.assets[0]?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">Inflation</span>
              </div>
              <span className="font-medium">{stats?.inflation || '0%'}</span>
            </div>
            
            <div className="flex justify-between items-center px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Database size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">Bonded Tokens</span>
              </div>
              <span className="font-medium">{tokenomicsData.bondedPercentage}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenomicsCard;
