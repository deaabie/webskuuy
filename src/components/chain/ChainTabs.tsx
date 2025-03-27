
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ChainConfig, 
  BlockchainStats, 
  Validator, 
  Block, 
  Transaction,
  Proposal
} from '@/services/cosmosService';
import OverviewTab from './OverviewTab';
import ValidatorsTab from './ValidatorsTab';
import BlocksTab from './BlocksTab';
import GovernmentTab from './GovernmentTab';

interface ChainTabsProps {
  chain: ChainConfig;
  stats: BlockchainStats;
  validators: Validator[];
  blocks: Block[];
  transactions: Transaction[];
  proposals: Proposal[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
  activeEndpoint: {api: string, rpc: string};
  onTabChange: (value: string) => void;
}

const ChainTabs: React.FC<ChainTabsProps> = ({ 
  chain, 
  stats, 
  validators, 
  blocks, 
  transactions, 
  proposals,
  formatNumber,
  formatDate,
  activeEndpoint,
  onTabChange
}) => {
  const chainSymbol = chain.assets && chain.assets.length > 0 
    ? chain.assets[0].symbol 
    : chain.addr_prefix.toUpperCase();

  return (
    <Tabs defaultValue="overview" className="w-full mb-8" onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="validators">Validators</TabsTrigger>
        <TabsTrigger value="blocks">Blocks</TabsTrigger>
        <TabsTrigger value="government">Governance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 mt-6">
        <OverviewTab 
          chain={chain} 
          stats={stats} 
          blocks={blocks} 
          transactions={transactions} 
          formatNumber={formatNumber} 
          formatDate={formatDate}
          apiUrl={activeEndpoint.api}
        />
      </TabsContent>
      
      <TabsContent value="validators" className="space-y-6 mt-6">
        <ValidatorsTab 
          validators={validators} 
          formatNumber={formatNumber} 
        />
      </TabsContent>
      
      <TabsContent value="blocks" className="space-y-6 mt-6">
        <BlocksTab 
          chain={chain} 
          blocks={blocks} 
          formatDate={formatDate}
          apiUrl={activeEndpoint.api}
          validators={validators}
        />
      </TabsContent>
      
      <TabsContent value="government" className="space-y-6 mt-6">
        <GovernmentTab 
          chain={chain} 
          proposals={proposals} 
          formatNumber={formatNumber} 
          formatDate={formatDate} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ChainTabs;
