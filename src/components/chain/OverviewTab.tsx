
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Hash, 
  Database, 
  FileCode,
  Coins,
  PieChart
} from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Block, Transaction, BlockchainStats, ChainConfig } from '@/services/cosmosService';

interface OverviewTabProps {
  chain: ChainConfig;
  stats: BlockchainStats | null;
  blocks: Block[];
  transactions: Transaction[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  chain, 
  stats, 
  blocks, 
  transactions, 
  formatNumber, 
  formatDate 
}) => {
  // Calculate bonded and unbonded tokens for the tokenomics chart
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

  // Enhanced chart colors
  const CHART_COLORS = ['#8B5CF6', '#F97316', '#0EA5E9', '#D946EF', '#10B981'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chain Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Chain Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-purple-500" />
                <div className="text-sm font-medium">Chain ID</div>
                <div className="ml-auto">{chain.chain_id}</div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-orange-500" />
                <div className="text-sm font-medium">Address Prefix</div>
                <div className="ml-auto">{chain.addr_prefix}</div>
              </div>
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-blue-500" />
                <div className="text-sm font-medium">SDK Version</div>
                <div className="ml-auto">{chain.sdk_version}</div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-pink-500" />
                <div className="text-sm font-medium">Coin Type</div>
                <div className="ml-auto">{chain.coin_type}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tokenomics Card */}
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            Recent Blocks
          </CardTitle>
          <CardDescription>Last 5 blocks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Height</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Proposer</TableHead>
                <TableHead>Txs</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.slice(0, 5).map((block) => (
                <TableRow key={block.height}>
                  <TableCell className="font-medium">{block.height}</TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.hash}</TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.proposer}</TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>{formatDate(block.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-purple-500" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Last 5 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{tx.hash}</TableCell>
                  <TableCell>{tx.block}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'Success' ? 'default' : 'destructive'}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
