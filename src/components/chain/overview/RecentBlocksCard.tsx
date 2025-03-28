
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, Validator, getValidators, getBlocksWithValidators } from '@/services/cosmos';

interface RecentBlocksCardProps {
  blocks: Block[];
  formatDate: (dateString: string) => string;
  onBlockClick: (block: Block) => void;
  apiUrl?: string;
  rpcUrl?: string;
}

const RecentBlocksCard: React.FC<RecentBlocksCardProps> = ({ 
  blocks, 
  formatDate,
  onBlockClick,
  apiUrl,
  rpcUrl
}) => {
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);
  const [blocksWithMonikers, setBlocksWithMonikers] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlocksWithMonikers = async () => {
      if (!apiUrl || !rpcUrl || recentBlocks.length === 0) return;
      
      try {
        setLoading(true);
        const enhancedBlocks = await getBlocksWithValidators(rpcUrl, apiUrl, recentBlocks.length);
        setBlocksWithMonikers(enhancedBlocks);
      } catch (error) {
        console.error("Error fetching blocks with validator info:", error);
        // Fall back to original blocks
        setBlocksWithMonikers(recentBlocks);
      } finally {
        setLoading(false);
      }
    };
    
    if (recentBlocks.length > 0 && apiUrl && rpcUrl) {
      fetchBlocksWithMonikers();
    } else {
      setBlocksWithMonikers(recentBlocks);
    }
  }, [recentBlocks, apiUrl, rpcUrl]);

  // Use blocksWithMonikers if available, otherwise fall back to recentBlocks
  const displayBlocks = blocksWithMonikers.length > 0 ? blocksWithMonikers : recentBlocks;

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
            {displayBlocks.length > 0 ? (
              displayBlocks.map((block) => (
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
                    {loading ? (
                      <span className="text-xs">Loading...</span>
                    ) : block.proposerMoniker ? (
                      <span className="text-xs font-medium">{block.proposerMoniker}</span>
                    ) : (
                      <span className="font-mono text-xs">{block.proposer.substring(0, 6)}...</span>
                    )}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>{formatDate(block.timestamp)}</TableCell>
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
