
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NetworkConfig } from "./types";
import TransactionDetails from "./TransactionDetails";
import { faucetService } from "@/services/faucetService";

// Import our new components
import AddressInput from "./AddressInput";
import BalanceDisplay from "./BalanceDisplay";
import NetworkSelector from "./NetworkSelector";
import ReasonInput from "./ReasonInput";
import ErrorMessage from "./ErrorMessage";
import InfoNotice from "./InfoNotice";
import ClaimButton from "./ClaimButton";

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
        <AddressInput 
          address={address} 
          setAddress={setAddress} 
          setMainnetBalance={setMainnetBalance} 
          setLoading={setLoading} 
        />
        
        {mainnetBalance !== null && (
          <BalanceDisplay mainnetBalance={mainnetBalance} />
        )}
        
        <NetworkSelector 
          network={network} 
          setNetwork={setNetwork} 
          networks={networks} 
        />
        
        <ReasonInput 
          reason={reason} 
          setReason={setReason} 
        />
        
        <ErrorMessage errorMessage={errorMessage} />
        
        <InfoNotice />
        
        <ClaimButton 
          loading={loading} 
          cooldown={cooldown} 
          mainnetBalance={mainnetBalance} 
          onClick={handleClaim} 
        />

        {txDetails && <TransactionDetails details={txDetails} />}
      </div>
    </div>
  );
};

export default FaucetForm;
