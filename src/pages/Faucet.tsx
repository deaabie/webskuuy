
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

    try {
      // Check for recent claims from the same address
      const { data: existingClaims, error: fetchError } = await supabase
        .from('faucet_claims')
        .select('created_at')
        .eq('address', address.toLowerCase())
        .eq('network', network)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      // Check cooldown period (24 hours)
      if (existingClaims && existingClaims.length > 0) {
        const lastClaim = new Date(existingClaims[0].created_at);
        const cooldownTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
        
        if (cooldownTime > new Date()) {
          const timeLeft = Math.ceil((cooldownTime.getTime() - new Date().getTime()) / (1000 * 60 * 60));
          setCooldown(true);
          toast({
            title: "Cooldown period",
            description: `You can claim again in approximately ${timeLeft} hours`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Record the claim attempt
      const { error: insertError } = await supabase
        .from('faucet_claims')
        .insert([
          { 
            address: address.toLowerCase(), 
            network, 
            reason: reason || "No reason provided" 
          }
        ]);

      if (insertError) throw insertError;

      // Simulating token sending - in a real app, this would connect to a blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success message
      const selectedNetwork = NETWORKS.find(n => n.id === network);
      toast({
        title: "Tokens sent!",
        description: `You've received test ${selectedNetwork?.symbol} on ${selectedNetwork?.name}`,
      });

      // Reset form
      setAddress("");
      setNetwork("");
      setReason("");
      
    } catch (error) {
      console.error("Faucet claim error:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again later.",
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
          Please only request what you need and remember there's a 24-hour cooldown period.
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
              <li>• Maximum 5 tokens per request</li>
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
