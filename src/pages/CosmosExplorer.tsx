import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Server, Link as LinkIcon, Activity, Search, GitBranch, Plus, Settings } from "lucide-react";
import SEO from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";

// Define types for Cosmos chain data
interface ChainAsset {
  base: string;
  symbol: string;
  exponent: string;
  coingecko_id?: string;
  logo: string;
}

interface EndpointInfo {
  provider: string;
  address: string;
}

interface CosmosChain {
  chain_name: string;
  registry_name: string;
  api: EndpointInfo[];
  rpc: EndpointInfo[];
  sdk_version: string;
  keplr_features?: string[];
  coin_type: string;
  min_tx_fee: string;
  addr_prefix: string;
  logo: string;
  assets: ChainAsset[];
  is_testnet?: boolean;
}

// Sample chains data - in a real app, this would come from an API
const sampleChains: CosmosChain[] = [
  {
    chain_name: "Galactica",
    registry_name: "galactica",
    api: [
      { provider: "Skuuy", address: "https://galactica-testnet-api.itrocket.net" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://galactica-testnet-rpc.itrocket.net" }
    ],
    sdk_version: "0.47.6",
    keplr_features: ["eth-address-gen", "eth-key-sign"],
    coin_type: "60",
    min_tx_fee: "10000000000000000",
    addr_prefix: "gala",
    logo: "https://raw.githubusercontent.com/deaabie/chainbase/refs/heads/main/galactica.png",
    assets: [{
      base: "agnet",
      symbol: "GNET",
      exponent: "18",
      coingecko_id: "",
      logo: "/logos/galactica.png"
    }],
    is_testnet: true
  },
  {
    chain_name: "Cosmos Hub",
    registry_name: "cosmoshub",
    api: [
      { provider: "Skuuy", address: "https://rest.cosmos.directory/cosmoshub" },
      { provider: "Keplr", address: "https://lcd-cosmoshub.keplr.app" }
    ],
    rpc: [
      { provider: "Skuuy", address: "https://cosmos-rpc.icycro.org" },
      { provider: "Keplr", address: "https://rpc-cosmoshub.keplr.app" }
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
    is_testnet: false
  }
];

// Function to fetch chains from GitHub repository
const fetchChains = async (): Promise<CosmosChain[]> => {
  try {
    // In a real implementation, this would fetch from a GitHub repository
    // For now, we'll simulate with the sample data
    console.log("Fetching chain data...");
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return sampleChains;
  } catch (error) {
    console.error("Error fetching chain data:", error);
    throw error;
  }
};

// Function to check if an RPC endpoint is alive
const checkRpcStatus = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url + "/status", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error checking RPC status for ${url}:`, error);
    return false;
  }
};

const CosmosExplorer = () => {
  const [networkType, setNetworkType] = useState<"mainnet" | "testnet">("mainnet");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState<CosmosChain | null>(null);
  
  // Fetch chains data using React Query
  const { data: chains = [], isLoading, error } = useQuery({
    queryKey: ['cosmos-chains'],
    queryFn: fetchChains,
  });
  
  // Filter chains based on network type and search term
  const filteredChains = chains.filter(chain => {
    const matchesNetwork = chain.is_testnet === (networkType === "testnet");
    const matchesSearch = chain.chain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chain.registry_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesNetwork && matchesSearch;
  });
  
  // Check RPC status when a chain is selected
  useEffect(() => {
    if (selectedChain) {
      selectedChain.rpc.forEach(async (rpc) => {
        const isAlive = await checkRpcStatus(rpc.address);
        console.log(`RPC ${rpc.address} status: ${isAlive ? 'Online' : 'Offline'}`);
      });
    }
  }, [selectedChain]);
  
  const handleAddNewChain = () => {
    toast({
      title: "Add New Chain",
      description: "This feature will allow adding new chains via GitHub PR. Coming soon!"
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <SEO 
        title="Cosmos Ecosystem Explorer"
        description="Explore Cosmos ecosystem chains, both testnet and mainnet, with detailed information about each network."
        canonicalUrl="https://skuuy.com/cosmos-explorer"
      />
      
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center mb-4">
          <Globe className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Cosmos Ecosystem Explorer</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Explore and interact with chains in the Cosmos ecosystem. 
          View network details, connect to endpoints, and access resources for both mainnet and testnet networks.
        </p>
      </div>
      
      {/* Network Type Selector and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <Tabs value={networkType} onValueChange={(value: "mainnet" | "testnet") => setNetworkType(value)} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
            <TabsTrigger value="testnet">Testnet</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search chains..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleAddNewChain}>
            <Plus className="h-4 w-4 mr-2" />
            Add Chain
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        // Error message
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            There was an error loading the chains data. Please try again later.
          </AlertDescription>
        </Alert>
      ) : filteredChains.length === 0 ? (
        // No results
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No chains found for your search criteria.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </div>
      ) : (
        // Modified chains grid to link to chain dashboard
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredChains.map((chain) => (
            <Link to={`/chain/${chain.registry_name}`} key={chain.registry_name}>
              <Card 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                        <img 
                          src={chain.logo} 
                          alt={chain.chain_name}
                          className="h-8 w-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{chain.chain_name}</CardTitle>
                        <CardDescription>{chain.registry_name}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={chain.is_testnet ? "secondary" : "default"}>
                      {chain.is_testnet ? "Testnet" : "Mainnet"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Assets */}
                  <div>
                    <p className="text-sm font-medium mb-1">Assets:</p>
                    <div className="flex flex-wrap gap-2">
                      {chain.assets.map((asset) => (
                        <Badge key={asset.base} variant="outline" className="flex items-center gap-1">
                          <span>{asset.symbol}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* SDK Version */}
                  <div className="flex items-center gap-2 text-sm">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span>SDK: {chain.sdk_version}</span>
                  </div>
                  
                  {/* RPC Endpoints Count */}
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{chain.rpc.length} RPC Endpoint{chain.rpc.length > 1 ? 's' : ''}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-2 pt-0">
                  <div className="flex justify-end w-full">
                    <Button variant="ghost" size="sm">View Dashboard</Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* Chain Details Modal - Remove as we now have a dedicated page */}
      
      {/* GitHub Repository Info */}
      <div className="bg-muted p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center">
            <GitBranch className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Chain Registry</h2>
          </div>
          <p className="flex-grow text-muted-foreground text-center md:text-left">
            All chain data is maintained in our GitHub repository. Submit PRs to add or update chains.
          </p>
          <Button variant="outline" onClick={() => {
            toast({
              title: "GitHub Repository",
              description: "The link to the GitHub repository will be available soon."
            });
          }}>
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CosmosExplorer;
