
import { NetworkConfig } from "@/components/deploy/types";

// Network configuration with RPC URLs
export const NETWORK_CONFIG: Record<string, NetworkConfig> = {
  ethereum_sepolia: {
    id: "ethereum_sepolia",
    chainId: 11155111, // Sepolia
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io/tx/',
    icon: 'ethereum',
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  },
  ethereum_holesky: {
    id: "ethereum_holesky",
    chainId: 17000, // Holesky
    name: 'Ethereum Holesky',
    symbol: 'ETH',
    explorer: 'https://holesky.etherscan.io/tx/',
    icon: 'ethereum',
    rpcUrl: 'https://ethereum-holesky.publicnode.com',
  },
  polygon_mumbai: {
    id: "polygon_mumbai",
    chainId: 80001, // Mumbai
    name: 'Polygon Mumbai',
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com/tx/',
    icon: 'polygon',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  },
  arbitrum_goerli: {
    id: "arbitrum_goerli",
    chainId: 421613, // Arbitrum Goerli
    name: 'Arbitrum Goerli',
    symbol: 'ETH',
    explorer: 'https://goerli.arbiscan.io/tx/',
    icon: 'arbitrum',
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
  },
  optimism_goerli: {
    id: "optimism_goerli",
    chainId: 420, // Optimism Goerli
    name: 'Optimism Goerli',
    symbol: 'ETH',
    explorer: 'https://goerli-optimism.etherscan.io/tx/',
    icon: 'optimism',
    rpcUrl: 'https://goerli.optimism.io',
  },
  binance_testnet: {
    id: "binance_testnet",
    chainId: 97, // BSC Testnet
    name: 'BSC Testnet',
    symbol: 'BNB',
    explorer: 'https://testnet.bscscan.com/tx/',
    icon: 'binance',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  },
  base_goerli: {
    id: "base_goerli",
    chainId: 84531, // Base Goerli
    name: 'Base Goerli',
    symbol: 'ETH',
    explorer: 'https://goerli.basescan.org/tx/',
    icon: 'base',
    rpcUrl: 'https://goerli.base.org',
  },
  // Add more networks as needed
};

// Default contract templates
export const CONTRACT_TEMPLATES = {
  basic: {
    id: 'basic',
    name: 'Basic Contract',
    description: 'A simple smart contract template',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private value;
    
    event ValueChanged(uint256 newValue);
    
    function setValue(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}`
  },
  erc20: {
    id: 'erc20',
    name: 'ERC20 Token',
    description: 'Standard ERC20 token template',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`
  }
};
