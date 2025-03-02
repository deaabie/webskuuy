
import React, { useState } from "react";
import { ChainConfig } from "@/types/cosmos";
import { createChainConfig, addChainConfig } from "@/config/cosmos-chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ChainConfigFormProps {
  onSuccess?: (chain: ChainConfig) => void;
}

const ChainConfigForm: React.FC<ChainConfigFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    id: "",
    prettyName: "",
    logo: "",
    rpc: "",
    rest: "",
    denom: "",
    symbol: "",
    decimals: 6,
    explorerUrl: "",
    coinGeckoId: "",
    gasPrice: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "decimals" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      const requiredFields = ['id', 'prettyName', 'rpc', 'rest', 'denom', 'symbol'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Create the chain config
      const newChain = createChainConfig({
        id: formData.id,
        prettyName: formData.prettyName,
        logo: formData.logo || `/placeholder.svg`,
        rpc: formData.rpc,
        rest: formData.rest,
        denom: formData.denom,
        symbol: formData.symbol,
        decimals: formData.decimals,
        explorerUrl: formData.explorerUrl || undefined,
        coinGeckoId: formData.coinGeckoId || undefined,
        gasPrice: formData.gasPrice || undefined
      });
      
      // Add the chain to the config
      const updatedChains = addChainConfig(newChain);
      
      toast.success(`Chain "${formData.prettyName}" has been added successfully!`);
      
      // Reset form
      setFormData({
        id: "",
        prettyName: "",
        logo: "",
        rpc: "",
        rest: "",
        denom: "",
        symbol: "",
        decimals: 6,
        explorerUrl: "",
        coinGeckoId: "",
        gasPrice: ""
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(newChain);
      }
    } catch (error) {
      console.error("Error adding chain:", error);
      toast.error("Failed to add chain. Please check your inputs and try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Cosmos Chain</CardTitle>
        <CardDescription>
          Configure a new chain to explore in the Cosmos ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Chain ID *</Label>
              <Input
                id="id"
                name="id"
                placeholder="e.g., cosmoshub"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prettyName">Display Name *</Label>
              <Input
                id="prettyName"
                name="prettyName"
                placeholder="e.g., Cosmos Hub"
                value={formData.prettyName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                placeholder="/cosmos-logos/atom.svg"
                value={formData.logo}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Leave empty for default placeholder</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rpc">RPC Endpoint *</Label>
              <Input
                id="rpc"
                name="rpc"
                placeholder="https://rpc.cosmos.network"
                value={formData.rpc}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rest">REST API Endpoint *</Label>
              <Input
                id="rest"
                name="rest"
                placeholder="https://rest.cosmos.network"
                value={formData.rest}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="denom">Denomination *</Label>
              <Input
                id="denom"
                name="denom"
                placeholder="uatom"
                value={formData.denom}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="ATOM"
                value={formData.symbol}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="decimals">Decimals *</Label>
              <Input
                id="decimals"
                name="decimals"
                type="number"
                placeholder="6"
                value={formData.decimals}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="explorerUrl">Block Explorer URL</Label>
              <Input
                id="explorerUrl"
                name="explorerUrl"
                placeholder="https://www.mintscan.io/cosmos"
                value={formData.explorerUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coinGeckoId">CoinGecko ID</Label>
              <Input
                id="coinGeckoId"
                name="coinGeckoId"
                placeholder="cosmos"
                value={formData.coinGeckoId}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gasPrice">Gas Price</Label>
              <Input
                id="gasPrice"
                name="gasPrice"
                placeholder="0.025uatom"
                value={formData.gasPrice}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <CardFooter className="px-0 pt-6">
            <Button type="submit" className="ml-auto">
              Add Chain
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChainConfigForm;
