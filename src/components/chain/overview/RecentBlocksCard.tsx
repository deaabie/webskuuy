
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block } from '@/services/cosmosService';

interface RecentBlocksCardProps {
  blocks: Block[];
  formatDate: (dateString: string) => string;
  onBlockClick: (block: Block) => void;
  proposers?: Record<string, string>;
}

const RecentBlocksCard: React.FC<RecentBlocksCardProps> = ({ 
  blocks, 
  formatDate,
  onBlockClick,
  proposers = {}
}) => {
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);

  // Function to format time as "X time ago"
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffMs = now.getTime() - blockTime.getTime();
    
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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
              <TableHead>Proposer</TableHead>
              <TableHead>Txs</TableHead>
              <TableHead>Time</TableHead>
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
                  <TableCell>
                    {proposers[block.proposer] || 
                     (block.proposer ? block.proposer.substring(0, 8) + '...' : 'Unknown')}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell title={formatDate(block.timestamp)}>
                    {getTimeAgo(block.timestamp)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
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
