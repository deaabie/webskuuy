
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Users, Database, Wallet } from 'lucide-react';
import { BlockchainStats } from '@/services/cosmosService';

interface StatsCardsProps {
  stats: BlockchainStats | null;
  formatNumber: (num: number | string) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatNumber }) => {
  const height = stats?.height ? formatNumber(stats.height) : "0";
  const validatorsCount = stats?.validators ? `${stats.validators.active}/${stats.validators.total}` : "0/0";
  
  // Format supply numbers to be more readable (M for millions, B for billions)
  const formatSupply = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    return formatNumber(num);
  };

  const totalSupply = stats?.supply?.total ? formatSupply(stats.supply.total) : "0";
  const communityPool = stats?.communityPool ? formatSupply(stats.communityPool) : "0";

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
        title="Total Supply" 
        value={totalSupply} 
        icon={<Database size={20} className="text-purple-500" />} 
      />
      <StatCard 
        title="Community Pool" 
        value={communityPool} 
        icon={<Wallet size={20} className="text-purple-500" />} 
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
