
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Hash, Clock, LayoutGrid, Coins, FileText, MessageSquare, User } from 'lucide-react';
import { Transaction, Validator, getValidators } from '@/services/cosmosService';
import { formatDistanceToNow } from 'date-fns';

interface HashDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  formatDate: (dateString: string) => string;
  apiUrl?: string;
}

const HashDetailsModal: React.FC<HashDetailsModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  transaction, 
  formatDate,
  apiUrl
}) => {
  const [senderInfo, setSenderInfo] = useState<{
    moniker?: string;
    image?: string;
  } | null>(null);
  
  useEffect(() => {
    // Try to resolve the transaction sender if we have it
    const fetchSenderInfo = async () => {
      if (!transaction || !apiUrl || !transaction.sender) return;
      
      try {
        const validators = await getValidators(apiUrl);
        // Check if the sender is a validator
        const validatorMatch = validators.find(v => 
          v.address.toLowerCase() === transaction.sender?.toLowerCase()
        );
        
        if (validatorMatch) {
          setSenderInfo({
            moniker: validatorMatch.moniker,
            image: validatorMatch.image
          });
        }
      } catch (error) {
        console.error("Error fetching sender info:", error);
      }
    };
    
    if (isOpen && transaction && apiUrl) {
      fetchSenderInfo();
    }
  }, [transaction, isOpen, apiUrl]);
  
  if (!transaction) return null;
  
  // Calculate time ago
  const timeAgo = formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true });
  
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
            
            {transaction.sender && (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Sender:</span>
                </div>
                <div className="flex items-center gap-2">
                  {senderInfo?.image && (
                    <img 
                      src={senderInfo.image} 
                      alt={senderInfo.moniker || "Sender"} 
                      className="w-6 h-6 rounded-full mr-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    {senderInfo?.moniker ? (
                      <span className="font-medium">{senderInfo.moniker}</span>
                    ) : (
                      <span className="font-mono text-xs break-all">{transaction.sender}</span>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Time:</span>
            </div>
            <div>
              <div>{formatDate(transaction.timestamp)}</div>
              <div className="text-xs text-muted-foreground">{timeAgo}</div>
            </div>
            
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
            <div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                transaction.status === 'Success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {transaction.status}
              </span>
            </div>
            
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
