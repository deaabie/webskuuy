
import React from "react";
import { Block, ChainConfig, Proposal, Validator } from "@/types/cosmos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ValidatorsList from "./ValidatorsList";
import ProposalsList from "./ProposalsList";
import BlocksList from "./BlocksList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";

interface ContentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  validators: Validator[];
  proposals: Proposal[];
  blocks: Block[];
  selectedChain: ChainConfig;
  loading: boolean;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  onTabChange,
  validators,
  proposals,
  blocks,
  selectedChain,
  loading,
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="validators">Validators</TabsTrigger>
        <TabsTrigger value="proposals">Governance</TabsTrigger>
        <TabsTrigger value="blocks">Blocks</TabsTrigger>
      </TabsList>
      
      <TabsContent value="validators" className="space-y-4">
        {loading ? (
          <LoadingSkeleton />
        ) : validators.length > 0 ? (
          <ValidatorsList validators={validators} chain={selectedChain} />
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No validators found</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="proposals" className="space-y-4">
        {loading ? (
          <LoadingSkeleton />
        ) : proposals.length > 0 ? (
          <ProposalsList proposals={proposals} chain={selectedChain} />
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No proposals found</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="blocks" className="space-y-4">
        {loading ? (
          <LoadingSkeleton />
        ) : blocks.length > 0 ? (
          <BlocksList blocks={blocks} />
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No blocks found</AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
