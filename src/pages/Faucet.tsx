
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

const NETWORKS = [
  { id: "ethereum", name: "Ethereum Sepolia", symbol: "ETH" },
  { id: "polygon", name: "Polygon Mumbai", symbol: "MATIC" },
  { id: "arbitrum", name: "Arbitrum Testnet", symbol: "ARB" },
  { id: "optimism", name: "Optimism Testnet", symbol: "OP" },
  { id: "base", name: "Base Testnet", symbol: "ETH" },
];

const Faucet = () => {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [txDetails, setTxDetails] = useState<{
    txHash: string;
    amount: string;
    network: string;
    symbol: string;
    explorerUrl: string;
  } | null>(null);
  const { toast } = useToast();

  // Function to validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleClaim = async () => {
    // Validate inputs
    if (!address || !network) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidAddress(address)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid wallet address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTxDetails(null);

    try {
      // Call the Supabase Edge Function to handle the token sending
      const { data, error } = await supabase.functions.invoke('send-tokens', {
        body: {
          address,
          network,
          reason: reason || "No reason provided"
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        if (data.cooldown) {
          setCooldown(true);
        }
        throw new Error(data.message || data.error);
      }

      // Set transaction details for display
      setTxDetails({
        txHash: data.txHash,
        amount: data.amount,
        network: data.network,
        symbol: data.symbol,
        explorerUrl: data.explorerUrl
      });

      // Success message
      toast({
        title: "Transaction sent!",
        description: `You've sent ${data.amount} ${data.symbol} on ${data.network}`,
      });

      // Reset form
      setAddress("");
      setNetwork("");
      setReason("");
      
    } catch (error) {
      console.error("Faucet claim error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Testnet Faucet</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Get testnet tokens for development and testing purposes. 
          Each request provides 0.001 tokens with a 24-hour cooldown period.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="space-y-4">
            <div>
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input 
                id="wallet-address"
                placeholder="0x..." 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="network">Select Network</Label>
              <Select 
                value={network} 
                onValueChange={setNetwork}
              >
                <SelectTrigger id="network" className="mt-1">
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.map((net) => (
                    <SelectItem key={net.id} value={net.id}>
                      {net.name} ({net.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="reason" className="flex justify-between">
                <span>Reason for request</span>
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea 
                id="reason"
                placeholder="What are you building or testing?" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleClaim} 
              disabled={loading || cooldown}
              className="w-full mt-2" 
              size="lg"
            >
              {loading ? "Processing..." : "Claim Tokens"}
            </Button>

            {txDetails && (
              <div className="mt-4 p-4 bg-muted rounded-md border">
                <h3 className="font-medium mb-2">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Amount:</span> {txDetails.amount} {txDetails.symbol}
                  </p>
                  <p>
                    <span className="font-medium">Network:</span> {txDetails.network}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium">Transaction:</span> 
                    <a 
                      href={txDetails.explorerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      View on explorer <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Transaction may take a few minutes to complete.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-5 border shadow-sm">
            <h3 className="font-medium mb-2">About Testnet Tokens</h3>
            <p className="text-sm text-muted-foreground">
              These tokens have no real value and are only for testing smart contracts and applications on test networks.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-5 border shadow-sm">
            <h3 className="font-medium mb-2">Request Limits</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• One request per network every 24 hours</li>
              <li>• 0.001 tokens per request</li>
              <li>• Please use responsibly</li>
            </ul>
          </div>
          
          <div className="bg-card rounded-lg p-5 border shadow-sm">
            <h3 className="font-medium mb-2">Need More Tokens?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              For larger amounts, please consider using official network faucets:
            </p>
            <ul className="text-sm text-primary space-y-1">
              <li>• <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Sepolia Faucet</a></li>
              <li>• <a href="https://mumbaifaucet.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Mumbai Faucet</a></li>
              <li>• <a href="https://faucet.paradigm.xyz/" target="_blank" rel="noopener noreferrer" className="hover:underline">Paradigm Faucet</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-muted-foreground">
        <p>
          This faucet is provided as a community service. If you find it useful, 
          consider contributing to our project or donating to keep the faucet running.
        </p>
      </div>
    </div>
  );
};

export default Faucet;
