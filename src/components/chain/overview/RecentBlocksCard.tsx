
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, Validator, getValidators } from '@/services/cosmosService';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

interface RecentBlocksCardProps {
  blocks: Block[];
  formatDate: (dateString: string) => string;
  onBlockClick: (block: Block) => void;
  apiUrl?: string;
}

const RecentBlocksCard: React.FC<RecentBlocksCardProps> = ({ 
  blocks, 
  formatDate,
  onBlockClick,
  apiUrl
}) => {
  const [validatorsMap, setValidatorsMap] = useState<Map<string, Validator>>(new Map());
  const [loading, setLoading] = useState(false);
  
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);
  
  useEffect(() => {
    const fetchValidators = async () => {
      if (!apiUrl || loading || recentBlocks.length === 0) return;
      
      setLoading(true);
      try {
        const validators = await getValidators(apiUrl);
        
        // Create a map of validator addresses to validator objects for quick lookup
        const newMap = new Map<string, Validator>();
        validators.forEach(validator => {
          newMap.set(validator.address.toLowerCase(), validator);
        });
        
        setValidatorsMap(newMap);
      } catch (error) {
        console.error("Error fetching validators for blocks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchValidators();
  }, [apiUrl, recentBlocks]);
  
  // Helper function to get proposer info
  const getProposerInfo = (proposerAddress: string) => {
    const validator = validatorsMap.get(proposerAddress.toLowerCase());
    return {
      moniker: validator?.moniker || `${proposerAddress.substring(0, 6)}...`,
      image: validator?.image
    };
  };
  
  // Helper function to get initials from moniker
  const getInitials = (moniker: string): string => {
    return moniker
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-purple-500" />
          Recent Blocks
        </CardTitle>
        <CardDescription>Last 10 blocks</CardDescription>
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
            {recentBlocks.length > 0 ? (
              recentBlocks.map((block) => {
                const proposerInfo = getProposerInfo(block.proposer);
                const timeAgo = formatDistanceToNow(new Date(block.timestamp), { addSuffix: true });
                
                return (
                  <TableRow key={block.height}>
                    <TableCell className="font-medium">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-medium text-primary hover:underline" 
                        onClick={() => onBlockClick(block)}
                      >
                        {block.height}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.hash}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {proposerInfo.image ? (
                            <AvatarImage 
                              src={proposerInfo.image} 
                              alt={proposerInfo.moniker} 
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <AvatarFallback className="text-xs">
                            {getInitials(proposerInfo.moniker)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {proposerInfo.moniker}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{block.txs}</TableCell>
                    <TableCell>
                      <div className="text-sm">{timeAgo}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(block.timestamp)}</div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading blocks...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentBlocksCard;
