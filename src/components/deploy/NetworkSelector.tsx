
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCw, Settings, Plus, Link } from 'lucide-react';

// Define network types and interfaces
interface NetworkImage {
  [key: string]: string;
}

interface NetworkConfig {
  id: string;
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorer: string;
  imagePath?: string;
}

interface NetworkSelectionProps {
  onNetworkChange: (networkId: string) => void;
}

// Default network image paths (can be overridden by custom images)
const DEFAULT_NETWORK_IMAGES: NetworkImage = {
  ethereum_mainnet: "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-black.png",
  ethereum_sepolia: "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png",
  ethereum_goerli: "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png",
  ethereum_holesky: "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/assets/eth-diamond-purple.png",
  optimism_mainnet: "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/optimism-logo.svg",
  optimism_sepolia: "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/optimism-logo.svg",
  arbitrum_mainnet: "https://raw.githubusercontent.com/OffchainLabs/arbitrum-token/main/arbitrum-token-logo.png",
  arbitrum_sepolia: "https://raw.githubusercontent.com/OffchainLabs/arbitrum-token/main/arbitrum-token-logo.png",
  base_mainnet: "https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png",
  base_sepolia: "https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png",
  blast_mainnet: "https://raw.githubusercontent.com/blastapi/blast-brand-assets/main/Branding%20Assets/Blast%20Logo%20-%20Black%20Wordmark%20-%20RGB.png",
  blast_sepolia: "https://raw.githubusercontent.com/blastapi/blast-brand-assets/main/Branding%20Assets/Blast%20Logo%20-%20Black%20Wordmark%20-%20RGB.png",
};

// Default network configurations
const TESTNETS: NetworkConfig[] = [
  {
    id: "ethereum_sepolia",
    chainId: 11155111,
    name: "Ethereum Sepolia",
    symbol: "ETH",
    rpcUrl: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.ethereum_sepolia
  },
  {
    id: "ethereum_holesky",
    chainId: 17000,
    name: "Ethereum Holesky",
    symbol: "ETH",
    rpcUrl: "https://ethereum-holesky.publicnode.com",
    explorer: "https://holesky.etherscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.ethereum_holesky
  },
  {
    id: "base_sepolia",
    chainId: 84532,
    name: "Base Sepolia",
    symbol: "ETH",
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.base_sepolia
  },
  {
    id: "optimism_sepolia",
    chainId: 11155420,
    name: "Optimism Sepolia",
    symbol: "ETH",
    rpcUrl: "https://sepolia.optimism.io",
    explorer: "https://sepolia-optimism.etherscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.optimism_sepolia
  },
  {
    id: "arbitrum_sepolia",
    chainId: 421614,
    name: "Arbitrum Sepolia",
    symbol: "ETH",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.arbitrum_sepolia
  },
  {
    id: "blast_sepolia",
    chainId: 168587773,
    name: "Blast Sepolia",
    symbol: "ETH",
    rpcUrl: "https://sepolia.blast.io",
    explorer: "https://sepolia.blastscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.blast_sepolia
  },
];

const MAINNETS: NetworkConfig[] = [
  {
    id: "ethereum_mainnet",
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://eth.public-rpc.com",
    explorer: "https://etherscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.ethereum_mainnet
  },
  {
    id: "optimism_mainnet",
    chainId: 10,
    name: "Optimism",
    symbol: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.optimism_mainnet
  },
  {
    id: "arbitrum_mainnet",
    chainId: 42161,
    name: "Arbitrum",
    symbol: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.arbitrum_mainnet
  },
  {
    id: "base_mainnet",
    chainId: 8453,
    name: "Base",
    symbol: "ETH",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.base_mainnet
  },
  {
    id: "blast_mainnet",
    chainId: 81457,
    name: "Blast",
    symbol: "ETH",
    rpcUrl: "https://rpc.blast.io",
    explorer: "https://blastscan.io/tx/",
    imagePath: DEFAULT_NETWORK_IMAGES.blast_mainnet
  },
];

// Save network images to localStorage
const saveNetworkImages = (images: NetworkImage) => {
  try {
    localStorage.setItem('networkImages', JSON.stringify(images));
  } catch (error) {
    console.error("Error saving network images:", error);
  }
};

