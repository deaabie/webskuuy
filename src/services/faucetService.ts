
import { ethers } from "ethers";
import { CLAIM_AMOUNT, FAUCET_PRIVATE_KEY, NETWORK_CONFIG } from "@/config/faucet-config";
import { TransactionDetails } from "@/components/faucet/types";

// Local storage keys
const FAUCET_CLAIMS_KEY = "faucet_claims";

interface ClaimRecord {
  address: string;
  network: string;
  txHash: string;
  amount: string;
  timestamp: number;
  reason?: string;
  status: 'pending' | 'completed' | 'failed';
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
  } catch (error) {
    console.error("Error saving to localStorage:", error);
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
  sendTransaction: async (to: string, networkId: string, reason?: string): Promise<TransactionDetails> => {
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
        status: 'pending'
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
  }
};
