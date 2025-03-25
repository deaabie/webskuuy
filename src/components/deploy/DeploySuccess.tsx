
import { Button } from "../ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { NETWORK_CONFIG } from "@/config/faucet-config";

interface DeploySuccessProps {
  txHash: string;
  network: string;
  contractAddress: string;
}

const DeploySuccess = ({ txHash, network, contractAddress }: DeploySuccessProps) => {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [explorerUrls, setExplorerUrls] = useState({
    tx: "",
    address: ""
  });
  const [networkSymbol, setNetworkSymbol] = useState("ETH");

  useEffect(() => {
    // Set the explorer URLs when component mounts or network/txHash/address changes
    const urls = getExplorerUrls();
    setExplorerUrls(urls);
    
    // Get the network symbol
    const symbol = getNetworkSymbol();
    setNetworkSymbol(symbol);
  }, [network, txHash, contractAddress]);

  const copyToClipboard = (text: string, type: 'tx' | 'address') => {
    navigator.clipboard.writeText(text);
    
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
    
    toast({
      title: "Copied to clipboard",
      description: `${type === 'tx' ? 'Transaction hash' : 'Contract address'} has been copied to clipboard`,
    });
  };

  const getNetworkSymbol = (): string => {
    // Try to find network in predefined networks first
    if (network && NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG]) {
      return NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG].symbol;
    }
    
    // Try to find network in custom networks from localStorage
    const customNetworksStr = localStorage.getItem('customNetworks');
    if (customNetworksStr) {
      try {
        const customNetworks = JSON.parse(customNetworksStr);
        const customNetwork = customNetworks.find((n: any) => n.id === network);
        
        if (customNetwork && customNetwork.symbol) {
          return customNetwork.symbol;
        }
      } catch (e) {
        console.error('Failed to parse custom networks', e);
      }
    }

    // Default to ETH for unknown networks
    return "ETH";
  };

  const getExplorerUrls = () => {
    let txUrl = "";
    let addressUrl = "";

    // Try to find network in predefined networks first
    if (network && NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG]) {
      const networkConfig = NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG];
      
      let explorerBase = networkConfig.explorer;
      // Make sure explorer URL ends with /
      if (!explorerBase.endsWith('/')) {
        explorerBase = `${explorerBase}/`;
      }
      
      txUrl = `${explorerBase}${txHash}`;
      // For address URL, replace tx/ with address/ if present, otherwise add address/
      if (explorerBase.includes('tx/')) {
        addressUrl = explorerBase.replace('tx/', 'address/') + contractAddress;
      } else {
        addressUrl = `${explorerBase}address/${contractAddress}`;
      }
      
      console.log("Using predefined network explorer:", network, explorerBase);
      return { tx: txUrl, address: addressUrl };
    }
    
    // Try to find network in custom networks from localStorage
    const customNetworksStr = localStorage.getItem('customNetworks');
    if (customNetworksStr) {
      try {
        const customNetworks = JSON.parse(customNetworksStr);
        const customNetwork = customNetworks.find((n: any) => n.id === network);
        
        if (customNetwork && customNetwork.explorer) {
          // Make sure explorer URL ends with /
          let explorerBase = customNetwork.explorer;
          if (!explorerBase.endsWith('/')) {
            explorerBase = `${explorerBase}/`;
          }
          
          // Handle different explorer URL formats
          if (explorerBase.endsWith('tx/')) {
            txUrl = `${explorerBase}${txHash}`;
            addressUrl = `${explorerBase.replace('tx/', 'address/')}${contractAddress}`;
          } else {
            txUrl = `${explorerBase}tx/${txHash}`;
            addressUrl = `${explorerBase}address/${contractAddress}`;
          }
          
          console.log("Using custom network explorer:", network, explorerBase);
          return { tx: txUrl, address: addressUrl };
        }
      } catch (e) {
        console.error('Failed to parse custom networks', e);
      }
    }

    // Fallback to common blockchain explorers based on network ID patterns
    if (network) {
      // Handle different network types
      if (network.includes('ethereum') || network === 'ethereum_mainnet' || network === 'ethereum_sepolia' || network === 'ethereum_holesky') {
        const subdomain = network.includes('sepolia') ? 'sepolia.' : 
                          network.includes('holesky') ? 'holesky.' : '';
        txUrl = `https://${subdomain}etherscan.io/tx/${txHash}`;
        addressUrl = `https://${subdomain}etherscan.io/address/${contractAddress}`;
      } else if (network.includes('optimism') || network === 'optimism_mainnet' || network === 'optimism_sepolia') {
        const subdomain = network.includes('sepolia') ? 'sepolia-optimism.' : 'optimistic.';
        txUrl = `https://${subdomain}etherscan.io/tx/${txHash}`;
        addressUrl = `https://${subdomain}etherscan.io/address/${contractAddress}`;
      } else if (network.includes('arbitrum') || network === 'arbitrum_mainnet' || network === 'arbitrum_sepolia') {
        const subdomain = network.includes('sepolia') ? 'sepolia.' : '';
        txUrl = `https://${subdomain}arbiscan.io/tx/${txHash}`;
        addressUrl = `https://${subdomain}arbiscan.io/address/${contractAddress}`;
      } else if (network.includes('base') || network === 'base_mainnet' || network === 'base_sepolia') {
        const subdomain = network.includes('sepolia') ? 'sepolia.' : '';
        txUrl = `https://${subdomain}basescan.org/tx/${txHash}`;
        addressUrl = `https://${subdomain}basescan.org/address/${contractAddress}`;
      } else if (network.includes('blast') || network === 'blast_mainnet' || network === 'blast_sepolia') {
        const subdomain = network.includes('sepolia') ? 'sepolia.' : '';
        txUrl = `https://${subdomain}blastscan.io/tx/${txHash}`;
        addressUrl = `https://${subdomain}blastscan.io/address/${contractAddress}`;
      } else if (network.includes('Citrea')) {
        txUrl = `https://explorer.testnet.citrea.xyz/tx/${txHash}`;
        addressUrl = `https://explorer.testnet.citrea.xyz/address/${contractAddress}`;
      } else {
        // Default to Ethereum for unknown networks
        txUrl = `https://etherscan.io/tx/${txHash}`;
        addressUrl = `https://etherscan.io/address/${contractAddress}`;
      }
      
      console.log("Using fallback explorer for network:", network);
    }

    return { tx: txUrl, address: addressUrl };
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-center">Contract Deployed Successfully!</h2>
      
      <div className="w-full space-y-4">
        <div className="w-full bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Transaction Hash:</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(txHash, 'tx')}
              className="h-6 px-2"
            >
              {copiedTx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-1 break-all font-mono text-sm">{txHash || "N/A"}</div>
        </div>
        
        <div className="w-full bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contract Address:</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(contractAddress, 'address')}
              className="h-6 px-2"
            >
              {copiedAddress ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-1 break-all font-mono text-sm">{contractAddress || "N/A"}</div>
        </div>
        
        <div className="w-full bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Network Currency:</span>
          </div>
          <div className="mt-1 font-mono text-sm">{networkSymbol}</div>
        </div>
        
        <div className="w-full space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              if (explorerUrls.tx) {
                console.log("Opening transaction URL:", explorerUrls.tx);
                window.open(explorerUrls.tx, '_blank');
              } else {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Could not generate transaction URL",
                });
              }
            }}
            disabled={!txHash || !explorerUrls.tx}
          >
            View Transaction <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              if (explorerUrls.address) {
                console.log("Opening contract URL:", explorerUrls.address);
                window.open(explorerUrls.address, '_blank');
              } else {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Could not generate contract URL",
                });
              }
            }}
            disabled={!contractAddress || !explorerUrls.address}
          >
            View Contract <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Deploy Another Contract
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeploySuccess;
