
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Blocks, Hash, User, Clock } from 'lucide-react';
import { Block } from '@/services/cosmosService';

interface BlockDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  block: Block | null;
  formatDate: (dateString: string) => string;
}

const BlockDetailsModal: React.FC<BlockDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  block, 
  formatDate 
}) => {
  if (!block) return null;
  
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
            <div className="font-mono text-xs break-all">{block.proposer}</div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Time:</span>
            </div>
            <div>{formatDate(block.timestamp)}</div>
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
