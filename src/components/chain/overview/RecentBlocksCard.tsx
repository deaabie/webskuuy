import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Blocks, Search } from 'lucide-react';
import { Block } from '@/services/cosmosService';
import axios from 'axios';

interface RecentBlocksCardProps {
  blocks: Block[];
  formatDate: (dateString: string) => string;
  formatNumber?: (num: number | string) => string;
  onBlockClick: (block: Block) => void;
  onHashClick?: (hash: string) => void;
  onAccountClick?: (account: string) => void;
  apiUrl?: string;
}

const RecentBlocksCard: React.FC<RecentBlocksCardProps> = ({ 
  blocks, 
  formatDate,
  formatNumber,
  onBlockClick,
  onHashClick,
  onAccountClick,
  apiUrl
}) => {
  // Take only the 10 most recent blocks
  const recentBlocks = blocks.slice(0, 10);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'height' | 'hash' | 'account' | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Custom handlers for different search types
  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      // Detect the type of search
      if (/^\d+$/.test(searchValue)) {
        // If it's a number, treat as block height
        setSearchType('height');
        const blockHeight = parseInt(searchValue);
        const matchedBlock = blocks.find(block => block.height === blockHeight);
        
        if (matchedBlock) {
          onBlockClick(matchedBlock);
        } else if (apiUrl) {
          // Try to fetch the block from API if not in the current list
          try {
            const blockResponse = await axios.get(`${apiUrl}/cosmos/base/tendermint/v1beta1/blocks/${blockHeight}`);
            const blockData = blockResponse.data.block;
            
            const fetchedBlock: Block = {
              height: blockHeight,
              hash: blockData.header.app_hash,
              proposer: blockData.header.proposer_address,
              txs: blockData.data.txs ? blockData.data.txs.length : 0,
              timestamp: blockData.header.time,
            };
            
            onBlockClick(fetchedBlock);
          } catch (error) {
            setSearchError(`Block with height ${blockHeight} not found`);
          }
        } else {
          setSearchError(`Block with height ${blockHeight} not found`);
        }
      } else if (searchValue.length > 40) {
        // If it's a long string, likely a transaction hash or address
        if (searchValue.startsWith('cosmos') || searchValue.startsWith('osmo') || searchValue.startsWith('juno')) {
          setSearchType('account');
          // Handle account search
          if (onAccountClick) {
            onAccountClick(searchValue);
          } else {
            setSearchError("Account search is not supported in this view");
          }
        } else {
          // Otherwise it's probably a hash
          setSearchType('hash');
          // Handle hash search
          if (onHashClick) {
            onHashClick(searchValue);
          } else {
            setSearchError("Transaction hash search is not supported in this view");
          }
        }
      } else {
        setSearchError("Invalid search input. Please enter a block height, transaction hash, or account address.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("An error occurred during search. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-purple-500" />
          Recent Blocks
        </CardTitle>
        <CardDescription>Last 10 blocks</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Search by height, hash, or account"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            size="icon" 
            variant="outline" 
            disabled={searchLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {searchError && (
          <p className="text-sm text-red-500 mt-1">{searchError}</p>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Height</TableHead>
              <TableHead>Hash</TableHead>
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
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>{formatDate(block.timestamp)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
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
