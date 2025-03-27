
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, getValidators } from '@/services/cosmosService';

interface RecentBlocksCardProps {
  blocks: Block[];
  formatDate: (dateString: string) => string;
  onBlockClick: (block: Block) => void;
  apiUrl?: string;
}

const RecentBlocksCard: React.FC<RecentBlocksCardProps> = ({ 
  blocks, 
  formatDate,
  onBlockClick,
  apiUrl
}) => {
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);
  const [proposerNames, setProposerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProposerNames = async () => {
      if (!apiUrl || recentBlocks.length === 0) return;
      
      try {
        const validators = await getValidators(apiUrl);
        const names: Record<string, string> = {};
        
        recentBlocks.forEach(block => {
          const validator = validators.find(v => 
            v.address.toLowerCase() === block.proposer.toLowerCase()
          );
          
          if (validator) {
            names[block.proposer] = validator.moniker;
          } else {
            // Fallback to shortened address if validator not found
            names[block.proposer] = `${block.proposer.substring(0, 6)}...`;
          }
        });
        
        setProposerNames(names);
      } catch (error) {
        console.error("Error fetching proposer names:", error);
      }
    };
    
    if (apiUrl) {
      fetchProposerNames();
    }
  }, [recentBlocks, apiUrl]);

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
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">
                    {block.hash.substring(0, 6)}...{block.hash.substring(block.hash.length - 6)}
                  </TableCell>
                  <TableCell>
                    {proposerNames[block.proposer] || (
                      <span className="text-muted-foreground text-sm">Loading...</span>
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
