
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Block, ChainConfig } from '@/services/cosmosService';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  formatDate: (dateString: string) => string;
}

const BlocksTab: React.FC<BlocksTabProps> = ({ chain, blocks, formatDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocks</CardTitle>
        <CardDescription>Recent blocks from {chain.display_name}</CardDescription>
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
            {blocks.map((block) => (
              <TableRow key={block.height}>
                <TableCell className="font-medium">{block.height}</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.hash}</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.proposer}</TableCell>
                <TableCell>{block.txs}</TableCell>
                <TableCell>{formatDate(block.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BlocksTab;
