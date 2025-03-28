
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Blocks } from 'lucide-react';
import { Block, Validator, getValidators } from '@/services/cosmosService';

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
  const [proposers, setProposers] = useState<Record<string, {name: string}>>({});
  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState<Validator[]>([]);

  useEffect(() => {
    const fetchValidators = async () => {
      if (!apiUrl || recentBlocks.length === 0) return;
      
      try {
        setLoading(true);
        const validatorsData = await getValidators(apiUrl);
        setValidators(validatorsData);
        
        const proposerMap: Record<string, {name: string}> = {};
        
        // Create a map of consensus addresses to validator info
        const validatorMap: Record<string, Validator> = {};
        validatorsData.forEach(validator => {
          if (validator.consensus_address) {
            validatorMap[validator.consensus_address.toLowerCase()] = validator;
          }
        });
        
        // Match proposers to validators
        recentBlocks.forEach(block => {
          const proposerAddress = block.proposer.toLowerCase();
          const matchedValidator = validatorMap[proposerAddress] || 
                                  validatorsData.find(v => 
                                    v.consensus_address?.toLowerCase() === proposerAddress || 
                                    v.address.toLowerCase() === proposerAddress
                                  );
          
          if (matchedValidator) {
            proposerMap[block.proposer] = {
              name: matchedValidator.moniker
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
      } finally {
        setLoading(false);
      }
    };
    
    if (recentBlocks.length > 0 && apiUrl) {
      fetchValidators();
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
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{block.hash}</TableCell>
                  <TableCell>
                    {loading ? (
                      <span className="text-xs">Loading...</span>
                    ) : proposers[block.proposer] ? (
                      <span className="text-xs font-medium">{proposers[block.proposer].name}</span>
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
  );
};

export default RecentBlocksCard;
