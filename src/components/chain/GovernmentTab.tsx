
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Proposal, ChainConfig } from '@/services/cosmosService';

interface GovernmentTabProps {
  chain: ChainConfig;
  proposals: Proposal[];
  formatNumber: (num: number | string) => string;
  formatDate: (dateString: string) => string;
}

const GovernmentTab: React.FC<GovernmentTabProps> = ({ 
  chain, 
  proposals, 
  formatNumber, 
  formatDate 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Governance</CardTitle>
        <CardDescription>Recent proposals from {chain.display_name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Voting Start</TableHead>
              <TableHead>Voting End</TableHead>
              <TableHead>Total Deposit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.id}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{proposal.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      proposal.status === 'PROPOSAL_STATUS_PASSED' ? 'default' : 
                      proposal.status === 'PROPOSAL_STATUS_REJECTED' ? 'destructive' : 
                      proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? 'secondary' : 
                      'outline'
                    }>
                      {proposal.status.replace('PROPOSAL_STATUS_', '')}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(proposal.voting_start_time)}</TableCell>
                  <TableCell>{formatDate(proposal.voting_end_time)}</TableCell>
                  <TableCell>{formatNumber(proposal.total_deposit)} {chain.assets[0]?.symbol}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No proposals available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GovernmentTab;
