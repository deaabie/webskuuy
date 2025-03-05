
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, ExternalLink, RefreshCcw, Database, Share2, SendHorizonal, Repeat, Clock, Activity, CheckCircle, X } from "lucide-react";
import SEO from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { 
  BlockchainStats, 
  ValidatorInfo, 
  BlockInfo, 
  TransactionInfo,
  fetchBlockchainStats,
  fetchValidators,
  fetchRecentBlocks,
  fetchRecentTransactions,
  startPollingUpdates
} from "@/services/cosmosRpcService";

interface WalletStats {
  balance: string;
  staking: string;
  reward: string;
  unbonding: string;
}

const ChainDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connected, setConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    balance: "0",
    staking: "0",
    reward: "0",
    unbonding: "0"
  });
  
  // State for real-time data
  const [chainStats, setChainStats] = useState<BlockchainStats | null>(null);
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [recentBlocks, setRecentBlocks] = useState<BlockInfo[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get chain info from cosmos chains API or our sample data
  const { data: chain, isLoading: chainLoading, error: chainError, refetch } = useQuery({
    queryKey: ['chain-details', slug],
    queryFn: async () => {
      // In real implementation, this would fetch from a proper API
      // For now, return sample data based on slug
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (slug === "galactica") {
        return {
          chain_name: "Galactica",
          registry_name: "galactica",
          api: [
            { provider: "Skuuy", address: "https://galactica-testnet-api.itrocket.net" }
          ],
          rpc: [
            { provider: "Skuuy", address: "https://galactica-testnet-rpc.itrocket.net" }
          ],
          sdk_version: "0.47.6",
          coin_type: "60",
          min_tx_fee: "10000000000000000",
          addr_prefix: "gala",
          logo: "/logos/galactica.png",
          assets: [{
            base: "agnet",
            symbol: "GNET",
            exponent: "18",
            coingecko_id: "", 
            logo: "/logos/galactica.png"
          }],
          is_testnet: true,
          version: "0.2.7",
          app_name: "galacticad",
          git_commit: "de41fb7a648f2cc8fbf796fb3527218a0c5b92f",
          build_tags: "netgo ledger",
          go_version: "go version go1.22.7 linux/amd64",
        };
      } else {
        return {
          chain_name: "Cosmos Hub",
          registry_name: "cosmoshub",
          api: [
            { provider: "Skuuy", address: "https://api.cosmos.network" }
          ],
          rpc: [
            { provider: "Skuuy", address: "https://rpc.cosmos.network" }
          ],
          sdk_version: "0.45.1",
          coin_type: "118",
          min_tx_fee: "500",
          addr_prefix: "cosmos",
          logo: "/logos/cosmos.png",
          assets: [{
            base: "uatom",
            symbol: "ATOM",
            exponent: "6",
            coingecko_id: "cosmos",
            logo: "/logos/cosmos.png"
          }],
          is_testnet: false,
          version: "0.34.21",
          app_name: "gaiad",
          git_commit: "765c6ae3fbdd7a585b97a8c65f0b0b8c246bc379",
          build_tags: "netgo ledger",
          go_version: "go version go1.18.3 linux/amd64",
        };
      }
    },
  });
  
  // Set up real-time data polling when chain data is available
  useEffect(() => {
    if (!chain) return;
    
    setIsLoading(true);
    setError(null);
    
    // Get the primary API and RPC endpoints
    const primaryRpc = chain.rpc[0]?.address;
    const primaryApi = chain.api[0]?.address;
    
    if (!primaryRpc || !primaryApi) {
      setError(new Error("No RPC or API endpoints available"));
      setIsLoading(false);
      return;
    }
    
    // Load initial data
    const promises = [
      fetchBlockchainStats(primaryRpc, primaryApi)
        .then(stats => setChainStats(stats))
        .catch(err => {
          console.error("Failed to fetch blockchain stats:", err);
          throw err;
        }),
        
      fetchValidators(primaryApi)
        .then(data => setValidators(data))
        .catch(err => {
          console.error("Failed to fetch validators:", err);
          // Don't throw here to avoid blocking other data
          return [];
        }),
        
      fetchRecentBlocks(primaryRpc)
        .then(data => setRecentBlocks(data))
        .catch(err => {
          console.error("Failed to fetch recent blocks:", err);
          return [];
        }),
        
      fetchRecentTransactions(primaryApi)
        .then(data => setRecentTransactions(data))
        .catch(err => {
          console.error("Failed to fetch recent transactions:", err);
          return [];
        })
    ];
    
    Promise.all(promises)
      .then(() => setIsLoading(false))
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
    
    // Start polling for updates (every 15 seconds)
    const cleanup = startPollingUpdates(
      primaryRpc,
      primaryApi,
      15000,
      (stats) => setChainStats(stats),
      (validators) => setValidators(validators),
      (blocks) => setRecentBlocks(blocks),
      (transactions) => setRecentTransactions(transactions)
    );
    
    return cleanup;
  }, [chain]);

  // Function to connect wallet
  const connectWallet = () => {
    toast({
      title: "Wallet Connection",
      description: "Wallet connection feature will be implemented soon."
    });
    setConnected(true);
    setWalletStats({
      balance: "0 " + (chain?.assets[0]?.symbol || ""),
      staking: "0 " + (chain?.assets[0]?.symbol || ""),
      reward: "0 " + (chain?.assets[0]?.symbol || ""),
      unbonding: "0 " + (chain?.assets[0]?.symbol || "")
    });
  };

  // Function to copy address to clipboard
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied to clipboard",
      description: "Address copied to clipboard"
    });
  };
  
  // Function to force refresh data
  const refreshData = () => {
    if (!chain) return;
    
    const primaryRpc = chain.rpc[0]?.address;
    const primaryApi = chain.api[0]?.address;
    
    if (!primaryRpc || !primaryApi) return;
    
    toast({
      title: "Refreshing data",
      description: "Fetching the latest blockchain data..."
    });
    
    Promise.all([
      fetchBlockchainStats(primaryRpc, primaryApi).then(stats => setChainStats(stats)),
      fetchValidators(primaryApi).then(data => setValidators(data)),
      fetchRecentBlocks(primaryRpc).then(data => setRecentBlocks(data)),
      fetchRecentTransactions(primaryApi).then(data => setRecentTransactions(data))
    ])
    .then(() => {
      toast({
        title: "Data refreshed",
        description: "Successfully updated with the latest blockchain data."
      });
    })
    .catch(err => {
      console.error("Refresh failed:", err);
      toast({
        title: "Refresh failed",
        description: "Could not fetch the latest data. Please try again.",
        variant: "destructive"
      });
    });
  };

  if (chainLoading || isLoading || !chain) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link to="/cosmos-explorer" className="text-primary hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explorer
          </Link>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded-lg w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (chainError || error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link to="/cosmos-explorer" className="text-primary hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explorer
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Chain Data</h2>
              <p className="text-muted-foreground mb-4">
                {chainError?.message || error?.message || "There was an error loading the chain information."}
              </p>
              <Button onClick={() => {
                refetch();
                refreshData();
              }}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mainAsset = chain.assets[0];

  return (
    <div className="container mx-auto py-8 px-4">
      <SEO 
        title={`${chain.chain_name} Explorer | Cosmos Blockchain Dashboard`}
        description={`Explore ${chain.chain_name} blockchain statistics, validators, and interact with the network. View current blockchain height, token supply, and more.`}
        canonicalUrl={`https://skuuy.com/chain/${slug}`}
      />

      {/* Header Navigation */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <div className="flex items-center">
          <Link to="/cosmos-explorer" className="text-primary hover:underline flex items-center mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explorer
          </Link>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-background overflow-hidden flex items-center justify-center mr-3">
              <img 
                src={chain.logo} 
                alt={chain.chain_name}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <h1 className="text-2xl font-bold">{chain.chain_name}</h1>
            <Badge variant={chain.is_testnet ? "secondary" : "default"} className="ml-2">
              {chain.is_testnet ? "Testnet" : "Mainnet"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => connectWallet()}>
            {connected ? "Connected" : "Connect Wallet"}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Block Height & Network Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs text-muted-foreground">Height</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="text-2xl font-bold">{chainStats?.height.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs text-muted-foreground">Validators</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="text-2xl font-bold">{validators.length || chainStats?.validators.total || "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs text-muted-foreground">Supply</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="text-2xl font-bold">{chainStats?.supply || "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs text-muted-foreground">Bonded Tokens</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="text-2xl font-bold">{chainStats?.bondedTokens || "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs text-muted-foreground">Inflation</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="text-2xl font-bold">{chainStats?.inflation || "0%"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs text-muted-foreground">Community Pool</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="text-2xl font-bold">{chainStats?.communityPool || "0"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Active Proposals */}
          <Card>
            <CardHeader>
              <CardTitle>Active Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No active proposals</p>
            </CardContent>
          </Card>

          {/* Wallet Section */}
          <Card>
            <CardHeader>
              <CardTitle>{connected ? "Wallet" : "Not Connected"}</CardTitle>
            </CardHeader>
            <CardContent>
              {connected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm text-muted-foreground">Balance</h3>
                    <p className="text-xl font-semibold">{walletStats.balance}</p>
                    <p className="text-sm text-muted-foreground">$0</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm text-muted-foreground">Staking</h3>
                    <p className="text-xl font-semibold">{walletStats.staking}</p>
                    <p className="text-sm text-muted-foreground">$0</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm text-muted-foreground">Reward</h3>
                    <p className="text-xl font-semibold">{walletStats.reward}</p>
                    <p className="text-sm text-muted-foreground">$0</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm text-muted-foreground">Unbonding</h3>
                    <p className="text-xl font-semibold">{walletStats.unbonding}</p>
                    <p className="text-sm text-muted-foreground">$0</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Connect your wallet to view your balance and transactions</p>
                  <Button onClick={connectWallet}>Connect Wallet</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full" variant="secondary" onClick={() => toast({ title: "Swap", description: "Swap functionality will be implemented soon." })}>
              <Repeat className="h-4 w-4 mr-2" />
              SWAP
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => toast({ title: "Send", description: "Send functionality will be implemented soon." })}>
              <SendHorizonal className="h-4 w-4 mr-2" />
              SEND
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => toast({ title: "Delegate", description: "Delegation functionality will be implemented soon." })}>
              <Share2 className="h-4 w-4 mr-2" />
              DELEGATE
            </Button>
          </div>

          {/* Application Versions */}
          <Card>
            <CardHeader>
              <CardTitle>Application Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">name</td>
                      <td className="py-2">{chain.registry_name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">app_name</td>
                      <td className="py-2">{chain.app_name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">version</td>
                      <td className="py-2">{chain.version}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">git_commit</td>
                      <td className="py-2">{chain.git_commit}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">build_tags</td>
                      <td className="py-2">{chain.build_tags}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">go_version</td>
                      <td className="py-2">{chain.go_version}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validators">
          <Card>
            <CardHeader>
              <CardTitle>Validators ({validators.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {validators.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No validator data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Validator</th>
                        <th className="text-right py-2 font-medium">Voting Power</th>
                        <th className="text-right py-2 font-medium">Commission</th>
                        <th className="text-right py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validators.slice(0, 20).map((validator, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3">
                            <div className="font-medium">{validator.moniker}</div>
                            <div className="text-xs text-muted-foreground font-mono">{validator.address}</div>
                          </td>
                          <td className="text-right py-3">{validator.votingPower}</td>
                          <td className="text-right py-3">{validator.commission}</td>
                          <td className="text-right py-3">
                            <div className="flex items-center justify-end">
                              {validator.status === "active" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    Active
                                  </div>
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Inactive
                                  </div>
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {validators.length > 20 && (
                    <div className="flex justify-center mt-4">
                      <Button variant="outline">View All Validators</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              {recentBlocks.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No block data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Height</th>
                        <th className="text-left py-2 font-medium">Hash</th>
                        <th className="text-left py-2 font-medium">Proposer</th>
                        <th className="text-center py-2 font-medium">Txs</th>
                        <th className="text-right py-2 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBlocks.map((block, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3">
                            <div className="font-medium">{block.height.toLocaleString()}</div>
                          </td>
                          <td className="py-3">
                            <div className="text-xs text-muted-foreground font-mono truncate max-w-48">
                              {block.hash}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="text-xs text-muted-foreground font-mono truncate max-w-48">
                              {block.proposerAddress}
                            </div>
                          </td>
                          <td className="text-center py-3">{block.txCount}</td>
                          <td className="text-right py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{block.time}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">View More Blocks</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No transaction data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Tx Hash</th>
                        <th className="text-left py-2 font-medium">Type</th>
                        <th className="text-center py-2 font-medium">Height</th>
                        <th className="text-center py-2 font-medium">Status</th>
                        <th className="text-right py-2 font-medium">Fee</th>
                        <th className="text-right py-2 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3">
                            <div className="text-xs text-muted-foreground font-mono truncate max-w-32">
                              {tx.hash}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">{tx.type || "Unknown"}</div>
                          </td>
                          <td className="text-center py-3">{tx.height.toLocaleString()}</td>
                          <td className="text-center py-3">
                            {tx.status === "success" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Success
                                </div>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <div className="flex items-center gap-1">
                                  <X className="h-3 w-3" />
                                  Failed
                                </div>
                              </Badge>
                            )}
                          </td>
                          <td className="text-right py-3">{tx.fee}</td>
                          <td className="text-right py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{tx.time}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">View More Transactions</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">Governance Proposals</h2>
                <p className="text-muted-foreground mb-4">
                  No active proposals found for this chain.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">Chain Parameters</h2>
                <p className="text-muted-foreground mb-4">
                  Chain parameters will be displayed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technical Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Network Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">API Endpoints</h3>
              <div className="space-y-2">
                {chain.api.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{api.provider}</p>
                      <p className="text-sm font-mono break-all">{api.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(api.address);
                        toast({
                          title: "Copied to clipboard",
                          description: "API endpoint copied to clipboard"
                        });
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        window.open(api.address, '_blank');
                      }}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">RPC Endpoints</h3>
              <div className="space-y-2">
                {chain.rpc.map((rpc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{rpc.provider}</p>
                        <Badge variant="outline" className="h-5">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm font-mono break-all">{rpc.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(rpc.address);
                        toast({
                          title: "Copied to clipboard",
                          description: "RPC endpoint copied to clipboard"
                        });
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        window.open(`${rpc.address}/status`, '_blank');
                      }}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ChainDashboard;
