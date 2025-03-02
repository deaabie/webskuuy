
import React from "react";
import { Proposal } from "@/types/cosmos";
import { ChainConfig } from "@/types/cosmos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { FileText, Check, X, AlertTriangle, Clock } from "lucide-react";

interface ProposalsListProps {
  proposals: Proposal[];
  chain: ChainConfig;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, chain }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROPOSAL_STATUS_VOTING_PERIOD":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
            <Clock className="mr-1 h-3 w-3" />
            Voting
          </span>
        );
      case "PROPOSAL_STATUS_PASSED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            <Check className="mr-1 h-3 w-3" />
            Passed
          </span>
        );
      case "PROPOSAL_STATUS_REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
            <X className="mr-1 h-3 w-3" />
            Rejected
          </span>
        );
      case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Deposit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Governance Proposals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Voting End</TableHead>
              <TableHead>Deposit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">{proposal.id}</TableCell>
                <TableCell>
                  <div className="max-w-md truncate" title={proposal.title}>
                    {proposal.title}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                <TableCell>{formatDate(proposal.votingEndTime)}</TableCell>
                <TableCell>
                  {proposal.totalDeposit.map((deposit) => (
                    <div key={deposit.denom}>
                      {(parseInt(deposit.amount) / Math.pow(10, chain.decimals)).toLocaleString()} {chain.symbol}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProposalsList;
