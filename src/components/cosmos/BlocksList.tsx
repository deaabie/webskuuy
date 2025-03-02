
import React from "react";
import { Block } from "@/types/cosmos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Database } from "lucide-react";

interface BlocksListProps {
  blocks: Block[];
}

const BlocksList: React.FC<BlocksListProps> = ({ blocks }) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Database className="h-5 w-5" />
          Latest Blocks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Height</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Proposer</TableHead>
              <TableHead className="text-right">Txs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((block) => (
              <TableRow key={block.height}>
                <TableCell className="font-medium">{block.height}</TableCell>
                <TableCell>{formatTime(block.time)}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={block.proposer}>
                    {truncateAddress(block.proposer)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{block.txCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BlocksList;
