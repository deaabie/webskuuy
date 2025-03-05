
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Blocks,
  Clock,
  Hash,
  User
} from 'lucide-react';
import { Block, ChainConfig } from '@/services/cosmosService';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  formatDate: (dateString: string) => string;
}

const BlocksTab: React.FC<BlocksTabProps> = ({ chain, blocks, formatDate }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-purple-500" />
            Blocks
          </CardTitle>
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
                  <TableCell className="font-medium">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-medium text-primary hover:underline" 
                      onClick={() => handleBlockClick(block)}
                    >
                      {block.height}
                    </Button>
                  </TableCell>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Block #{selectedBlock?.height}</DialogTitle>
          </DialogHeader>
          
          {selectedBlock && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 items-start">
                <div className="flex items-center gap-2">
                  <Blocks className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">Height:</span>
                </div>
                <div>{selectedBlock.height}</div>
                
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Hash:</span>
                </div>
                <div className="font-mono text-xs break-all">{selectedBlock.hash}</div>
                
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Proposer:</span>
                </div>
                <div className="font-mono text-xs break-all">{selectedBlock.proposer}</div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold">Time:</span>
                </div>
                <div>{formatDate(selectedBlock.timestamp)}</div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Transactions:</span>
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs">
                    {selectedBlock.txs}
                  </span>
                </div>
                {parseInt(selectedBlock.txs) > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    This block contains {selectedBlock.txs} transactions.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This block contains no transactions.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlocksTab;
