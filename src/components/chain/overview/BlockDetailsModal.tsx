
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blocks, Calendar, Hash, User, Clock, FileText } from 'lucide-react';
import { Block } from '@/services/cosmos';

interface BlockDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  block: Block | null;
  formatDate: (dateString: string) => string;
  apiUrl?: string;
  rpcUrl?: string;
}

const BlockDetailsModal: React.FC<BlockDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  block,
  formatDate,
  apiUrl,
  rpcUrl,
}) => {
  if (!block) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Blocks className="h-5 w-5 text-purple-500" />
            Block {block.height}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex items-center font-medium">
                        <Hash className="h-4 w-4 text-muted-foreground mr-2" />
                        Block Hash
                      </TableCell>
                      <TableCell className="font-mono text-xs break-all">
                        {block.hash}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center font-medium">
                        <User className="h-4 w-4 text-muted-foreground mr-2" />
                        Proposer
                      </TableCell>
                      <TableCell>
                        {block.proposerMoniker ? (
                          <span className="font-medium">{block.proposerMoniker}</span>
                        ) : (
                          <span className="font-mono text-xs">{block.proposer}</span>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                        Transactions
                      </TableCell>
                      <TableCell>{block.txs || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center font-medium">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        Time
                      </TableCell>
                      <TableCell>{formatDate(block.timestamp)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="py-4">
            <Card>
              <CardContent className="pt-6">
                {block.txs > 0 ? (
                  <div className="text-muted-foreground text-center py-4">
                    Transaction data loading...
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-4">
                    No transactions in this block
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raw" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                  {JSON.stringify(block, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BlockDetailsModal;
