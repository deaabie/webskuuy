
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Server, Check, X, Database } from 'lucide-react';
import { ChainConfig, checkEndpointStatus, getExtendedChainInfo } from '@/services/cosmosService';
import axios from 'axios';

interface EndpointStatus {
  url: string;
  provider: string;
  isRpc: boolean;
  isOnline: boolean;
  blockHeight?: string;
  hasIndexation?: boolean;
  isArchival?: boolean;
  moniker?: string;
}

interface PublicEndpointsCardProps {
  chain: ChainConfig;
  apiUrl?: string;
  rpcUrl?: string;
}

const PublicEndpointsCard: React.FC<PublicEndpointsCardProps> = ({ 
  chain,
  apiUrl,
  rpcUrl
}) => {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEndpointStatuses = async () => {
      if (!chain) return;
      
      setLoading(true);
      
      // Combine RPC and API endpoints into a single array
      const allEndpoints: EndpointStatus[] = [
        ...chain.rpc.map(rpc => ({ 
          url: rpc.address, 
          provider: rpc.provider, 
          isRpc: true,
          isOnline: false,
        })),
        ...chain.api.map(api => ({ 
          url: api.address, 
          provider: api.provider, 
          isRpc: false,
          isOnline: false,
        }))
      ];
      
      // Fetch status for each endpoint in parallel
      const updatedEndpoints = await Promise.all(allEndpoints.map(async (endpoint) => {
        try {
          // Check if endpoint is online
          const isOnline = await checkEndpointStatus(endpoint.url);
          
          let blockHeight = undefined;
          let hasIndexation = undefined;
          let isArchival = undefined;
          let moniker = undefined;
          
          // If endpoint is online, try to get more information
          if (isOnline && endpoint.isRpc) {
            try {
              // Fetch latest block from RPC endpoint
              const blockResponse = await axios.get(`${endpoint.url}/block`, { timeout: 5000 });
              if (blockResponse.data?.result?.block) {
                blockHeight = blockResponse.data.result.block.header.height;
                
                // Try to get the earliest block to check if it's archival
                try {
                  // Try to get block at height 1 to check if node is archival
                  await axios.get(`${endpoint.url}/block?height=1`, { timeout: 5000 });
                  isArchival = true;
                } catch (error) {
                  isArchival = false;
                }
                
                // Get node info to check indexation and moniker
                try {
                  const statusResponse = await axios.get(`${endpoint.url}/status`, { timeout: 5000 });
                  if (statusResponse.data?.result?.node_info) {
                    moniker = statusResponse.data.result.node_info.moniker;
                    
                    // Check indexation based on tx indexing being enabled
                    hasIndexation = statusResponse.data.result.node_info.other?.tx_index === 'on';
                  }
                } catch (error) {
                  console.error('Error fetching node status:', error);
                }
              }
            } catch (error) {
              console.error('Error fetching block data:', error);
            }
          }
          
          return {
            ...endpoint,
            isOnline,
            blockHeight,
            hasIndexation,
            isArchival,
            moniker
          };
        } catch (error) {
          console.error(`Error checking endpoint ${endpoint.url}:`, error);
          return {
            ...endpoint,
            isOnline: false
          };
        }
      }));
      
      // Sort endpoints: online first, then by block height (descending)
      const sortedEndpoints = updatedEndpoints.sort((a, b) => {
        if (a.isOnline !== b.isOnline) {
          return a.isOnline ? -1 : 1;
        }
        
        if (a.blockHeight && b.blockHeight) {
          return parseInt(b.blockHeight) - parseInt(a.blockHeight);
        }
        
        return 0;
      });
      
      setEndpoints(sortedEndpoints);
      setLoading(false);
    };
    
    fetchEndpointStatuses();
    
    // Set up interval to refresh endpoint statuses
    const interval = setInterval(fetchEndpointStatuses, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [chain]);
  
  // Highlight currently active endpoints
  const isActiveEndpoint = (url: string): boolean => {
    return url === rpcUrl || url === apiUrl;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-500" />
          Public RPC Endpoints
        </CardTitle>
        <CardDescription>
          Status of available network endpoints. RPCs with performance issues are not shown. Nodes without genesis indexing aren't marked as archival.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Endpoint</TableHead>
              <TableHead>Block Height</TableHead>
              <TableHead>Indexation</TableHead>
              <TableHead>Archival</TableHead>
              <TableHead>Moniker</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading endpoints status...
                </TableCell>
              </TableRow>
            ) : endpoints.length > 0 ? (
              endpoints.map((endpoint, index) => (
                <TableRow 
                  key={`${endpoint.url}-${index}`}
                  className={isActiveEndpoint(endpoint.url) ? "bg-muted/50" : ""}
                >
                  <TableCell className="font-mono text-xs">
                    <span className={isActiveEndpoint(endpoint.url) ? "font-bold" : ""}>
                      {endpoint.url}
                    </span>
                  </TableCell>
                  <TableCell>
                    {endpoint.isOnline ? (
                      endpoint.blockHeight ? endpoint.blockHeight : 'Unknown'
                    ) : (
                      <span className="text-destructive">Offline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {endpoint.isOnline ? (
                      <div className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs ${endpoint.hasIndexation ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                        {endpoint.hasIndexation ? 'on' : 'off'}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {endpoint.isOnline && endpoint.isArchival !== undefined ? (
                      <div className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs ${endpoint.isArchival ? 'bg-blue-500/20 text-blue-600' : 'bg-gray-500/20 text-gray-600'}`}>
                        {endpoint.isArchival ? 'archival' : 'pruned'}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {endpoint.moniker || (endpoint.provider || '-')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No endpoints available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PublicEndpointsCard;
