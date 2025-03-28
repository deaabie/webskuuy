
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Blocks, Hash, User, Clock } from 'lucide-react';
import { Block, Validator, getValidators } from '@/services/cosmosService';
import { formatDistanceToNow } from 'date-fns';

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
  const [proposerInfo, setProposerInfo] = useState<{
    moniker: string;
    image?: string;
  } | null>(null);
  
  useEffect(() => {
    // Fetch validator info to get the moniker name
    const fetchProposerInfo = async () => {
      if (!block || !apiUrl) return;
      
      try {
        const validators = await getValidators(apiUrl);
        // Find the validator with the matching address
        const proposerValidator = validators.find(v => 
          v.address.toLowerCase() === block.proposer.toLowerCase()
        );
        
        if (proposerValidator) {
          setProposerInfo({
            moniker: proposerValidator.moniker,
            image: proposerValidator.image
          });
        } else {
          // If no matching validator is found, show a shortened address
          setProposerInfo({
            moniker: `${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`
          });
        }
      } catch (error) {
        console.error("Error fetching proposer info:", error);
        // Fallback to shortened address format
        setProposerInfo({
          moniker: `${block.proposer.substring(0, 8)}...${block.proposer.substring(block.proposer.length - 8)}`
        });
      }
    };
    
    if (isOpen && block) {
      fetchProposerInfo();
    }
  }, [block, isOpen, apiUrl]);
  
  if (!block) return null;
  
  // Calculate time ago
  const timeAgo = formatDistanceToNow(new Date(block.timestamp), { addSuffix: true });
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Block #{block.height}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 items-start">
            <div className="flex items-center gap-2">
              <Blocks className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">Height:</span>
            </div>
            <div>{block.height}</div>
            
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Hash:</span>
            </div>
            <div className="font-mono text-xs break-all">{block.hash}</div>
            
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Proposer:</span>
            </div>
            <div className="flex items-center gap-2">
              {proposerInfo?.image && (
                <img 
                  src={proposerInfo.image} 
                  alt={proposerInfo.moniker}
                  className="w-6 h-6 rounded-full mr-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="font-medium">
                {proposerInfo?.moniker || (
                  <span className="font-mono text-xs">{block.proposer.substring(0, 8)}...{block.proposer.substring(block.proposer.length - 8)}</span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Time:</span>
            </div>
            <div>
              <div>{formatDate(block.timestamp)}</div>
              <div className="text-xs text-muted-foreground">{timeAgo}</div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Transactions:</span>
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs">
                {block.txs}
              </span>
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
