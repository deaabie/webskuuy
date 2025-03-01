
import { useState, useEffect } from "react";
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
import { supabase, NETWORK_CONFIG, FAUCET_PRIVATE_KEY, CLAIM_AMOUNT } from "@/integrations/supabase/client";
import { NetworkConfig } from "./types";
import TransactionDetails from "./TransactionDetails";

// Add ethers.js for wallet functionality
<lov-add-dependency>ethers@6.8.1</lov-add-dependency>
import { ethers } from "ethers";

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

  // Function to check if user is in cooldown period
  const checkCooldown = async (address: string, network: string) => {
    try {
      const { data: existingClaims, error } = await supabase
        .from('faucet_claims')
        .select('created_at, tx_hash')
        .eq('address', address.toLowerCase())
        .eq('network', network)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching existing claims:', error);
        return false;
      }

      // Check cooldown period (24 hours)
      if (existingClaims && existingClaims.length > 0) {
        const lastClaim = new Date(existingClaims[0].created_at);
        const cooldownTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
        
        if (cooldownTime > new Date()) {
          const timeLeftHours = Math.ceil((cooldownTime.getTime() - new Date().getTime()) / (1000 * 60 * 60));
          toast({
            title: "Cooldown period active",
            description: `You can claim again in approximately ${timeLeftHours} hours`,
            variant: "destructive",
          });
          setCooldown(true);
          return true;
        }
      }
      
      setCooldown(false);
      return false;
    } catch (error) {
      console.error("Error checking cooldown:", error);
      return false;
    }
  };

  // Function to send transaction directly from the frontend
  const sendTransaction = async (to: string, networkId: string) => {
    try {
      const networkConfig = NETWORK_CONFIG[networkId];
      if (!networkConfig) {
        throw new Error("Invalid network selected");
      }

      // Create provider with the selected network
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
      
      // Create wallet with private key
      // WARNING: This is insecure for production use!
      const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);
      
      // Check wallet balance
      const balance = await provider.getBalance(wallet.address);
      if (balance < ethers.parseEther(CLAIM_AMOUNT)) {
        throw new Error(`Insufficient funds in faucet wallet for ${networkConfig.name}`);
      }

      // Send transaction
      console.log(`Sending ${CLAIM_AMOUNT} ${networkConfig.symbol} to ${to} on ${networkConfig.name}`);
      
      const tx = await wallet.sendTransaction({
        to: to,
        value: ethers.parseEther(CLAIM_AMOUNT),
      });

      console.log(`Transaction sent: ${tx.hash}`);
      
      // Record the claim in the database
      const { error: insertError } = await supabase
        .from('faucet_claims')
        .insert([
          { 
            address: to.toLowerCase(), 
            network: networkId,
            reason: reason || "No reason provided",
            tx_hash: tx.hash,
            amount: CLAIM_AMOUNT,
            status: 'pending'
          }
        ]);

      if (insertError) {
        console.error('Error recording claim:', insertError);
      }

      // Wait for transaction receipt in background
      tx.wait().then(receipt => {
        // Update transaction status in database
        supabase
          .from('faucet_claims')
          .update({ status: 'completed' })
          .eq('tx_hash', tx.hash)
          .then(({ error }) => {
            if (error) console.error('Error updating transaction status:', error);
          });
      }).catch(error => {
        console.error('Error waiting for transaction:', error);
        // Update status to failed
        supabase
          .from('faucet_claims')
          .update({ status: 'failed' })
          .eq('tx_hash', tx.hash)
          .then(({ error }) => {
            if (error) console.error('Error updating transaction status:', error);
          });
      });

      return {
        txHash: tx.hash,
        amount: CLAIM_AMOUNT,
        network: networkConfig.name,
        symbol: networkConfig.symbol,
        explorerUrl: networkConfig.explorer + tx.hash
      };
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
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
      // Check cooldown period
      const inCooldown = await checkCooldown(address, network);
      if (inCooldown) {
        setLoading(false);
        return;
      }

      // Send tokens directly
      const result = await sendTransaction(address, network);
      
      // Set transaction details for display
      setTxDetails({
        txHash: result.txHash,
        amount: result.amount,
        network: result.network,
        symbol: result.symbol,
        explorerUrl: result.explorerUrl
      });

      // Success message
      toast({
        title: "Transaction sent!",
        description: `You've sent ${result.amount} ${result.symbol} on ${result.network}`,
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
