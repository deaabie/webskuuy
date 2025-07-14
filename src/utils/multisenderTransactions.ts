
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
    console.log("Recipients:", recipients.length);
    
    const addresses = recipients.map(r => r.address);
    const amounts = recipients.map(r => ethers.parseEther(r.amount.toString()));
    const totalEther = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

    console.log("Total ETH needed:", ethers.formatEther(totalEther));

    // Deploy multisender contract
    const multisenderContract = await deployMultisenderContract(signer);
    
    console.log("Executing native bulk transfer...");
    const tx = await multisenderContract.multisendEther(addresses, amounts, {
      value: totalEther,
      gasLimit: 500000 + (recipients.length * 50000)
    });

    console.log("Native bulk transfer submitted:", tx.hash);
    const receipt = await tx.wait();
    console.log("Native bulk transfer confirmed:", receipt.transactionHash);
    
    return {
      success: true,
      hash: receipt.transactionHash
    };
  } catch (error: any) {
    console.error("Native bulk transfer failed:", error);
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
    console.log("Token address:", tokenAddress);
    console.log("Recipients:", recipients.length);
    
    const erc20Abi = [
      "function decimals() view returns (uint8)",
      "function balanceOf(address owner) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)"
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    
    // Get token decimals
    const decimals = await tokenContract.decimals();
    console.log("Token decimals:", decimals);
    
    const addresses = recipients.map(r => r.address);
    const amounts = recipients.map(r => ethers.parseUnits(r.amount.toString(), decimals));
    const totalTokenAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

    console.log("Total tokens needed:", ethers.formatUnits(totalTokenAmount, decimals));

    // Deploy multisender contract
    const multisenderContract = await deployMultisenderContract(signer);
    const contractAddress = await multisenderContract.getAddress();
    
    // Check current allowance
    const userAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(userAddress, contractAddress);
    
    console.log("Current allowance:", ethers.formatUnits(currentAllowance, decimals));
    console.log("Required amount:", ethers.formatUnits(totalTokenAmount, decimals));

    // Approve tokens if needed
    if (currentAllowance < totalTokenAmount) {
      console.log("Approving tokens...");
      const approveTx = await tokenContract.approve(contractAddress, totalTokenAmount, {
        gasLimit: 100000
      });
      console.log("Approval submitted:", approveTx.hash);
      await approveTx.wait();
      console.log("Token approval confirmed");
    }

    console.log("Executing token bulk transfer...");
    const tx = await multisenderContract.multisendToken(tokenAddress, addresses, amounts, {
      gasLimit: 300000 + (recipients.length * 100000)
    });

    console.log("Token bulk transfer submitted:", tx.hash);
    const receipt = await tx.wait();
    console.log("Token bulk transfer confirmed:", receipt.transactionHash);
    
    return {
      success: true,
      hash: receipt.transactionHash
    };
  } catch (error: any) {
    console.error("Token bulk transfer failed:", error);
    return {
      success: false,
      error: error.message || "Token bulk transfer failed"
    };
  }
};
