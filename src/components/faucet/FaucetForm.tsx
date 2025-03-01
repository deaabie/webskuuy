
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
import { NetworkConfig } from "./types";
import TransactionDetails from "./TransactionDetails";

interface FaucetFormProps {
  networks: NetworkConfig[];
}

const FaucetForm = ({ networks }: FaucetFormProps) => {
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
              {networks.map((net) => (
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

        {txDetails && <TransactionDetails details={txDetails} />}
      </div>
    </div>
  );
};

export default FaucetForm;
