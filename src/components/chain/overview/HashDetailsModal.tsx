
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Hash, Clock, CircleDollarSign, Gauge, FileText } from 'lucide-react';

interface HashDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hashDetails: {
    hash: string;
    height: number;
    status: string;
    time: string;
    gas: string;
    fee: string;
    memo: string;
  } | null;
  formatDate: (dateString: string) => string;
}

const HashDetailsModal: React.FC<HashDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  hashDetails,
  formatDate
}) => {
  if (!hashDetails) return null;
  
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
            <div className="font-mono text-xs break-all">{hashDetails.hash}</div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">Height:</span>
            </div>
            <div>{hashDetails.height}</div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                hashDetails.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {hashDetails.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Time:</span>
            </div>
            <div>{formatDate(hashDetails.time)}</div>
            
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">Gas:</span>
            </div>
            <div>{hashDetails.gas}</div>
            
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Fee:</span>
            </div>
            <div>{hashDetails.fee}</div>
            
            {hashDetails.memo && (
              <>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold">Memo:</span>
                </div>
                <div className="text-sm break-all">{hashDetails.memo}</div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HashDetailsModal;
