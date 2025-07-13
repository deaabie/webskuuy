
import { ethers } from "ethers";
import { CLAIM_AMOUNT, NETWORK_CONFIG } from "@/config/faucet-config";
import { TransactionDetails } from "@/components/faucet/types";
import { supabase } from "@/integrations/supabase/client";

// Local storage keys
const FAUCET_CLAIMS_KEY = "faucet_claims";

// Ethereum mainnet provider
const MAINNET_RPC_URL = "https://eth.llamarpc.com";

interface ClaimRecord {
  address: string;
  network: string;
  txHash: string;
  amount: string;
  timestamp: number;
  reason?: string;
  status: 'pending' | 'completed' | 'failed';
  ipAddress?: string;
}

// Helper to get claims from localStorage
const getClaims = (): ClaimRecord[] => {
  try {
    const storedClaims = localStorage.getItem(FAUCET_CLAIMS_KEY);
    return storedClaims ? JSON.parse(storedClaims) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

// Helper to save claims to localStorage
const saveClaim = (claim: ClaimRecord) => {
  try {
    const claims = getClaims();
    claims.push(claim);
    localStorage.setItem(FAUCET_CLAIMS_KEY, JSON.stringify(claims));
    
    // Also log to file if we have IP address
    if (claim.ipAddress) {
      logClaimToFile(claim);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Log claim to file
const logClaimToFile = (claim: ClaimRecord) => {
  try {
    const logEntry = `[${new Date(claim.timestamp).toISOString()}] IP: ${claim.ipAddress}, Address: ${claim.address}, Network: ${claim.network}, TxHash: ${claim.txHash}, Amount: ${claim.amount}, Status: ${claim.status}, Reason: ${claim.reason || 'Not provided'}\n`;
    
    // In a browser environment, we need to create a downloadable file
    // This creates a file that can be downloaded by admins and aggregated
    const blob = new Blob([logEntry], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Append to log file (note: we can't directly write to a file from the browser)
    // Instead, we'll store the log entries in local storage
    const logs = localStorage.getItem('faucet_ip_logs') || '';
    localStorage.setItem('faucet_ip_logs', logs + logEntry);
    
    console.log("Logged claim to storage:", logEntry);
  } catch (error) {
    console.error("Error logging to file:", error);
  }
};

// Helper to update claim status
const updateClaimStatus = (txHash: string, status: 'pending' | 'completed' | 'failed') => {
  try {
    const claims = getClaims();
    const updatedClaims = claims.map(claim => 
      claim.txHash === txHash ? { ...claim, status } : claim
    );
    localStorage.setItem(FAUCET_CLAIMS_KEY, JSON.stringify(updatedClaims));
  } catch (error) {
    console.error("Error updating claim status:", error);
  }
};

export const faucetService = {
  // Get user IP address
  getUserIp: async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "unknown";
    }
  },

  // Get mainnet balance for an address
  getMainnetBalance: async (address: string): Promise<string> => {
    try {
      const provider = new ethers.JsonRpcProvider(MAINNET_RPC_URL);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      return parseFloat(balanceEth).toFixed(6); // Format to 6 decimal places
    } catch (error) {
      console.error("Error fetching mainnet balance:", error);
      throw new Error("Failed to fetch mainnet balance");
    }
  },

  // Check if user is in cooldown period (24 hours)
  checkCooldown: async (address: string, network: string): Promise<{inCooldown: boolean, hoursLeft?: number}> => {
    try {
      const claims = getClaims();
      
      const lastClaim = claims
        .filter(claim => 
          claim.address.toLowerCase() === address.toLowerCase() && 
          claim.network === network
        )
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      
      if (lastClaim) {
        const lastClaimTime = lastClaim.timestamp;
        const cooldownTime = lastClaimTime + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
        
        if (cooldownTime > Date.now()) {
          const timeLeftHours = Math.ceil((cooldownTime - Date.now()) / (1000 * 60 * 60));
          return { inCooldown: true, hoursLeft: timeLeftHours };
        }
      }
      
      return { inCooldown: false };
    } catch (error) {
      console.error("Error checking cooldown:", error);
      return { inCooldown: false };
    }
  },

  // Send transaction and record claim - now uses Supabase Edge Function
  sendTransaction: async (to: string, networkId: string, reason?: string, ipAddress?: string): Promise<TransactionDetails> => {
    try {
      // First check if user has enough mainnet balance
      const mainnetBalance = await faucetService.getMainnetBalance(to);
      if (parseFloat(mainnetBalance) < 0.005) {
        throw new Error("Insufficient Ethereum mainnet balance. You need at least 0.005 ETH.");
      }

      const networkConfig = NETWORK_CONFIG[networkId];
      if (!networkConfig) {
        throw new Error("Invalid network selected");
      }

      // Use Supabase Edge Function instead of direct transaction
      const { data, error } = await supabase.functions.invoke('send-tokens', {
        body: {
          address: to,
          network: networkId,
          reason: reason || "No reason provided"
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to process transaction");
      }

      if (!data || !data.success) {
        throw new Error(data?.message || "Transaction failed");
      }

      console.log(`Transaction sent via edge function: ${data.txHash}`);
      
      // Record the claim locally for backward compatibility
      const claimRecord: ClaimRecord = {
        address: to.toLowerCase(),
        network: networkId,
        txHash: data.txHash,
        amount: data.amount,
        timestamp: Date.now(),
        reason: reason || "No reason provided",
        status: 'pending',
        ipAddress: ipAddress
      };
      
      saveClaim(claimRecord);

      return {
        txHash: data.txHash,
        amount: data.amount,
        network: data.network,
        symbol: data.symbol,
        explorerUrl: data.explorerUrl
      };
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  },
  
  // Get logs (for admin purposes)
  getLogs: (): string => {
    return localStorage.getItem('faucet_ip_logs') || '';
  },
  
  // Download logs as a text file
  downloadLogs: () => {
    const logs = localStorage.getItem('faucet_ip_logs') || 'No logs found';
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faucet_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
