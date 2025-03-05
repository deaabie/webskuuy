
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SEO from '@/components/SEO';
import { 
  ChainConfig, 
  BlockchainStats, 
  Validator, 
  Block, 
  Transaction,
  getChainConfigs,
  getBlockchainStats,
  getValidators,
  getBlocks,
  getTransactions
} from '@/services/cosmosService';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Globe, 
  Hash, 
  Database, 
  Clock,
  BarChart,
  FileCode,
  Coins,
  PieChart
} from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ChainDashboard: React.FC = () => {
  const { chainName } = useParams<{ chainName: string }>();
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState<{api: string, rpc: string}>({api: '', rpc: ''});
  const [activeTab, setActiveTab] = useState('overview');

  const fetchBlockchainData = useCallback(async () => {
    if (!chain || !activeEndpoint.api || !activeEndpoint.rpc) return;
    
    try {
      const statsData = await getBlockchainStats(activeEndpoint.rpc, activeEndpoint.api);
      setStats(statsData);
      
      if (activeTab === 'validators' || activeTab === 'overview') {
        const validatorsData = await getValidators(activeEndpoint.api);
        setValidators(validatorsData);
      }
      
      if (activeTab === 'blocks' || activeTab === 'overview') {
        const blocksData = await getBlocks(activeEndpoint.rpc);
        setBlocks(blocksData);
      }
      
      if (activeTab === 'transactions' || activeTab === 'overview') {
        const txsData = await getTransactions(activeEndpoint.api);
        setTransactions(txsData);
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    }
  }, [chain, activeEndpoint, activeTab]);

  // Initial data fetching
  useEffect(() => {
    const fetchChainData = async () => {
      setLoading(true);
      
      // Try to find chain in mainnet
      let chainsData = await getChainConfigs('mainnet');
      let foundChain = chainsData.find(c => c.chain_name === chainName);
      
      // If not found, try testnet
      if (!foundChain) {
        chainsData = await getChainConfigs('testnet');
        foundChain = chainsData.find(c => c.chain_name === chainName);
      }
      
      if (foundChain) {
        setChain(foundChain);
        
        // Set active endpoints
        if (foundChain.api.length > 0 && foundChain.rpc.length > 0) {
          setActiveEndpoint({
            api: foundChain.api[0].address,
            rpc: foundChain.rpc[0].address
          });
        }
      }
      
      setLoading(false);
    };
    
    fetchChainData();
  }, [chainName]);

  // Fetch data when chain or active endpoints change
  useEffect(() => {
    if (chain && activeEndpoint.api && activeEndpoint.rpc) {
      fetchBlockchainData();
    }
  }, [chain, activeEndpoint, fetchBlockchainData, activeTab]);

  // Set up polling for real-time updates (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (chain && activeEndpoint.api && activeEndpoint.rpc) {
        fetchBlockchainData();
      }
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
  }, [chain, activeEndpoint, fetchBlockchainData]);

  // Format number with commas
  const formatNumber = (num: number | string): string => {
    return Number(num).toLocaleString();
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <p>Loading chain data...</p>
      </div>
    );
  }

  if (!chain) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <p>Chain not found</p>
      </div>
    );
  }

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

  // Chart colors
  const COLORS = ['#8B5CF6', '#D1D5DB'];

  return (
    <div className="container mx-auto py-8 px-4">
      <SEO 
        title={`${chain.display_name} Explorer`}
        description={`Explore ${chain.display_name} blockchain statistics, validators, blocks, and transactions.`}
        canonicalUrl={`https://skuuy.com/explorer/${chain.chain_name}`}
      />
      
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={chain.logo}
            alt={chain.display_name}
            className="w-16 h-16 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">{chain.display_name}</h1>
            <p className="text-muted-foreground">{chain.chain_id}</p>
          </div>
        </div>
      </div>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Latest Block" value={formatNumber(stats.height)} icon={<Hash size={20} />} />
          <StatCard title="Active Validators" value={`${stats.validators.active}/${stats.validators.total}`} icon={<Server size={20} />} />
          <StatCard title="Block Time" value={`${stats.blockTime} s`} icon={<Clock size={20} />} />
          <StatCard title="Staking APR" value={stats.stakingAPR} icon={<BarChart size={20} />} />
        </div>
      )}
      
      <Tabs defaultValue="overview" className="w-full mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
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
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">Chain ID</div>
                    <div className="ml-auto">{chain.chain_id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">Address Prefix</div>
                    <div className="ml-auto">{chain.addr_prefix}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">SDK Version</div>
                    <div className="ml-auto">{chain.sdk_version}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
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
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatNumber(value)} />
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
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
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
        </TabsContent>
        
        <TabsContent value="validators" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Validators</CardTitle>
              <CardDescription>Active validators for {chain.display_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Moniker</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Voting Power</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validators.map((validator, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{validator.moniker}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[150px]">{validator.address}</TableCell>
                      <TableCell>{formatNumber(validator.voting_power)}</TableCell>
                      <TableCell>{validator.commission}</TableCell>
                      <TableCell>
                        <Badge variant={validator.status === 'Active' ? 'default' : 'secondary'}>
                          {validator.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{validator.uptime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocks" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Blocks</CardTitle>
              <CardDescription>Recent blocks from {chain.display_name}</CardDescription>
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
                  {blocks.map((block) => (
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
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent transactions from {chain.display_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hash</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell className="font-mono text-xs truncate max-w-[150px]">{tx.hash}</TableCell>
                      <TableCell>{tx.block}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{formatNumber(tx.fee)}</TableCell>
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
        </TabsContent>
      </Tabs>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-purple-500" />
            Endpoints
          </CardTitle>
          <CardDescription>API and RPC endpoints for {chain.display_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">REST API Endpoints</div>
              <div className="space-y-2">
                {chain.api.map((api, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button 
                      variant={activeEndpoint.api === api.address ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveEndpoint({...activeEndpoint, api: api.address})}
                    >
                      {api.provider}
                    </Button>
                    <span className="font-mono text-sm truncate">{api.address}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="text-sm font-medium mb-2">RPC Endpoints</div>
              <div className="space-y-2">
                {chain.rpc.map((rpc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button 
                      variant={activeEndpoint.rpc === rpc.address ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveEndpoint({...activeEndpoint, rpc: rpc.address})}
                    >
                      {rpc.provider}
                    </Button>
                    <span className="font-mono text-sm truncate">{rpc.address}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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

export default ChainDashboard;
