
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RotateCw, Settings, Plus, Chain, Link } from 'lucide-react';

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
  base_mainnet: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/logo-blue.svg",
  base_sepolia: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/logo-blue.svg",
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

// Save network images to localStorage
const saveNetworkImages = (images: NetworkImage) => {
  try {
    localStorage.setItem('networkImages', JSON.stringify(images));
  } catch (error) {
    console.error("Error saving network images:", error);
  }
};

const NetworkSelector = ({ onNetworkChange }: NetworkSelectionProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [networkMode, setNetworkMode] = useState("testnet");
  const [customNetworks, setCustomNetworks] = useState<NetworkConfig[]>([]);
  const [networkImages, setNetworkImages] = useState<NetworkImage>(getNetworkImages());
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentNetworkId, setCurrentNetworkId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [customNetworkDialog, setCustomNetworkDialog] = useState(false);
  const [isImageTested, setIsImageTested] = useState(false);
  const [imageTestResult, setImageTestResult] = useState(true);

  // Apply network images to networks
  const testnetsWithImages = TESTNETS.map(network => ({
    ...network,
    imagePath: networkImages[network.id] || network.imagePath
  }));
  
  const mainnetsWithImages = MAINNETS.map(network => ({
    ...network,
    imagePath: networkImages[network.id] || network.imagePath
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

  const handleNetworkImageChange = (networkId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentNetworkId(networkId);
    setImageUrl(networkImages[networkId] || "");
    setImageError(null);
    setIsImageTested(false);
    setShowImageDialog(true);
  };

  const validateImageUrl = (url: string): boolean => {
    // Check if URL is empty
    if (!url) {
      setImageError("Image URL cannot be empty");
      return false;
    }

    // Check if URL is valid
    try {
      new URL(url);
    } catch (e) {
      setImageError("Invalid URL format");
      return false;
    }

    // Clear any previous errors
    setImageError(null);
    return true;
  };

  const testImageUrl = () => {
    if (validateImageUrl(imageUrl)) {
      // Create a test image to check if the URL is valid
      const img = new Image();
      img.onload = () => {
        setImageTestResult(true);
        setIsImageTested(true);
        setImageError(null);
      };
      img.onerror = () => {
        setImageTestResult(false);
        setIsImageTested(true);
        setImageError("Image couldn't be loaded. The URL might be invalid or the server doesn't allow direct access.");
      };
      img.src = imageUrl;
    }
  };

  const saveNetworkImage = () => {
    if (validateImageUrl(imageUrl)) {
      setNetworkImages({
        ...networkImages,
        [currentNetworkId]: imageUrl
      });
      setShowImageDialog(false);
    }
  };

  const resetNetworkImage = () => {
    // Reset to default image for this network
    const updatedImages = { ...networkImages };
    delete updatedImages[currentNetworkId];
    setNetworkImages(updatedImages);
    setShowImageDialog(false);
  };

  return (
    <div>
      <Tabs defaultValue="testnet" className="w-full" onValueChange={setNetworkMode}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="testnet">Testnet</TabsTrigger>
          <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
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
                  onClick={(e) => handleNetworkImageChange(network.id, e)}
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
                  onClick={(e) => handleNetworkImageChange(network.id, e)}
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
      </Tabs>

      {/* Dialog for changing network image */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Network Icon</DialogTitle>
            <DialogDescription>
              Enter a URL to the network icon image. GitHub raw URLs work best for consistent access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setIsImageTested(false);
                }}
                placeholder="https://raw.githubusercontent.com/..."
                className={imageError ? "border-red-500" : ""}
              />
              {imageError && (
                <p className="text-xs text-red-500">{imageError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Example: https://raw.githubusercontent.com/user/repo/main/image.png
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testImageUrl}
                className="mt-1"
              >
                <RotateCw className="h-3 w-3 mr-2" /> Test URL
              </Button>
            </div>
            {isImageTested && imageTestResult && (
              <div className="flex justify-center">
                <div className="border border-border rounded-md p-2 bg-muted/50 max-w-[100px]">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-16 max-w-16 object-contain mx-auto"
                  />
                  <p className="text-xs text-green-500 text-center mt-2">Image loaded successfully!</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={resetNetworkImage}
              className="mr-auto"
            >
              Reset to Default
            </Button>
            <div>
              <Button variant="outline" onClick={() => setShowImageDialog(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={saveNetworkImage} disabled={imageError !== null}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkSelector;
