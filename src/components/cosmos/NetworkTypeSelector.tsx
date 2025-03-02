
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NetworkTypeSelectorProps {
  selectedNetworkType: "mainnet" | "testnet" | undefined;
  onNetworkTypeChange: (networkType: "mainnet" | "testnet" | undefined) => void;
}

const NetworkTypeSelector: React.FC<NetworkTypeSelectorProps> = ({
  selectedNetworkType,
  onNetworkTypeChange,
}) => {
  return (
    <div className="w-full md:w-1/3">
      <Select
        value={selectedNetworkType || "mainnet"}
        onValueChange={(value) => onNetworkTypeChange(value as "mainnet" | "testnet" | undefined)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select network type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Network Type</SelectLabel>
            <SelectItem value="mainnet">Mainnet</SelectItem>
            <SelectItem value="testnet">Testnet</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkTypeSelector;
