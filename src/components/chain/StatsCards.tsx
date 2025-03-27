
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Users, Clock, TrendingUp } from 'lucide-react';
import { BlockchainStats } from '@/services/cosmosService';

interface StatsCardsProps {
  stats: BlockchainStats | null;
  formatNumber: (num: number | string) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatNumber }) => {
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
  
  // Format staking APR to show actual value when available
  const stakingAPR = stats?.stakingAPR && stats.stakingAPR !== "0%" 
    ? stats.stakingAPR 
    : "0.0%";

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
        title="Staking APR" 
        value={stakingAPR} 
        icon={<TrendingUp size={20} className="text-purple-500" />} 
        tooltip="Annual percentage rate for stakers"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, tooltip }) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2" title={tooltip}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCards;
