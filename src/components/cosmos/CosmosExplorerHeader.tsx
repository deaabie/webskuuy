
import React from "react";
import { ChainConfig } from "@/types/cosmos";
import { CosmosExplorerStats } from "@/types/cosmos";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Activity, Clock, Users, FileText } from "lucide-react";

interface CosmosExplorerHeaderProps {
  selectedChain: ChainConfig;
  chains: ChainConfig[];
  stats: CosmosExplorerStats | null;
  onChainSelect: (chainId: string) => void;
}

const CosmosExplorerHeader: React.FC<CosmosExplorerHeaderProps> = ({
  selectedChain,
  chains,
  stats,
  onChainSelect,
}) => {
  const formatNumberWithCommas = (value: string): string => {
    return parseInt(value).toLocaleString();
  };

  const formatTokenAmount = (amount: string, decimals: number): string => {
    const value = parseInt(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          {selectedChain.logo && (
            <img
              src={selectedChain.logo}
              alt={`${selectedChain.prettyName} logo`}
              className="w-10 h-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          )}
          <h1 className="text-2xl font-bold">{selectedChain.prettyName} Explorer</h1>
        </div>
        
        <Tabs defaultValue={selectedChain.id} className="w-full md:w-auto">
          <TabsList className="w-full md:w-auto overflow-x-auto">
            {chains.map((chain) => (
              <TabsTrigger
                key={chain.id}
                value={chain.id}
                onClick={() => onChainSelect(chain.id)}
                className="min-w-max"
              >
                {chain.prettyName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Latest Block</div>
                <div className="font-medium">{formatNumberWithCommas(stats.blockHeight)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Block Time</div>
                <div className="font-medium">{stats.blockTime} seconds</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Validators</div>
                <div className="font-medium">{stats.activeValidators}/{stats.totalValidators}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Bonded Tokens</div>
                <div className="font-medium">
                  {formatTokenAmount(stats.bondedTokens, selectedChain.decimals)} {selectedChain.symbol}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Proposals</div>
                <div className="font-medium">{stats.activeProposals}/{stats.totalProposals}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Inflation</div>
                <div className="font-medium">{stats.inflation}%</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Supply</div>
                <div className="font-medium">
                  {formatTokenAmount(stats.totalSupply, selectedChain.decimals)} {selectedChain.symbol}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Community Pool</div>
                <div className="font-medium">
                  {formatTokenAmount(stats.communityPool, selectedChain.decimals)} {selectedChain.symbol}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CosmosExplorerHeader;
