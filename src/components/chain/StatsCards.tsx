
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Users, Coins, Landmark } from 'lucide-react';
import { BlockchainStats } from '@/services/cosmosService';

interface StatsCardsProps {
  stats: BlockchainStats | null;
  formatNumber: (num: number | string) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatNumber }) => {
  // Even if stats is null, we'll still render the cards with placeholder values
  // This will prevent the UI from jumping around while data is loading
  const height = stats?.height ? formatNumber(stats.height) : "0";
  const validatorsCount = stats?.validators ? `${stats.validators.active}/${stats.validators.total}` : "0/0";
  
  // Format supply to display in M (millions) or B (billions) if the number is large enough
  const formatLargeNumber = (numStr: string): string => {
    const num = parseFloat(numStr);
    if (isNaN(num)) return "0";
    
    // 1,000,000 (6 digits) = 1M
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num > 0) {
      return formatNumber(num);
    } else {
      return "0";
    }
  };
  
  // Process supply values
  const supplyValue = stats?.supply?.total || "0";
  const supplyDisplay = formatLargeNumber(supplyValue);
  const supplyWithDenom = stats?.supply?.denom ? `${supplyDisplay} ${stats.supply.denom.toUpperCase()}` : supplyDisplay;
  
  // Process community pool values
  const communityPoolValue = stats?.communityPool || "0";
  const communityPoolDisplay = formatLargeNumber(communityPoolValue);
  const communityPoolWithDenom = stats?.supply?.denom ? `${communityPoolDisplay} ${stats.supply.denom.toUpperCase()}` : communityPoolDisplay;

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
        title="Supply" 
        value={supplyWithDenom} 
        icon={<Coins size={20} className="text-purple-500" />} 
      />
      <StatCard 
        title="Community Pool" 
        value={communityPoolWithDenom} 
        icon={<Landmark size={20} className="text-purple-500" />} 
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
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
