
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Blocks, Hash, User, Clock, LayoutGrid } from 'lucide-react';
import { Block, Validator, getValidators } from '@/services/cosmosService';
import { Badge } from "@/components/ui/badge";

interface BlockDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  block: Block | null;
  formatDate: (dateString: string) => string;
  apiUrl?: string;
}

const BlockDetailsModal: React.FC<BlockDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  block, 
  formatDate,
  apiUrl
}) => {
  const [proposerName, setProposerName] = useState<string>("");
  const [proposerLoading, setProposerLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Fetch validator info to get the moniker name
    const fetchProposerInfo = async () => {
      if (!block || !apiUrl) return;
      
      setProposerLoading(true);
      
      try {
        const validators = await getValidators(apiUrl);
        // Find the validator with the matching address
        const proposerValidator = validators.find(v => 
          v.address.toLowerCase() === block.proposer.toLowerCase()
        );
        
        if (proposerValidator) {
          setProposerName(proposerValidator.moniker);
        } else {
          // If no matching validator is found, show a shortened address
          setProposerName(`${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`);
        }
      } catch (error) {
        console.error("Error fetching proposer info:", error);
        // Fallback to shortened address format
        setProposerName(`${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`);
      } finally {
        setProposerLoading(false);
      }
    };
    
    if (isOpen && block) {
      fetchProposerInfo();
    }
  }, [block, isOpen, apiUrl]);
  
  if (!block) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Blocks className="h-5 w-5 text-purple-500" />
            Block #{block.height}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-2">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 items-start">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">Height:</span>
            </div>
            <div className="font-medium">{block.height}</div>
            
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Hash:</span>
            </div>
            <div className="font-mono text-xs break-all">{block.hash}</div>
            
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Proposer:</span>
            </div>
            <div>
              {proposerLoading ? (
                <div className="h-5 w-24 animate-pulse bg-muted rounded"></div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs overflow-hidden">
                    {proposerName.charAt(0)}
                  </div>
                  <span>{proposerName}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Time:</span>
            </div>
            <div>
              {formatDate(block.timestamp)}
              <span className="text-xs text-muted-foreground ml-2">
                ({Math.floor((Date.now() - new Date(block.timestamp).getTime()) / 1000 / 60)} min ago)
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Transactions:</span>
              <Badge variant="outline" className="bg-primary/10">
                {block.txs}
              </Badge>
            </div>
            {block.txs > 0 ? (
              <p className="text-sm text-muted-foreground">
                This block contains {block.txs} transactions.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                This block contains no transactions.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockDetailsModal;