// Get network images from localStorage or use defaults
const getNetworkImages = (): NetworkImage => {
  try {
    const savedImages = localStorage.getItem('networkImages');
    return savedImages ? JSON.parse(savedImages) : DEFAULT_NETWORK_IMAGES;
  } catch (error) {
    console.error("Error loading network images:", error);
    return DEFAULT_NETWORK_IMAGES;
  }
};

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
  const [networkImages, setNetworkImages] = useState<NetworkImage>(getNetworkImages());
  const [currentNetworkId, setCurrentNetworkId] = useState("");
  const [networkImageUrl, setNetworkImageUrl] = useState("");
  const [networkRpcUrl, setNetworkRpcUrl] = useState("");
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [imageTested, setImageTested] = useState(false);
  const [imageTestSuccess, setImageTestSuccess] = useState(false);
  const [showAddNetworkDialog, setShowAddNetworkDialog] = useState(false);
  const [newNetwork, setNewNetwork] = useState<Partial<NetworkConfig>>({
    name: "",
    id: "",
    chainId: 0,
    symbol: "ETH",
    rpcUrl: "",
    explorer: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Apply network images to networks
  const testnetsWithImages = TESTNETS.map(network => ({
    ...network,
    imagePath: networkImages[network.id] || network.imagePath
  }));
  
  const mainnetsWithImages = MAINNETS.map(network => ({
    ...network,
    imagePath: networkImages[network.id] || network.imagePath
  }));

  const customNetworksWithImages = customNetworks.map(network => ({
    ...network,
    imagePath: networkImages[network.id] || "https://placehold.co/40x40/svg?text=NET"
  }));

  // Save custom network images when changed
  useEffect(() => {
    saveNetworkImages(networkImages);
  }, [networkImages]);

  // Forward selected network to parent component
  useEffect(() => {
    if (selectedNetwork) {
      onNetworkChange(selectedNetwork);
    }
  }, [selectedNetwork, onNetworkChange]);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
  };

  const openNetworkSettings = (networkId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // Find network in all network lists
    const allNetworks = [...TESTNETS, ...MAINNETS, ...customNetworks];
    const network = allNetworks.find(n => n.id === networkId);
    
    if (network) {
      setCurrentNetworkId(networkId);
      setNetworkImageUrl(networkImages[networkId] || network.imagePath || "");
      setNetworkRpcUrl(network.rpcUrl || "");
      setImageTested(false);
      setImageTestSuccess(false);
      setShowNetworkDialog(true);
    }
  };

  const testImageUrl = () => {
    if (!networkImageUrl) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageTested(true);
      setImageTestSuccess(true);
    };
    img.onerror = () => {
      setImageTested(true);
      setImageTestSuccess(false);
    };
    img.src = networkImageUrl;
  };

  const saveNetworkSettings = () => {
    // Only update image if it was provided
    if (networkImageUrl) {
      setNetworkImages({
        ...networkImages,
        [currentNetworkId]: networkImageUrl
      });
    }

    // For custom networks, also update RPC URL
    if (customNetworks.some(n => n.id === currentNetworkId) && networkRpcUrl) {
      const updatedNetworks = customNetworks.map(n => 
        n.id === currentNetworkId ? { ...n, rpcUrl: networkRpcUrl } : n
      );
      setCustomNetworks(updatedNetworks);
      saveCustomNetworks(updatedNetworks);
    }

    setShowNetworkDialog(false);
  };

  const openAddNetworkDialog = () => {
    setNewNetwork({
      name: "",
      id: "",
      chainId: 0,
      symbol: "ETH",
      rpcUrl: "",
      explorer: ""
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
    
    const existingIds = [...TESTNETS, ...MAINNETS, ...customNetworks].map(n => n.id);
    if (existingIds.includes(newNetwork.id || "")) {
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
            {testnetsWithImages.map((network) => (
              <Card
                key={network.id}
                className={`relative p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNetwork === network.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                }`}
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div 
                  className="absolute top-1 right-1 p-1 rounded-full hover:bg-muted"
                  onClick={(e) => openNetworkSettings(network.id, e)}
                >
                  <Settings className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <img
                    src={network.imagePath}
                    alt={network.name}
                    className="max-h-10 max-w-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/40x40/svg?text=ETH";
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-center">{network.name}</span>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mainnet" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mainnetsWithImages.map((network) => (
              <Card
                key={network.id}
                className={`relative p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNetwork === network.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                }`}
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div 
                  className="absolute top-1 right-1 p-1 rounded-full hover:bg-muted"
                  onClick={(e) => openNetworkSettings(network.id, e)}
                >
                  <Settings className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <img
                    src={network.imagePath}
                    alt={network.name}
                    className="max-h-10 max-w-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/40x40/svg?text=ETH";
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-center">{network.name}</span>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {customNetworksWithImages.map((network) => (
              <Card
                key={network.id}
                className={`relative p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNetwork === network.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                }`}
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div 
                  className="absolute top-1 right-1 p-1 rounded-full hover:bg-muted"
                  onClick={(e) => openNetworkSettings(network.id, e)}
                >
                  <Settings className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <img
                    src={network.imagePath}
                    alt={network.name}
                    className="max-h-10 max-w-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/40x40/svg?text=NET";
                    }}
                  />
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

      {/* Network Settings Dialog */}
      <Dialog open={showNetworkDialog} onOpenChange={setShowNetworkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Network Settings</DialogTitle>
            <DialogDescription>
              Customize this network's image and RPC URL
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="networkImageUrl">GitHub Image URL</Label>
              <Input
                id="networkImageUrl"
                placeholder="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/images/network.png"
                value={networkImageUrl}
                onChange={(e) => {
                  setNetworkImageUrl(e.target.value);
                  setImageTested(false);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Enter a GitHub raw URL to your network's logo image
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testImageUrl}
                className="mt-1"
                disabled={!networkImageUrl}
              >
                <RotateCw className="h-3 w-3 mr-2" /> Test Image URL
              </Button>
              
              {imageTested && (
                <div className="flex justify-center items-center">
                  {imageTestSuccess ? (
                    <div className="text-green-500 text-sm flex items-center">
                      <div className="p-1 bg-green-100 rounded-full mr-2">✓</div>
                      Image loads successfully!
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm flex items-center">
                      <div className="p-1 bg-red-100 rounded-full mr-2">✕</div>
                      Failed to load image from URL
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {customNetworks.some(n => n.id === currentNetworkId) && (
              <div className="grid gap-2 mt-2">
                <Label htmlFor="networkRpcUrl">RPC URL</Label>
                <Input
                  id="networkRpcUrl"
                  placeholder="https://your-custom-rpc.example.com"
                  value={networkRpcUrl}
                  onChange={(e) => setNetworkRpcUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can update the RPC URL for custom networks
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNetworkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveNetworkSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
