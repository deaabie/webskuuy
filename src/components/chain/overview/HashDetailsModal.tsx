
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Hash, Clock, LayoutGrid, Coins, FileText, MessageSquare, User } from 'lucide-react';
import { Transaction, Validator, getValidators } from '@/services/cosmosService';

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
  const [senderName, setSenderName] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch validator info to get the sender name if it's a validator
    const fetchSenderInfo = async () => {
      if (!transaction?.sender || !apiUrl) return;
      
      try {
        const validators = await getValidators(apiUrl);
        // Find if the sender matches a validator address or account address
        const senderValidator = validators.find(v => 
          (v.address.toLowerCase() === transaction.sender?.toLowerCase()) || 
          (v.account_address && v.account_address.toLowerCase() === transaction.sender?.toLowerCase())
        );
        
        if (senderValidator) {
          setSenderName(senderValidator.moniker);
        } else {
          // If no matching validator is found, show a shortened address
          if (transaction.sender) {
            setSenderName(`${transaction.sender.substring(0, 8)}...${transaction.sender.substring(transaction.sender.length - 8)}`);
          }
        }
      } catch (error) {
        console.error("Error fetching sender info:", error);
        // Fallback to shortened address format
        if (transaction?.sender) {
          setSenderName(`${transaction.sender.substring(0, 8)}...${transaction.sender.substring(transaction.sender.length - 8)}`);
        }
      }
    };
    
    if (isOpen && transaction?.sender) {
      fetchSenderInfo();
    }
  }, [transaction, isOpen, apiUrl]);

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
            
            {transaction.sender && (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  <span className="font-semibold">Sender:</span>
                </div>
                <div>
                  {senderName || (
                    <span className="font-mono text-xs break-all">{transaction.sender}</span>
                  )}
                </div>
              </>
            )}
            
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
