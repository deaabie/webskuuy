
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Server, Clock, BarChart } from 'lucide-react';
import { BlockchainStats } from '@/services/cosmosService';

interface StatsCardsProps {
  stats: BlockchainStats | null;
  formatNumber: (num: number | string) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatNumber }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Latest Block" value={formatNumber(stats.height)} icon={<Hash size={20} />} />
      <StatCard title="Active Validators" value={`${stats.validators.active}/${stats.validators.total}`} icon={<Server size={20} />} />
      <StatCard title="Block Time" value={`${stats.blockTime} s`} icon={<Clock size={20} />} />
      <StatCard title="Staking APR" value={stats.stakingAPR} icon={<BarChart size={20} />} />
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCards;
