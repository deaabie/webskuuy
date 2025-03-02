
import React, { useState } from "react";
import { ChainConfig } from "@/types/cosmos";
import { createChainConfig, addChainConfig, exportChainToJson, NetworkType } from "@/config/cosmos-chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, Upload, Save } from "lucide-react";

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
    gasPrice: "",
    network: "mainnet" as NetworkType
  });
  const [jsonConfig, setJsonConfig] = useState("");
  const [formMode, setFormMode] = useState<"form" | "json">("form");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "decimals" ? parseInt(value) || 0 : value
    }));
  };

  const handleNetworkChange = (network: NetworkType) => {
    setFormData(prev => ({
      ...prev,
      network
    }));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonConfig(e.target.value);
  };

  const importJson = () => {
    try {
      const parsedJson = JSON.parse(jsonConfig);
      if (Array.isArray(parsedJson)) {
        toast.error("Please provide a single chain configuration, not an array");
        return;
      }
      
      // Validate required fields
      const requiredFields = ['id', 'prettyName', 'rpc', 'rest', 'denom', 'symbol'];
      const missingFields = requiredFields.filter(field => !parsedJson[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields in JSON: ${missingFields.join(', ')}`);
        return;
      }
      
      // Set form data from JSON
      setFormData({
        id: parsedJson.id || "",
        prettyName: parsedJson.prettyName || "",
        logo: parsedJson.logo || "",
        rpc: parsedJson.rpc || "",
        rest: parsedJson.rest || "",
        denom: parsedJson.denom || "",
        symbol: parsedJson.symbol || "",
        decimals: parsedJson.decimals || 6,
        explorerUrl: parsedJson.explorerUrl || "",
        coinGeckoId: parsedJson.coinGeckoId || "",
        gasPrice: parsedJson.gasPrice || "",
        network: parsedJson.network || "mainnet"
      });
      
      setFormMode("form");
      toast.success("Chain configuration imported successfully");
    } catch (error) {
      console.error("Error importing JSON:", error);
      toast.error("Invalid JSON configuration");
    }
  };

  const exportToJson = () => {
    try {
      // Validate required fields
      const requiredFields = ['id', 'prettyName', 'rpc', 'rest', 'denom', 'symbol'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Create the chain config
      const chain = createChainConfig({
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
        gasPrice: formData.gasPrice || undefined,
        network: formData.network
      });
      
      // Generate JSON and set to textarea
      const jsonData = exportChainToJson(chain);
      setJsonConfig(jsonData);
      setFormMode("json");
      
      toast.success("Chain configuration exported to JSON");
    } catch (error) {
      console.error("Error exporting to JSON:", error);
      toast.error("Failed to export configuration");
    }
  };

  const downloadJsonFile = () => {
    try {
      if (!jsonConfig) {
        exportToJson(); // Generate JSON first if not already done
        return;
      }
      
      // Create blob and download
      const blob = new Blob([jsonConfig], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.id || 'chain'}-${formData.network}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Chain configuration downloaded as ${a.download}`);
    } catch (error) {
      console.error("Error downloading JSON:", error);
      toast.error("Failed to download configuration");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formMode === "json") {
        // Try to parse and import from JSON first
        importJson();
      }
      
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
        gasPrice: formData.gasPrice || undefined,
        network: formData.network
      });
      
      // Add the chain to the config
      addChainConfig(newChain);
      
      toast.success(`Chain "${formData.prettyName}" has been added to ${formData.network}`);
      
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
        gasPrice: "",
        network: "mainnet"
      });
      setJsonConfig("");
      
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
        <Tabs value={formMode} onValueChange={(value) => setFormMode(value as "form" | "json")} className="mb-6">
          <TabsList>
            <TabsTrigger value="form">Form Entry</TabsTrigger>
            <TabsTrigger value="json">JSON Config</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <Button 
                  type="button" 
                  variant={formData.network === "mainnet" ? "default" : "outline"} 
                  onClick={() => handleNetworkChange("mainnet")}
                >
                  Mainnet
                </Button>
                <Button 
                  type="button" 
                  variant={formData.network === "testnet" ? "default" : "outline"} 
                  onClick={() => handleNetworkChange("testnet")}
                >
                  Testnet
                </Button>
              </div>
              
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
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={exportToJson}
                >
                  <Save size={16} className="mr-2" />
                  Export to JSON
                </Button>
                
                <Button type="submit">
                  Add Chain
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="json">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jsonConfig">Chain Configuration (JSON)</Label>
                <Textarea
                  id="jsonConfig"
                  placeholder='{\n  "id": "cosmoshub",\n  "prettyName": "Cosmos Hub",\n  "rpc": "https://rpc.cosmos.network",\n  ...\n}'
                  className="min-h-[200px] font-mono"
                  value={jsonConfig}
                  onChange={handleJsonChange}
                />
              </div>
              
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={importJson}
                  >
                    <Upload size={16} className="mr-2" />
                    Import
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={downloadJsonFile}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
                
                <Button type="button" onClick={handleSubmit}>
                  Add Chain
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChainConfigForm;
