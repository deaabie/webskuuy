
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Blocks,
  Clock,
  Hash,
  User
} from 'lucide-react';
import { Block, ChainConfig, getValidators, Validator } from '@/services/cosmosService';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  formatDate: (dateString: string) => string;
}

const BlocksTab: React.FC<BlocksTabProps> = ({ chain, blocks, formatDate }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validators, setValidators] = useState<Validator[]>([]);

  useEffect(() => {
    // Fetch validators when the component mounts
    const fetchValidators = async () => {
      if (chain && chain.api.length > 0) {
        const validatorsData = await getValidators(chain.api[0].address);
        setValidators(validatorsData);
      }
    };
    
    fetchValidators();
  }, [chain]);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  // Find validator moniker by address
  const getProposerMoniker = (proposerAddress: string): string => {
    if (!proposerAddress) return 'Unknown';
    
    // Try to find the validator by address
    const validator = validators.find(v => {
      // Some chains use different address formats for the proposer
      return v.address === proposerAddress || 
             v.consensus_address === proposerAddress ||
             v.hex_address === proposerAddress;
    });
    
    return validator ? validator.moniker : proposerAddress.substring(0, 10) + '...';
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
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">
                    {getProposerMoniker(block.proposer)}
                  </TableCell>
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
            <DialogDescription>
              Details for block {selectedBlock?.height} on {chain.display_name}
            </DialogDescription>
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
                <div>
                  <span className="font-medium">{getProposerMoniker(selectedBlock.proposer)}</span>
                  <div className="font-mono text-xs break-all text-muted-foreground mt-1">
                    {selectedBlock.proposer}
                  </div>
                </div>
                
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
                {parseInt(selectedBlock.txs.toString()) > 0 ? (
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
