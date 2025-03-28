
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, ChainConfig, getBlocksWithValidators } from '@/services/cosmos';
import BlockDetailsModal from './overview/BlockDetailsModal';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  formatDate: (dateString: string) => string;
  apiUrl?: string;
  rpcUrl?: string; // Add rpcUrl prop
}

const BlocksTab: React.FC<BlocksTabProps> = ({ chain, blocks, formatDate, apiUrl, rpcUrl }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blocksWithMonikers, setBlocksWithMonikers] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlocksWithMonikers = async () => {
      if (!apiUrl || !rpcUrl || blocks.length === 0) return;
      
      try {
        setLoading(true);
        const enhancedBlocks = await getBlocksWithValidators(rpcUrl, apiUrl, blocks.length);
        setBlocksWithMonikers(enhancedBlocks);
      } catch (error) {
        console.error("Error fetching blocks with validator info:", error);
        // Fall back to original blocks
        setBlocksWithMonikers(blocks);
      } finally {
        setLoading(false);
      }
    };
    
    if (blocks.length > 0 && apiUrl && rpcUrl) {
      fetchBlocksWithMonikers();
    } else {
      setBlocksWithMonikers(blocks);
    }
  }, [blocks, apiUrl, rpcUrl]);

  // Use blocksWithMonikers if available, otherwise fall back to blocks
  const displayBlocks = blocksWithMonikers.length > 0 ? blocksWithMonikers : blocks;

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
              {displayBlocks.length > 0 ? (
                displayBlocks.map((block) => (
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

      <BlockDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        block={selectedBlock}
        formatDate={formatDate}
        apiUrl={apiUrl}
        rpcUrl={rpcUrl}
      />
    </>
  );
};

export default BlocksTab;
