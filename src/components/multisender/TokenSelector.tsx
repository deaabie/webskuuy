
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getNetworkById } from '@/config/deploy-config';

interface TokenSelectorProps {
  network: string;
  selectedToken: string;
  onTokenSelect: (token: string) => void;
}

const TokenSelector = ({ network, selectedToken, onTokenSelect }: TokenSelectorProps) => {
  const [tokenType, setTokenType] = useState("native");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  
  const networkConfig = getNetworkById(network);

  useEffect(() => {
    if (tokenType === "native" && networkConfig) {
      onTokenSelect(`native:${networkConfig.symbol}`);
    } else if (tokenType === "custom" && customTokenAddress) {
      onTokenSelect(`custom:${customTokenAddress}`);
    } else {
      onTokenSelect("");
    }
  }, [tokenType, customTokenAddress, networkConfig, onTokenSelect]);

  if (!network) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please select a network first
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Token</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="tokenType">Token Type</Label>
          <Select value={tokenType} onValueChange={setTokenType}>
            <SelectTrigger>
              <SelectValue placeholder="Select token type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="native">
                Native Token ({networkConfig?.symbol})
              </SelectItem>
              <SelectItem value="custom">Custom Token (ERC-20)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tokenType === "custom" && (
          <div>
            <Label htmlFor="tokenAddress">Token Contract Address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={customTokenAddress}
              onChange={(e) => setCustomTokenAddress(e.target.value)}
            />
          </div>
        )}

        {tokenType === "native" && networkConfig && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Selected:</strong> {networkConfig.name} Native Token ({networkConfig.symbol})
            </p>
          </div>
        )}

        {tokenType === "custom" && customTokenAddress && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Selected:</strong> Custom ERC-20 Token
            </p>
            <p className="text-xs text-muted-foreground break-all mt-1">
              {customTokenAddress}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenSelector;
