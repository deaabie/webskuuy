
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, Validator, getValidators } from '@/services/cosmosService';
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
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);
  const [proposerMap, setProposerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchValidators = async () => {
      if (!apiUrl) return;
      
      try {
        const validatorsData = await getValidators(apiUrl);
        
        // Create a map of proposer address to validator moniker
        const addressToMoniker: Record<string, string> = {};
        validatorsData.forEach(validator => {
          addressToMoniker[validator.address.toLowerCase()] = validator.moniker;
        });
        
        setProposerMap(addressToMoniker);
      } catch (error) {
        console.error('Error fetching validators:', error);
      }
    };
    
    fetchValidators();
  }, [apiUrl]);

  const getProposerMoniker = (proposerAddress: string): string => {
    const moniker = proposerMap[proposerAddress.toLowerCase()];
    return moniker || proposerAddress.substring(0, 8) + '...' + proposerAddress.substring(proposerAddress.length - 8);
  };

  const getTimeAgo = (timestamp: string): string => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
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
              <TableHead>TX Count</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBlocks.length > 0 ? (
              recentBlocks.map((block) => (
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
                    <span className="text-indigo-400 font-medium">
                      {getProposerMoniker(block.proposer)}
                    </span>
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell className="text-right">{getTimeAgo(block.timestamp)}</TableCell>
                </TableRow>
              ))
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
