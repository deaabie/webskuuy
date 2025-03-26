
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTestnets, getMainnets, getAllNetworks } from "@/config/deploy-config";
import { NetworkConfig } from "@/components/faucet/types";

interface NetworkSelectionProps {
  onNetworkChange: (networkId: string) => void;
}

// Get custom networks from localStorage
const getCustomNetworks = (): NetworkConfig[] => {
  try {
    const networksStr = localStorage.getItem('customNetworks');
    return networksStr ? JSON.parse(networksStr) : [];
  } catch (error) {
    console.error("Error loading custom networks:", error);
    return [];
  }
};

// Save custom networks to localStorage
const saveCustomNetworks = (networks: NetworkConfig[]) => {
  try {
    localStorage.setItem('customNetworks', JSON.stringify(networks));
  } catch (error) {
    console.error("Error saving custom networks:", error);
  }
};

const NetworkSelector = ({ onNetworkChange }: NetworkSelectionProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [networkMode, setNetworkMode] = useState("testnet");
  const [customNetworks, setCustomNetworks] = useState<NetworkConfig[]>(getCustomNetworks());
  const [showAddNetworkDialog, setShowAddNetworkDialog] = useState(false);
  const [newNetwork, setNewNetwork] = useState<Partial<NetworkConfig>>({
    name: "",
    id: "",
    chainId: 0,
    symbol: "ETH",
    rpcUrl: "",
    explorer: "",
    imageUrl: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Get networks from the config
  const TESTNETS = Object.values(getTestnets());
  const MAINNETS = Object.values(getMainnets());

  // Forward selected network to parent component
  useEffect(() => {
    if (selectedNetwork) {
      onNetworkChange(selectedNetwork);
    }
  }, [selectedNetwork, onNetworkChange]);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
  };

  const openAddNetworkDialog = () => {
    setNewNetwork({
      name: "",
      id: "",
      chainId: 0,
      symbol: "ETH",
      rpcUrl: "",
      explorer: "",
      imageUrl: ""
    });
    setFormErrors({});
    setShowAddNetworkDialog(true);
  };

  const validateNetworkForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newNetwork.name) errors.name = "Name is required";
    if (!newNetwork.id) errors.id = "ID is required";
    if (!newNetwork.chainId || newNetwork.chainId <= 0) errors.chainId = "Valid Chain ID is required";
    if (!newNetwork.rpcUrl) errors.rpcUrl = "RPC URL is required";
    if (!newNetwork.explorer) errors.explorer = "Explorer URL is required";
    
    const allNetworks = getAllNetworks();
    if (allNetworks[newNetwork.id || ""] || customNetworks.some(n => n.id === newNetwork.id)) {
      errors.id = "Network ID already exists";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addCustomNetwork = () => {
    if (!validateNetworkForm()) return;
    
    const networkToAdd: NetworkConfig = {
      id: newNetwork.id!,
      name: newNetwork.name!,
      chainId: newNetwork.chainId!,
      symbol: newNetwork.symbol || "ETH",
      rpcUrl: newNetwork.rpcUrl!,
      explorer: newNetwork.explorer!,
      imageUrl: newNetwork.imageUrl || "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png"
    };
    
    const updatedNetworks = [...customNetworks, networkToAdd];
    setCustomNetworks(updatedNetworks);
    saveCustomNetworks(updatedNetworks);
    setShowAddNetworkDialog(false);
  };

  return (
    <div>
      <Tabs defaultValue="testnet" className="w-full" onValueChange={setNetworkMode}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="testnet">Testnet</TabsTrigger>
          <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="testnet" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TESTNETS.map((network) => (
              <Card
                key={network.id}
                className={`p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNetwork === network.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                }`}
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={network.imageUrl}
                      alt={network.name}
                    />
                    <AvatarFallback>
                      {network.symbol.substring(0, 3)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-sm font-medium text-center">{network.name}</span>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mainnet" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MAINNETS.map((network) => (
              <Card
                key={network.id}
                className={`p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNetwork === network.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                }`}
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={network.imageUrl}
                      alt={network.name}
                    />
                    <AvatarFallback>
                      {network.symbol.substring(0, 3)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-sm font-medium text-center">{network.name}</span>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {customNetworks.map((network) => (
              <Card
                key={network.id}
                className={`p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNetwork === network.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                }`}
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={network.imageUrl}
                      alt={network.name}
                    />
                    <AvatarFallback>
                      {network.symbol.substring(0, 3)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-sm font-medium text-center">{network.name}</span>
              </Card>
            ))}
            
            {/* Add New Network Card */}
            <Card
              className="p-3 flex flex-col items-center justify-center cursor-pointer border border-dashed border-border/50 hover:border-primary/50"
              onClick={openAddNetworkDialog}
            >
              <div className="h-12 w-12 flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-center">Add Network</span>
            </Card>
          </div>
          
          {customNetworks.length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              No custom networks added yet. Click the "Add Network" card to create one.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add New Network Dialog */}
      <Dialog open={showAddNetworkDialog} onOpenChange={setShowAddNetworkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Network</DialogTitle>
            <DialogDescription>
              Enter the details of your custom blockchain network
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="networkName">Network Name</Label>
              <Input
                id="networkName"
                placeholder="My Custom Network"
                value={newNetwork.name || ""}
                onChange={(e) => setNewNetwork({...newNetwork, name: e.target.value})}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="networkId">Network ID</Label>
              <Input
                id="networkId"
                placeholder="custom_testnet"
                value={newNetwork.id || ""}
                onChange={(e) => setNewNetwork({...newNetwork, id: e.target.value})}
                className={formErrors.id ? "border-red-500" : ""}
              />
              {formErrors.id && <p className="text-xs text-red-500">{formErrors.id}</p>}
              <p className="text-xs text-muted-foreground">
                A unique identifier, e.g., "custom_testnet"
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="chainId">Chain ID</Label>
              <Input
                id="chainId"
                type="number"
                placeholder="12345"
                value={newNetwork.chainId || ""}
                onChange={(e) => setNewNetwork({...newNetwork, chainId: parseInt(e.target.value) || 0})}
                className={formErrors.chainId ? "border-red-500" : ""}
              />
              {formErrors.chainId && <p className="text-xs text-red-500">{formErrors.chainId}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                placeholder="ETH"
                value={newNetwork.symbol || ""}
                onChange={(e) => setNewNetwork({...newNetwork, symbol: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="rpcUrl">RPC URL</Label>
              <Input
                id="rpcUrl"
                placeholder="https://rpc.example.com"
                value={newNetwork.rpcUrl || ""}
                onChange={(e) => setNewNetwork({...newNetwork, rpcUrl: e.target.value})}
                className={formErrors.rpcUrl ? "border-red-500" : ""}
              />
              {formErrors.rpcUrl && <p className="text-xs text-red-500">{formErrors.rpcUrl}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="explorer">Block Explorer URL</Label>
              <Input
                id="explorer"
                placeholder="https://explorer.example.com/tx/"
                value={newNetwork.explorer || ""}
                onChange={(e) => setNewNetwork({...newNetwork, explorer: e.target.value})}
                className={formErrors.explorer ? "border-red-500" : ""}
              />
              {formErrors.explorer && <p className="text-xs text-red-500">{formErrors.explorer}</p>}
              <p className="text-xs text-muted-foreground">
                Make sure to include /tx/ at the end for transaction links
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Network Image URL (GitHub)</Label>
              <Input
                id="imageUrl"
                placeholder="https://raw.githubusercontent.com/username/repo/main/image.png"
                value={newNetwork.imageUrl || ""}
                onChange={(e) => setNewNetwork({...newNetwork, imageUrl: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Enter a GitHub raw URL to your network's logo image (must start with https://raw.githubusercontent.com/)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNetworkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addCustomNetwork}>
              Add Network
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkSelector;
