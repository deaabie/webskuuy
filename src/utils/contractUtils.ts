
import { ethers } from 'ethers';

// SimpleStorage contract - ABI for the simple storage contract
const SIMPLE_STORAGE_ABI = [
  "function set(uint256 x)",
  "function get() view returns (uint256)",
  "function storedData() view returns (uint256)"
];

// Counter contract ABI
const COUNTER_ABI = [
  "function count() view returns (uint256)",
  "function increment()",
  "function decrement()",
  "function getCount() view returns (uint256)"
];

// Counter contract bytecode - compiled from the reference contract
const COUNTER_BYTECODE = "0x608060405234801561001057600080fd5b5060008055610173806100246000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632a1afcd914610046578063371303c01461006457806361bc221a14610082575b600080fd5b61004e61009c565b60405161005b91906100d0565b60405180910390f35b61006c6100a2565b60405161007991906100d0565b60405180910390f35b61008a6100b5565b60405161009791906100d0565b60405180910390f35b60005481565b6000808154809291906100b490610102565b9190505550565b60008054905090565b6000819050919050565b6100ca816100b7565b82525050565b60006020820190506100e560008301846100c1565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061010d826100b7565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8201610102565b5b50919050565b600080fd5b600061014a826100b7565b9050919050565b61015a8161013f565b811461016557600080fd5b5056fea2646970667358221220e3e396613b043384a4cee4217decc9ae1b8d952d69a50ebad70ee09a8a3afd2964736f6c63430008130033";

// SimpleStorage contract bytecode - compiled from the reference contract WITHOUT initial value
const SIMPLE_STORAGE_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632a1afcd914610046578063552410771461006457806360fe47b1146100805780636d4ce63c1461009c575b600080fd5b61004e6100ba565b60405161005b91906100f0565b60405180910390f35b61007e60048036038101906100799190610126565b6100c0565b005b61009a60048036038101906100959190610126565b6100ca565b005b6100a46100d4565b6040516100b191906100f0565b60405180910390f35b60005481565b8060008190555050565b8060008190555050565b60008054905090565b6000819050919050565b6100ea816100d7565b82525050565b600060208201905061010560008301846100e1565b92915050565b600080fd5b610119816100d7565b811461012457600080fd5b50565b60008135905061013681610110565b92915050565b60006020828403121561015257610151610110565b5b600061016084828501610127565b9150509291505056fea2646970667358221220eefbe54ed283e9a0f5239fd9b3b7c5d0d0a4bfb352eb88f31f067c70eb22fe6c64736f6c63430008130033";

// Function to validate bytecode format
const validateBytecode = (bytecode: string): string => {
  if (!bytecode || typeof bytecode !== 'string') {
    throw new Error("Invalid bytecode: bytecode must be a string");
  }
  
  // Ensure it starts with 0x
  if (!bytecode.startsWith('0x')) {
    bytecode = '0x' + bytecode;
  }
  
  // Ensure it has a valid length (must be even)
  if (bytecode.length % 2 !== 0) {
    throw new Error("Invalid bytecode length: must be even");
  }
  
  // Simple hex validation
  if (!/^0x[0-9a-fA-F]+$/.test(bytecode)) {
    throw new Error("Invalid bytecode format: must contain only hex characters");
  }
  
  return bytecode;
};

// Function to get contract details based on mode
export const getContractByMode = (
  mode: string
) => {
  if (mode === 'basic') {
    console.log("Getting contract for basic mode");
    
    // Use Counter contract
    const bytecode = validateBytecode(COUNTER_BYTECODE);
    return {
      abi: COUNTER_ABI,
      bytecode: bytecode,
      contractArgs: [] // Counter doesn't need constructor arguments
    };
  } else if (mode === 'storage') {
    console.log("Getting contract for SimpleStorage mode");
    
    // For SimpleStorage with NO initial value parameter (no constructor)
    const bytecode = validateBytecode(SIMPLE_STORAGE_BYTECODE);
    
    console.log("SimpleStorage without initial value");
    
    return {
      abi: SIMPLE_STORAGE_ABI,
      bytecode: bytecode,
      contractArgs: [] // No constructor arguments for SimpleStorage
    };
  } else {
    throw new Error(`Unsupported deployment mode: ${mode}`);
  }
};
