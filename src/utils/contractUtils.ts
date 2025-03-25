
import { ethers } from 'ethers';

// SimpleStorage contract - ABI for the simple storage contract
const SIMPLE_STORAGE_ABI = [
  "constructor(uint256 initialValue)",
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

// SimpleStorage contract bytecode - compiled from the reference contract
const SIMPLE_STORAGE_BYTECODE = "0x608060405234801561001057600080fd5b506040516101e73803806101e78339818101604052810190610032919061007a565b806000819055505061009a565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b61013e806100a96000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632a1afcd914610046578063471f7cdf146100645780636d4ce63c14610082575b600080fd5b61004e6100a0565b60405161005b9190610105565b60405180910390f35b61006c6100a6565b6040516100799190610105565b60405180910390f35b61008a6100ac565b6040516100979190610105565b60405180910390f35b60005481565b60005481565b60008054905090565b6000819050919050565b6100ff816100ec565b82525050565b600060208201905061011a60008301846100f6565b92915050565b600080fd5b61012e816100ec565b811461013957600080fd5b5056fea26469706673582212203a7a575b5a4a8a99d89ec14425d6cea24c12cd0f4dafd31bd29ec49f91affd1264736f6c63430008130033";

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

// Function to get initial value for SimpleStorage contract
export const getInitialStorageValue = () => {
  return "42";
};

// Function to get contract details based on mode
export const getContractByMode = (
  mode: string, 
  args: any
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
    
    // For SimpleStorage with initial value parameter
    const bytecode = validateBytecode(SIMPLE_STORAGE_BYTECODE);
    
    // Default initial value if not specified
    const initialValue = args && args.initialValue ? args.initialValue : 42;
    
    console.log("SimpleStorage params:", { initialValue });
    
    return {
      abi: SIMPLE_STORAGE_ABI,
      bytecode: bytecode,
      contractArgs: [initialValue]
    };
  } else {
    throw new Error(`Unsupported deployment mode: ${mode}`);
  }
};
