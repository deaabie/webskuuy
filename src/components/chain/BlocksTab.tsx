
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, ChainConfig, Validator, getValidators } from '@/services/cosmosService';
import BlockDetailsModal from './overview/BlockDetailsModal';
import { formatDistanceToNow } from 'date-fns';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  formatDate: (dateString: string) => string;
  apiUrl?: string;
}

const BlocksTab: React.FC<BlocksTabProps> = ({ chain, blocks, formatDate, apiUrl }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [proposerMap, setProposerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchValidators = async () => {
      if (!apiUrl) return;
      
      try {
        const validatorsData = await getValidators(apiUrl);
        setValidators(validatorsData);
        
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

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-purple-500" />
            Recent Blocks
          </CardTitle>
          <CardDescription>Latest blocks from {chain.display_name}</CardDescription>
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
                  <TableCell>
                    <span className="text-indigo-400 font-medium">
                      {getProposerMoniker(block.proposer)}
                    </span>
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell className="text-right">{getTimeAgo(block.timestamp)}</TableCell>
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
        validators={validators}
      />
    </>
  );
};

export default BlocksTab;
