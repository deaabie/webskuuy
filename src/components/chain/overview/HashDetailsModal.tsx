
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Hash, Clock, LayoutGrid, Coins, FileText, MessageSquare } from 'lucide-react';
import { Transaction } from '@/services/cosmosService';

interface HashDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  formatDate: (dateString: string) => string;
}

const HashDetailsModal: React.FC<HashDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  transaction, 
  formatDate
}) => {
  if (!transaction) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 items-start">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Hash:</span>
            </div>
            <div className="font-mono text-xs break-all">{transaction.hash}</div>
            
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">Block:</span>
            </div>
            <div>{transaction.block}</div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Time:</span>
            </div>
            <div>{formatDate(transaction.timestamp)}</div>
            
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Fee:</span>
            </div>
            <div>{transaction.fee}</div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <span className="font-semibold">Type:</span>
            </div>
            <div>{transaction.type}</div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-rose-500" />
              <span className="font-semibold">Status:</span>
            </div>
            <div>{transaction.status}</div>
            
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-500" />
              <span className="font-semibold">Memo:</span>
            </div>
            <div className="text-sm">{transaction.memo || "No memo"}</div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">Gas:</span>
            </div>
            <div>{transaction.gas || "Unknown"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HashDetailsModal;
