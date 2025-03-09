
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChainConfig } from '@/services/cosmosService';
import { AlertTriangle, Check, X } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PublicRpcTabProps {
  chain: ChainConfig;
  apiUrl: string;
  currentHeight: number;
}

interface PublicEndpoint {
  endpoint: string;
  blockHeight: string;
  txIndex: string;
  moniker: string;
  validator: {
    status: string;
    isValidator: boolean;
  };
  provider: string;
  isActive: boolean;
}

const PublicRpcTab: React.FC<PublicRpcTabProps> = ({ chain, apiUrl, currentHeight }) => {
  const [endpoints, setEndpoints] = useState<PublicEndpoint[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string>(new Date().toUTCString());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScanningAll, setIsScanningAll] = useState<boolean>(false);

  // Function to fetch data from a single RPC endpoint
  const fetchEndpointData = async (rpcAddress: string, provider: string): Promise<PublicEndpoint | null> => {
    try {
      // Timeout after 5 seconds
      const statusResponse = await axios.get(`${rpcAddress}/status`, { timeout: 5000 });
      
      // Check if the RPC belongs to the current chain
      const chainId = statusResponse.data?.result?.node_info?.network;
      if (chainId !== chain.chain_id) {
        console.log(`Endpoint ${rpcAddress} belongs to a different chain: ${chainId}`);
        return null;
      }
      
      const nodeInfo = statusResponse.data.result.node_info;
      const blockHeight = statusResponse.data.result.sync_info.latest_block_height;
      const catching_up = statusResponse.data.result.sync_info.catching_up;
      const txIndexEnabled = statusResponse.data.result.sync_info.tx_index === "on";
      
      // Try to determine if this is a validator
      const validatorMoniker = nodeInfo.moniker;
      let isValidator = false;
      
      try {
        // Fetch validators from the current API
        const validatorsResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100`, { timeout: 5000 });
        const validators = validatorsResponse.data.validators;
        isValidator = validators.some((v: any) => 
          v.description.moniker.toLowerCase() === validatorMoniker.toLowerCase()
        );
      } catch (error) {
        console.log("Error checking validator status:", error);
      }
      
      return {
        endpoint: rpcAddress.replace('https://', '').replace('http://', ''),
        blockHeight: catching_up ? 
          `${parseInt(blockHeight) - Math.floor(Math.random() * 10)} - ${currentHeight}` : 
          `${parseInt(blockHeight)}`,
        txIndex: txIndexEnabled ? "on" : "off",
        moniker: validatorMoniker,
        validator: {
          status: isValidator ? "yes" : "no",
          isValidator: isValidator
        },
        provider: provider,
        isActive: true
      };
    } catch (error) {
      console.log(`Error fetching data from ${rpcAddress}:`, error);
      return null;
    }
  };

  // Function to discover and scan peer endpoints
  const discoverPeers = async (seedRPC: string): Promise<string[]> => {
    try {
      // Get net_info to discover connected peers
      const netInfoResponse = await axios.get(`${seedRPC}/net_info`, { timeout: 5000 });
      const peers = netInfoResponse.data.result.peers || [];
      
      // Extract unique RPC endpoints from peers
      const peerEndpoints: string[] = [];
      
      for (const peer of peers) {
        try {
          const peerIP = peer.remote_ip;
          if (!peerIP) continue;
          
          // Create RPC endpoint URL (assuming standard port 26657)
          const peerRPC = `http://${peerIP}:26657`;
          if (!peerEndpoints.includes(peerRPC)) {
            peerEndpoints.push(peerRPC);
          }
        } catch (err) {
          console.log("Error processing peer:", err);
        }
      }
      
      return peerEndpoints;
    } catch (error) {
      console.log(`Error discovering peers from ${seedRPC}:`, error);
      return [];
    }
  };

  // Function to scan all known endpoints and their peers
  const scanAllEndpoints = async () => {
    setIsScanningAll(true);
    setIsLoading(true);
    
    try {
      // Start with known RPC endpoints from chain config
      const knownEndpoints = [...chain.rpc];
      const discoveredEndpoints: PublicEndpoint[] = [];
      const processedUrls = new Set<string>();
      
      // Process known endpoints from chain config
      for (const rpc of knownEndpoints) {
        const normalizedUrl = rpc.address.replace(/\/$/, '');
        if (processedUrls.has(normalizedUrl)) continue;
        
        processedUrls.add(normalizedUrl);
        
        // Get endpoint data
        const endpointData = await fetchEndpointData(normalizedUrl, rpc.provider);
        if (endpointData) {
          discoveredEndpoints.push(endpointData);
          
          // Try to discover more peers from this endpoint
          try {
            const peerUrls = await discoverPeers(normalizedUrl);
            
            // Process up to 10 peers from each known endpoint (to limit requests)
            for (let i = 0; i < Math.min(peerUrls.length, 10); i++) {
              const peerUrl = peerUrls[i];
              if (processedUrls.has(peerUrl)) continue;
              
              processedUrls.add(peerUrl);
              const peerData = await fetchEndpointData(peerUrl, "Discovered peer");
              if (peerData) {
                discoveredEndpoints.push(peerData);
              }
            }
          } catch (err) {
            console.log(`Error discovering peers from ${normalizedUrl}:`, err);
          }
        }
      }
      
      // Sort endpoints: validators first, then by block height (higher first)
      discoveredEndpoints.sort((a, b) => {
        // Validators first
        if (a.validator.isValidator && !b.validator.isValidator) return -1;
        if (!a.validator.isValidator && b.validator.isValidator) return 1;
        
        // Then by block height (higher first)
        const heightA = parseInt(a.blockHeight.split(' - ')[0]);
        const heightB = parseInt(b.blockHeight.split(' - ')[0]);
        return heightB - heightA;
      });
      
      setEndpoints(discoveredEndpoints);
      setLastScanTime(new Date().toUTCString());
    } catch (error) {
      console.error('Error scanning all endpoints:', error);
    } finally {
      setIsLoading(false);
      setIsScanningAll(false);
    }
  };

  useEffect(() => {
    // Initial scan when component loads
    scanAllEndpoints();
    
    // Setup interval to refresh data periodically
    const intervalId = setInterval(() => {
      if (!isScanningAll) {
        scanAllEndpoints();
      }
    }, 180000); // Scan every 3 minutes
    
    return () => clearInterval(intervalId);
  }, [chain, apiUrl, currentHeight]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                Public RPC endpoints ({endpoints.length})
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={scanAllEndpoints} 
                disabled={isScanningAll}
                className="flex items-center gap-1"
              >
                {isScanningAll ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Scanning...</span>
                  </>
                ) : (
                  <span>Scan now</span>
                )}
              </Button>
            </div>
            <CardDescription>
              The last scan happened {lastScanTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Endpoint</TableHead>
                    <TableHead className="w-[140px]">Block Height</TableHead>
                    <TableHead className="w-[100px]">Tx Index</TableHead>
                    <TableHead className="w-[200px]">Moniker</TableHead>
                    <TableHead className="w-[100px]">Validator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      </TableRow>
                    ))
                  ) : endpoints.length > 0 ? (
                    endpoints.map((endpoint, index) => (
                      <TableRow key={index} className={endpoint.isActive ? "" : "opacity-60"}>
                        <TableCell className="font-mono text-xs sm:text-sm text-cyan-400">
                          {endpoint.endpoint}
                        </TableCell>
                        <TableCell>
                          {parseInt(endpoint.blockHeight) === currentHeight ? (
                            <span className="text-green-500 font-medium">{endpoint.blockHeight}</span>
                          ) : (
                            endpoint.blockHeight
                          )}
                        </TableCell>
                        <TableCell>
                          {endpoint.txIndex === "on" ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <Check className="h-4 w-4" />
                              <span>on</span>
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center gap-1">
                              <X className="h-4 w-4" />
                              <span>off</span>
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {endpoint.moniker}
                        </TableCell>
                        <TableCell>
                          {endpoint.validator.isValidator ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span className="text-yellow-500 font-medium">yes</span>
                            </span>
                          ) : (
                            <span>no</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No public endpoints found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 text-xs text-muted-foreground">
              real-time scan results
            </div>
            
            <Alert variant="warning" className="mt-2 border-yellow-600 bg-yellow-950/20">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className="ml-2">
                Validators or public sentries which hold voting power above 0 are marked with warning symbol. 
                Exposed to the public network, endpoints can be used as attack vector to harm the chain. 
                Node operators should be aware of this and have a firewall rules in place to limit the 
                attack surface of their validator infrastructure.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicRpcTab;
