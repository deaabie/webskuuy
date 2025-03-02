
import React, { useState } from "react";
import { Validator } from "@/types/cosmos";
import { ChainConfig } from "@/types/cosmos";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Search, Check, AlertTriangle } from "lucide-react";

interface ValidatorsListProps {
  validators: Validator[];
  chain: ChainConfig;
}

const ValidatorsList: React.FC<ValidatorsListProps> = ({ validators, chain }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const formatTokenAmount = (amount: string, decimals: number): string => {
    const value = parseInt(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };
  
  const formatPercentage = (value: string): string => {
    return (parseFloat(value) * 100).toFixed(2) + "%";
  };
  
  const filteredValidators = validators.filter(
    (validator) =>
      validator.description.moniker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      validator.operatorAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Validators
        </CardTitle>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search validator..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Validator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Voting Power</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead className="text-right">Uptime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredValidators.map((validator) => (
              <TableRow key={validator.operatorAddress}>
                <TableCell className="font-medium">{validator.rank}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{validator.description.moniker}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-56">
                      {validator.operatorAddress}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {validator.status === "BOND_STATUS_BONDED" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      <Check className="mr-1 h-3 w-3" />
                      Active
                    </span>
                  ) : validator.jailed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Jailed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {formatTokenAmount(validator.tokens, chain.decimals)} {chain.symbol}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatPercentage(validator.commission.commissionRates.rate)}</TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${validator.uptime >= 99 ? "text-green-600" : validator.uptime >= 95 ? "text-yellow-600" : "text-red-600"}`}>
                    {validator.uptime.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ValidatorsList;
