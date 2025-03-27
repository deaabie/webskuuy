
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Users, Clock, CoinStack } from 'lucide-react';
import { BlockchainStats } from '@/services/cosmosService';

interface StatsCardsProps {
  stats: BlockchainStats | null;
  formatNumber: (num: number | string) => string;
  chainSymbol?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatNumber, chainSymbol = 'ATOM' }) => {
  // Format large numbers with M/B suffix
  const formatWithSuffix = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return "0";
    
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    
    return formatNumber(num);
  };

  // Even if stats is null, we'll still render the cards with placeholder values
  // This will prevent the UI from jumping around while data is loading
  const height = stats?.height ? formatNumber(stats.height) : "0";
  const validatorsCount = stats?.validators ? `${stats.validators.active}/${stats.validators.total}` : "0/0";
  
  // Format block time to be more user-friendly with only 1 decimal place
  const blockTime = stats?.blockTime 
    ? `${stats.blockTime.toFixed(1)}s` 
    : "0.0s";
  
  // Format bonded tokens with appropriate suffix
  const bondedTokens = stats?.bondedTokens 
    ? `${formatWithSuffix(stats.bondedTokens)} ${chainSymbol}` 
    : `0 ${chainSymbol}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <StatCard 
        title="Latest Block" 
        value={height} 
        icon={<Hash size={20} className="text-purple-500" />} 
      />
      <StatCard 
        title="Active Validators" 
        value={validatorsCount} 
        icon={<Users size={20} className="text-purple-500" />} 
      />
      <StatCard 
        title="Block Time" 
        value={blockTime} 
        icon={<Clock size={20} className="text-purple-500" />} 
        tooltip="Average time between blocks"
      />
      <StatCard 
        title="Bonded Tokens" 
        value={bondedTokens} 
        icon={<CoinStack size={20} className="text-purple-500" />} 
        tooltip="Total tokens bonded to validators"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  tooltip?: string;
  valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, tooltip, valueClassName }) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2" title={tooltip}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueClassName || ''}`}>{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCards;
