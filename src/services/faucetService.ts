
import { ethers } from "ethers";
import { CLAIM_AMOUNT, FAUCET_PRIVATE_KEY, NETWORK_CONFIG } from "@/config/faucet-config";
import { TransactionDetails } from "@/components/faucet/types";

// Local storage keys
const FAUCET_CLAIMS_KEY = "faucet_claims";
const FAUCET_LOG_FILE = "faucet_logs.txt";

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

  // Send transaction and record claim
  sendTransaction: async (to: string, networkId: string, reason?: string, ipAddress?: string): Promise<TransactionDetails> => {
    try {
      const networkConfig = NETWORK_CONFIG[networkId];
      if (!networkConfig) {
        throw new Error("Invalid network selected");
      }

      // Create provider with the selected network
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
      
      // Create wallet with private key
      const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);
      
      // Check wallet balance
      const balance = await provider.getBalance(wallet.address);
      const claimAmountBn = ethers.parseEther(CLAIM_AMOUNT);
      
      if (balance < claimAmountBn) {
        throw new Error(`Insufficient funds in faucet wallet for ${networkConfig.name}`);
      }

      // Send transaction
      console.log(`Sending ${CLAIM_AMOUNT} ${networkConfig.symbol} to ${to} on ${networkConfig.name}`);
      
      const tx = await wallet.sendTransaction({
        to: to,
        value: claimAmountBn,
      });

      console.log(`Transaction sent: ${tx.hash}`);
      
      // Record the claim locally
      const claimRecord: ClaimRecord = {
        address: to.toLowerCase(),
        network: networkId,
        txHash: tx.hash,
        amount: CLAIM_AMOUNT,
        timestamp: Date.now(),
        reason: reason || "No reason provided",
        status: 'pending',
        ipAddress: ipAddress
      };
      
      saveClaim(claimRecord);

      // Wait for transaction receipt in background
      tx.wait().then(receipt => {
        // Update transaction status
        console.log(`Transaction confirmed: ${tx.hash}`);
        updateClaimStatus(tx.hash, 'completed');
      }).catch(error => {
        console.error('Error waiting for transaction:', error);
        updateClaimStatus(tx.hash, 'failed');
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
