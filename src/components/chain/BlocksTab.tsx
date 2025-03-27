
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks, Clock, ArrowUpRight, Hash, User, Activity } from 'lucide-react';
import { Block, ChainConfig, BlockchainStats, getValidators } from '@/services/cosmosService';
import BlockDetailsModal from './overview/BlockDetailsModal';

interface BlocksTabProps {
  chain: ChainConfig;
  blocks: Block[];
  stats: BlockchainStats | null;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number | string) => string;
  apiUrl?: string;
}

const BlocksTab: React.FC<BlocksTabProps> = ({ 
  chain, 
  blocks, 
  stats, 
  formatDate, 
  formatNumber, 
  apiUrl 
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposerNames, setProposerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProposerNames = async () => {
      if (!apiUrl || blocks.length === 0) return;
      
      try {
        const validators = await getValidators(apiUrl);
        const names: Record<string, string> = {};
        
        blocks.forEach(block => {
          const validator = validators.find(v => 
            v.address.toLowerCase() === block.proposer.toLowerCase()
          );
          
          if (validator) {
            names[block.proposer] = validator.moniker;
          } else {
            // Fallback to shortened address if validator not found
            names[block.proposer] = `${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`;
          }
        });
        
        setProposerNames(names);
      } catch (error) {
        console.error("Error fetching proposer names:", error);
      }
    };
    
    fetchProposerNames();
  }, [blocks, apiUrl]);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  // Calculate blocks in last 24h - fallback to block count if stats is not available
  const blocksLast24h = blocks.length;
  // Calculate transactions in last 24h
  const txsLast24h = blocks.reduce((sum, block) => sum + block.txs, 0);

  return (
    <div className="space-y-6">
      {/* Blocks Summary Cards */}
      <Card className="bg-card dark:bg-card border-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Blocks className="h-5 w-5 text-purple-500" />
            Blocks Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Block Height Card */}
            <Card className="bg-muted/40 border-none">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Block Height</h3>
                <p className="text-2xl font-bold">
                  {stats?.height ? formatNumber(stats.height) : 'Loading...'}
                </p>
              </CardContent>
            </Card>
            
            {/* Block Count Card */}
            <Card className="bg-muted/40 border-none">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Block Count (Last 24H)</h3>
                <p className="text-2xl font-bold">
                  {formatNumber(blocksLast24h)}
                </p>
              </CardContent>
            </Card>
            
            {/* Tx Count Card */}
            <Card className="bg-muted/40 border-none">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tx Count (Last 24H)</h3>
                <p className="text-2xl font-bold">
                  {formatNumber(txsLast24h)}
                </p>
              </CardContent>
            </Card>
            
            {/* Block Time Card */}
            <Card className="bg-muted/40 border-none">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Block Time</h3>
                <p className="text-2xl font-bold">
                  {stats?.blockTime ? `${stats.blockTime} s` : 'Loading...'}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blocks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
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
                  <TableCell className="font-mono text-xs truncate max-w-[180px]">
                    {block.hash.substring(0, 8)}...{block.hash.substring(block.hash.length - 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {proposerNames[block.proposer] ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs overflow-hidden">
                            {proposerNames[block.proposer].charAt(0)}
                          </div>
                          <span>{proposerNames[block.proposer]}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Loading...</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span>{new Date(block.timestamp).toLocaleDateString()}</span>
                      <span className="text-muted-foreground text-xs">{new Date(block.timestamp).toLocaleTimeString()} ({
                        Math.floor((Date.now() - new Date(block.timestamp).getTime()) / 1000 / 60)
                      } min ago)</span>
                    </div>
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
    </div>
  );
};

export default BlocksTab;
