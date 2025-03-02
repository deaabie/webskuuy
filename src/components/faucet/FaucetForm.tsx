
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
import { NetworkConfig } from "./types";
import TransactionDetails from "./TransactionDetails";
import { faucetService } from "@/services/faucetService";

interface FaucetFormProps {
  networks: NetworkConfig[];
}

const FaucetForm = ({ networks }: FaucetFormProps) => {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [mainnetBalance, setMainnetBalance] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  // Check mainnet balance when address changes
  const checkMainnetBalance = async () => {
    if (isValidAddress(address)) {
      try {
        const balance = await faucetService.getMainnetBalance(address);
        setMainnetBalance(balance);
      } catch (error) {
        console.error("Error checking mainnet balance:", error);
        setMainnetBalance(null);
      }
    } else {
      setMainnetBalance(null);
    }
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    // Only check balance if there's a valid address
    if (isValidAddress(newAddress)) {
      setLoading(true);
      try {
        const balance = await faucetService.getMainnetBalance(newAddress);
        setMainnetBalance(balance);
      } catch (error) {
        console.error("Error checking mainnet balance:", error);
        setMainnetBalance(null);
      } finally {
        setLoading(false);
      }
    } else {
      setMainnetBalance(null);
    }
  };

  const handleClaim = async () => {
    // Reset error message
    setErrorMessage(null);
    
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

    // Check if user has enough mainnet balance
    if (!mainnetBalance || parseFloat(mainnetBalance) < 0.005) {
      toast({
        title: "Insufficient mainnet balance",
        description: "You need at least 0.005 ETH on Ethereum mainnet to claim tokens",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTxDetails(null);

    try {
      // Check cooldown period
      const cooldownCheck = await faucetService.checkCooldown(address, network);
      if (cooldownCheck.inCooldown) {
        toast({
          title: "Cooldown period active",
          description: `You can claim again in approximately ${cooldownCheck.hoursLeft} hours`,
          variant: "destructive",
        });
        setCooldown(true);
        setLoading(false);
        return;
      }
      
      setCooldown(false);

      // Get user IP address 
      const ipAddress = await faucetService.getUserIp();
      
      // Send tokens directly
      const result = await faucetService.sendTransaction(address, network, reason, ipAddress);
      
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
      setMainnetBalance(null);
      
    } catch (error: any) {
      console.error("Faucet claim error:", error);
      setErrorMessage(error.message || "Failed to process your request. Please try again later.");
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
            onChange={handleAddressChange}
            className="mt-1"
          />
          {mainnetBalance !== null && (
            <div className={`text-sm mt-1 ${parseFloat(mainnetBalance) >= 0.005 ? 'text-green-600' : 'text-red-600'}`}>
              Mainnet balance: {mainnetBalance} ETH {parseFloat(mainnetBalance) >= 0.005 ? '✓' : '✗'}
            </div>
          )}
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
        
        {errorMessage && (
          <div className="text-sm text-destructive border border-destructive/20 bg-destructive/10 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-sm">
          <p className="font-medium">Important Notice:</p>
          <p>You need at least 0.005 ETH on Ethereum mainnet to claim tokens. This helps prevent faucet abuse.</p>
        </div>
        
        <Button 
          onClick={handleClaim} 
          disabled={loading || cooldown || !mainnetBalance || parseFloat(mainnetBalance) < 0.005}
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
