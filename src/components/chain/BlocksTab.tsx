
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, ChainConfig, Validator } from '@/services/cosmosService';
import BlockDetailsModal from './overview/BlockDetailsModal';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  formatDate: (dateString: string) => string;
  apiUrl?: string;
  validators?: Validator[];
}

const BlocksTab: React.FC<BlocksTabProps> = ({ chain, blocks, formatDate, apiUrl, validators = [] }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposerMap, setProposerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Create a mapping from validator address to moniker
    if (validators.length > 0) {
      const mapping: Record<string, string> = {};
      validators.forEach(validator => {
        if (validator.address) {
          mapping[validator.address] = validator.moniker || 'Unknown';
        }
      });
      setProposerMap(mapping);
    }
  }, [validators]);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

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
                  <TableCell>
                    {proposerMap[block.proposer] || 
                     (block.proposer ? block.proposer.substring(0, 8) + '...' : 'Unknown')}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell title={formatDate(block.timestamp)}>
                    {getTimeAgo(block.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
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
      />
    </>
  );
};

export default BlocksTab;
