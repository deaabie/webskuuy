
import { ethers } from 'ethers';
import { deployMultisenderContract } from './multisenderContract';
import { RecipientData } from '@/components/multisender/MultisenderForm';

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export const executeNativeBulkTransfer = async (
  signer: any,
  recipients: RecipientData[]
): Promise<TransactionResult> => {
  try {
    console.log("Starting native token bulk transfer...");
    
    const addresses = recipients.map(r => r.address);
    const amounts = recipients.map(r => ethers.parseEther(r.amount));
    const totalEther = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

    // Deploy and execute in one step
    const multisenderContract = await deployMultisenderContract(signer);
    
    console.log("Executing bulk native transfer...");
    const tx = await multisenderContract.multisendEther(addresses, amounts, {
      value: totalEther,
      gasLimit: 300000 + (recipients.length * 30000)
    });

    console.log("Bulk native transfer transaction sent:", tx.hash);
    await tx.wait();
    
    return {
      success: true,
      hash: tx.hash
    };
  } catch (error: any) {
    console.error("Native bulk transfer error:", error);
    return {
      success: false,
      error: error.message || "Native bulk transfer failed"
    };
  }
};

export const executeTokenBulkTransfer = async (
  signer: any,
  recipients: RecipientData[],
  tokenAddress: string
): Promise<TransactionResult> => {
  try {
    console.log("Starting ERC-20 bulk transfer...");
    
    const erc20Abi = [
      "function decimals() view returns (uint8)",
      "function balanceOf(address owner) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)"
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    const decimals = await tokenContract.decimals();
    
    const addresses = recipients.map(r => r.address);
    const amounts = recipients.map(r => ethers.parseUnits(r.amount, decimals));
    const totalTokenAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

    // Deploy contract first
    const multisenderContract = await deployMultisenderContract(signer);
    const contractAddress = await multisenderContract.getAddress();
    
    // Check and approve if needed
    const userAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(userAddress, contractAddress);
    
    if (currentAllowance < totalTokenAmount) {
      console.log("Approving tokens for bulk transfer...");
      const approveTx = await tokenContract.approve(contractAddress, totalTokenAmount);
      await approveTx.wait();
      console.log("Token approval completed");
    }

    console.log("Executing bulk token transfer...");
    const tx = await multisenderContract.multisendToken(tokenAddress, addresses, amounts, {
      gasLimit: 200000 + (recipients.length * 80000)
    });

    console.log("Bulk token transfer transaction sent:", tx.hash);
    await tx.wait();
    
    return {
      success: true,
      hash: tx.hash
    };
  } catch (error: any) {
    console.error("Token bulk transfer error:", error);
    return {
      success: false,
      error: error.message || "Token bulk transfer failed"
    };
  }
};
