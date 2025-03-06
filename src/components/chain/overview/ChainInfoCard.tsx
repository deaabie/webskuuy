
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe, 
  Hash, 
  Database, 
  FileCode,
  Coins,
  Clock,
  Shield,
  Wallet,
  Info
} from 'lucide-react';
import { ChainConfig, ChainInfoExtended } from '@/services/cosmosService';

interface ChainInfoCardProps {
  chain: ChainConfig;
  extendedInfo: ChainInfoExtended | null;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number | string) => string;
}

const ChainInfoCard: React.FC<ChainInfoCardProps> = ({ 
  chain, 
  extendedInfo, 
  formatDate,
  formatNumber
}) => {
  return (
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
          {extendedInfo && (
            <>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-500" />
                <div className="text-sm font-medium">Staking Ratio</div>
                <div className="ml-auto">{extendedInfo.staking_ratio}</div>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-amber-500" />
                <div className="text-sm font-medium">Min Tx Fee</div>
                <div className="ml-auto">{formatNumber(parseInt(chain.min_tx_fee) / Math.pow(10, parseInt(chain.assets[0]?.exponent || "0")))} {chain.assets[0]?.symbol}</div>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-cyan-500" />
                <div className="text-sm font-medium">Assets</div>
                <div className="ml-auto">{chain.assets.map(a => a.symbol).join(', ')}</div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <div className="text-sm font-medium">Latest Block Time</div>
                <div className="ml-auto">{formatDate(extendedInfo.latest_block_time)}</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChainInfoCard;
