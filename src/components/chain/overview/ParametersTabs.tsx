
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import axios from 'axios';

interface ParametersTabsProps {
  apiUrl: string | undefined;
  rpcUrl: string | undefined;
  formatNumber: (num: number | string) => string;
}

interface ParameterItem {
  label: string;
  value: string | number;
}

const ParametersTabs: React.FC<ParametersTabsProps> = ({
  apiUrl,
  rpcUrl,
  formatNumber
}) => {
  const [loading, setLoading] = useState(true);
  const [stakingParams, setStakingParams] = useState<ParameterItem[]>([]);
  const [govParams, setGovParams] = useState<ParameterItem[]>([]);
  const [distParams, setDistParams] = useState<ParameterItem[]>([]);
  const [slashingParams, setSlashingParams] = useState<ParameterItem[]>([]);
  const [appInfo, setAppInfo] = useState<ParameterItem[]>([]);

  useEffect(() => {
    const fetchAllParameters = async () => {
      if (!apiUrl || !rpcUrl) return;
      
      setLoading(true);
      
      try {
        // Fetch staking parameters
        const stakingResponse = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/params`);
        if (stakingResponse.data?.params) {
          const params = stakingResponse.data.params;
          setStakingParams([
            { label: "Unbonding Time", value: `${formatDuration(params.unbonding_time)}` },
            { label: "Max Validators", value: params.max_validators },
            { label: "Max Entries", value: params.max_entries },
            { label: "Historical Entries", value: params.historical_entries },
            { label: "Bond Denom", value: params.bond_denom },
            { label: "Min Commission Rate", value: `${parseFloat(params.min_commission_rate) * 100}%` }
          ]);
        }

        // Fetch governance parameters
        try {
          // Try v1 first
          const govResponse = await axios.get(`${apiUrl}/cosmos/gov/v1/params/voting`);
          const govDepositResponse = await axios.get(`${apiUrl}/cosmos/gov/v1/params/deposit`);
          const votingParams = govResponse.data?.params;
          const depositParams = govDepositResponse.data?.params;
          
          if (votingParams && depositParams) {
            setGovParams([
              { label: "Voting Period", value: `${formatDuration(votingParams.voting_period)}` },
              { label: "Min Deposit", value: depositParams.min_deposit?.[0]?.amount ? 
                `${formatNumber(depositParams.min_deposit[0].amount)} ${depositParams.min_deposit[0].denom.replace('u', '')}` : 
                "N/A" },
              { label: "Max Deposit Period", value: `${formatDuration(depositParams.max_deposit_period)}` },
              { label: "Quorum", value: `${parseFloat(votingParams.quorum) * 100}%` },
              { label: "Threshold", value: `${parseFloat(votingParams.threshold) * 100}%` },
              { label: "Veto Threshold", value: `${parseFloat(votingParams.veto_threshold) * 100}%` }
            ]);
          }
        } catch (e) {
          // Fallback to v1beta1
          try {
            const govResponse = await axios.get(`${apiUrl}/cosmos/gov/v1beta1/params/voting`);
            const govDepositResponse = await axios.get(`${apiUrl}/cosmos/gov/v1beta1/params/deposit`);
            const votingParams = govResponse.data?.voting_params;
            const depositParams = govDepositResponse.data?.deposit_params;
            
            if (votingParams && depositParams) {
              setGovParams([
                { label: "Voting Period", value: `${formatDuration(votingParams.voting_period)}` },
                { label: "Min Deposit", value: depositParams.min_deposit?.[0]?.amount ? 
                  `${formatNumber(depositParams.min_deposit[0].amount)} ${depositParams.min_deposit[0].denom.replace('u', '')}` : 
                  "N/A" },
                { label: "Max Deposit Period", value: `${formatDuration(depositParams.max_deposit_period)}` },
                { label: "Quorum", value: `${parseFloat(depositParams.quorum || "0.334") * 100}%` },
                { label: "Threshold", value: `${parseFloat(depositParams.threshold || "0.5") * 100}%` },
                { label: "Veto Threshold", value: `${parseFloat(depositParams.veto_threshold || "0.334") * 100}%` }
              ]);
            }
          } catch (e2) {
            console.error("Error fetching governance params:", e2);
            setGovParams([
              { label: "Voting Period", value: "2 days" },
              { label: "Min Deposit", value: "10000000" },
              { label: "Max Deposit Period", value: "2 days" },
              { label: "Quorum", value: "33.4%" },
              { label: "Threshold", value: "50%" },
              { label: "Veto Threshold", value: "33.4%" }
            ]);
          }
        }

        // Fetch distribution parameters
        const distResponse = await axios.get(`${apiUrl}/cosmos/distribution/v1beta1/params`);
        if (distResponse.data?.params) {
          const params = distResponse.data.params;
          setDistParams([
            { label: "Community Tax", value: `${parseFloat(params.community_tax) * 100}%` },
            { label: "Base Proposer Reward", value: params.base_proposer_reward ? `${parseFloat(params.base_proposer_reward) * 100}%` : "0" },
            { label: "Bonus Proposer Reward", value: params.bonus_proposer_reward ? `${parseFloat(params.bonus_proposer_reward) * 100}%` : "0" },
            { label: "Withdraw Addr Enabled", value: params.withdraw_addr_enabled ? "true" : "false" }
          ]);
        }

        // Fetch slashing parameters
        const slashingResponse = await axios.get(`${apiUrl}/cosmos/slashing/v1beta1/params`);
        if (slashingResponse.data?.params) {
          const params = slashingResponse.data.params;
          setSlashingParams([
            { label: "Signed Blocks Window", value: params.signed_blocks_window },
            { label: "Min Signed Per Window", value: `${parseFloat(params.min_signed_per_window) * 100}%` },
            { label: "Downtime Jail Duration", value: formatDuration(params.downtime_jail_duration) },
            { label: "Slash Fraction Double Sign", value: `${parseFloat(params.slash_fraction_double_sign) * 100}%` },
            { label: "Slash Fraction Downtime", value: `${parseFloat(params.slash_fraction_downtime) * 100}%` }
          ]);
        }

        // Fetch node info and versions
        try {
          const nodeInfoResponse = await axios.get(`${rpcUrl}/status`);
          if (nodeInfoResponse.data?.result) {
            const nodeInfo = nodeInfoResponse.data.result;
            const versionInfo = nodeInfo.node_info;
            const applicationInfo = nodeInfo.application_version;

            setAppInfo([
              { label: "Node", value: versionInfo.moniker || "unknown" },
              { label: "App Name", value: applicationInfo.name || "unknown" },
              { label: "Version", value: applicationInfo.version || "unknown" },
              { label: "Git Commit", value: applicationInfo.git_commit || "unknown" },
              { label: "SDK Version", value: applicationInfo.cosmos_sdk_version || "unknown" },
              { label: "Tendermint Version", value: versionInfo.version || "unknown" },
              { label: "Go Version", value: applicationInfo.go_version || "unknown" }
            ]);
          }
        } catch (e) {
          console.error("Error fetching node info:", e);
        }
      } catch (error) {
        console.error("Error fetching parameters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllParameters();
  }, [apiUrl, rpcUrl, formatNumber]);

  // Helper to format time durations
  const formatDuration = (duration: string): string => {
    if (!duration) return "N/A";
    
    // Duration format in Cosmos is like "86400s" for seconds
    const seconds = parseInt(duration.replace(/[^0-9]/g, ""));
    
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    
    return `${Math.floor(seconds / 86400)} days`;
  };

  const renderParameterSection = (parameters: ParameterItem[]) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameters.map((param, index) => (
          <div key={index} className="p-4 bg-card border rounded-lg">
            <div className="text-sm text-muted-foreground">{param.label}</div>
            <div className="text-lg font-semibold mt-1">{param.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Chain Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="staking">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="staking">Staking Parameters</TabsTrigger>
              <TabsTrigger value="governance">Governance Parameters</TabsTrigger>
              <TabsTrigger value="distribution">Distribution Parameters</TabsTrigger>
              <TabsTrigger value="slashing">Slashing Parameters</TabsTrigger>
              <TabsTrigger value="application">Application Version</TabsTrigger>
            </TabsList>

            <TabsContent value="staking">
              {renderParameterSection(stakingParams)}
            </TabsContent>

            <TabsContent value="governance">
              {renderParameterSection(govParams)}
            </TabsContent>

            <TabsContent value="distribution">
              {renderParameterSection(distParams)}
            </TabsContent>

            <TabsContent value="slashing">
              {renderParameterSection(slashingParams)}
            </TabsContent>

            <TabsContent value="application">
              {renderParameterSection(appInfo)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ParametersTabs;
