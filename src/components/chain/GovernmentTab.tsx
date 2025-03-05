
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Vote, 
  ExternalLink, 
  Check, 
  X,
  Users,
  ListChecks,
  Info
} from 'lucide-react';
import { Proposal, ChainConfig, getProposalVotes } from '@/services/cosmosService';

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
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteData, setVoteData] = useState<{
    yes: string;
    no: string;
    abstain: string;
    no_with_veto: string;
    total: string;
  } | null>(null);
  const [loadingVotes, setLoadingVotes] = useState(false);

  const handleProposalClick = async (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
    setLoadingVotes(true);
    setVoteData(null);

    try {
      // Assuming the first API endpoint is active
      if (chain.api && chain.api.length > 0) {
        const apiUrl = chain.api[0].address;
        const votes = await getProposalVotes(apiUrl, proposal.id);
        setVoteData(votes);
      }
    } catch (error) {
      console.error('Error fetching proposal votes:', error);
    } finally {
      setLoadingVotes(false);
    }
  };

  const getStatusVariant = (status: string) => {
    if (status === 'PROPOSAL_STATUS_PASSED') return 'default';
    if (status === 'PROPOSAL_STATUS_REJECTED') return 'destructive';
    if (status === 'PROPOSAL_STATUS_VOTING_PERIOD') return 'secondary';
    return 'outline';
  };

  const getStatusDisplayName = (status: string) => {
    return status.replace('PROPOSAL_STATUS_', '');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-green-500" />
            Governance
          </CardTitle>
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
                    <TableCell className="max-w-[300px] truncate">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-medium text-primary hover:underline text-left" 
                        onClick={() => handleProposalClick(proposal)}
                      >
                        {proposal.title}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(proposal.status)}>
                        {getStatusDisplayName(proposal.status)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Proposal #{selectedProposal?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedProposal && (
            <div className="space-y-6 mt-2">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedProposal.title}</h3>
                <Badge variant={getStatusVariant(selectedProposal.status)} className="mb-2">
                  {getStatusDisplayName(selectedProposal.status)}
                </Badge>
                
                <div className="text-sm text-muted-foreground max-h-[200px] overflow-y-auto border rounded-md p-3 bg-muted/30">
                  {selectedProposal.description}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">Proposer:</span>
                  </div>
                  <div className="font-mono text-xs break-all">
                    {selectedProposal.proposer}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold">Total Deposit:</span>
                  </div>
                  <div>
                    {formatNumber(selectedProposal.total_deposit)} {chain.assets[0]?.symbol}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold">Voting Start:</span>
                  </div>
                  <div>{formatDate(selectedProposal.voting_start_time)}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold">Voting End:</span>
                  </div>
                  <div>{formatDate(selectedProposal.voting_end_time)}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-lg">Voting Results</h3>
                </div>
                
                {loadingVotes && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading voting data...</p>
                  </div>
                )}
                
                {!loadingVotes && !voteData && (
                  <div className="text-center py-4 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">No voting data available</p>
                  </div>
                )}
                
                {!loadingVotes && voteData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">Yes:</span>
                      </div>
                      <div>{formatNumber(voteData.yes)}</div>
                    </div>
                    
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="font-semibold">No:</span>
                      </div>
                      <div>{formatNumber(voteData.no)}</div>
                    </div>
                    
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold">No With Veto:</span>
                      </div>
                      <div>{formatNumber(voteData.no_with_veto)}</div>
                    </div>
                    
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">Abstain:</span>
                      </div>
                      <div>{formatNumber(voteData.abstain)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GovernmentTab;
