
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, Validator, getValidators } from '@/services/cosmosService';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  const [proposers, setProposers] = useState<Record<string, {name: string, image?: string}>>({});

  useEffect(() => {
    const fetchValidators = async () => {
      if (!apiUrl) return;
      
      try {
        const validators = await getValidators(apiUrl);
        const proposerMap: Record<string, {name: string, image?: string}> = {};
        
        recentBlocks.forEach(block => {
          const validator = validators.find(v => 
            v.address.toLowerCase() === block.proposer.toLowerCase()
          );
          
          if (validator) {
            proposerMap[block.proposer] = {
              name: validator.moniker,
              image: validator.image
            };
          } else {
            // Default shortened address format
            proposerMap[block.proposer] = {
              name: `${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`
            };
          }
        });
        
        setProposers(proposerMap);
      } catch (error) {
        console.error("Error fetching validators for proposer info:", error);
      }
    };
    
    if (recentBlocks.length > 0 && apiUrl) {
      fetchValidators();
    }
  }, [recentBlocks, apiUrl]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.hash}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {proposers[block.proposer] && (
                        <>
                          <Avatar className="h-5 w-5 border border-border">
                            {proposers[block.proposer].image ? (
                              <AvatarImage src={proposers[block.proposer].image} alt={proposers[block.proposer].name} />
                            ) : (
                              <AvatarFallback>{getInitials(proposers[block.proposer].name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-xs truncate max-w-[100px]">{proposers[block.proposer].name}</span>
                        </>
                      )}
                      {!proposers[block.proposer] && (
                        <span className="font-mono text-xs">{block.proposer.substring(0, 6)}...</span>
                      )}
                    </div>
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
