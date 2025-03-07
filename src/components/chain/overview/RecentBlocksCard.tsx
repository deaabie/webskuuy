
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
}

const RecentBlocksCard: React.FC<RecentBlocksCardProps> = ({ 
  blocks, 
  formatDate,
  onBlockClick
}) => {
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);

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
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.hash}</TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>{formatDate(block.timestamp)}</TableCell>
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
