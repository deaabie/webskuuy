
# Smart Contract Deployment Guide

This document provides a comprehensive guide for setting up and using the Smart Contract Deployment feature. Follow these instructions to deploy your own smart contracts on various blockchain networks.

## Table of Contents

- [Overview](#overview)
- [Configuration Setup](#configuration-setup)
- [Supported Networks](#supported-networks)
- [Deployment Process](#deployment-process)
- [Customizing Deployment Options](#customizing-deployment-options)
- [Adding Custom Networks](#adding-custom-networks)
- [Troubleshooting](#troubleshooting)

## Overview

The Smart Contract Deployment feature allows users to deploy pre-configured smart contracts to various blockchain networks directly from the web interface. The system currently supports:

- Counter Contract: A simple smart contract that maintains a counter value
- SimpleStorage Contract: A contract that stores and retrieves a single value

Users can connect their Web3 wallet (like MetaMask), select a network, and deploy contracts without needing to write any code.

## Configuration Setup

The deployment functionality is configured through a dedicated configuration file located at `src/config/deploy-config.ts`. This file contains:

- Network configurations (RPC URLs, chain IDs, explorer URLs)
- Deployment parameters (gas limits, gas price settings)
- Network display information (names, symbols, logos)

### Basic Configuration Example

```typescript
// Example configuration file structure
import { NetworkConfig } from "@/components/faucet/types";

export const DEPLOY_NETWORK_CONFIG: Record<string, NetworkConfig> = {
  ethereum_sepolia: {
    id: "ethereum_sepolia",
    rpcUrl: 'https://sepolia.drpc.org',
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io/tx/',
    imageUrl: 'path/to/logo.png'
  },
  // More networks...
};

// Deployment gas configuration
export const DEPLOYMENT_GAS_LIMIT = 3000000;

export const GAS_PRICE_CONFIG = {
  maxFeePerGas: "5", // in gwei
  maxPriorityFeePerGas: "1" // in gwei
};
```

## Supported Networks

The deployment feature comes pre-configured with the following testnet networks:

1. **Ethereum Sepolia**
   - ChainID: 11155111
   - Currency: ETH

2. **Ethereum Holesky**
   - ChainID: 17000
   - Currency: ETH

3. **Base Sepolia**
   - ChainID: 84532
   - Currency: ETH

4. **Optimism Sepolia**
   - ChainID: 11155420
   - Currency: ETH

5. **Arbitrum Sepolia**
   - ChainID: 421614
   - Currency: ETH

6. **Blast Sepolia**
   - ChainID: 168587773
   - Currency: ETH

## Deployment Process

To deploy a smart contract:

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your Web3 wallet.
2. **Select Network**: Choose a blockchain network from the dropdown menu.
3. **Choose Contract Type**: Select either the Counter or SimpleStorage contract.
4. **Deploy**: Click the "DEPLOY" button and confirm the transaction in your wallet.
5. **View Results**: After successful deployment, the transaction hash and contract address will be displayed.

## Customizing Deployment Options

### Modifying Gas Settings

You can adjust the gas settings in the `deploy-config.ts` file:

```typescript
// Increase gas limit for complex contracts
export const DEPLOYMENT_GAS_LIMIT = 5000000;

// Adjust gas prices for faster confirmations
export const GAS_PRICE_CONFIG = {
  maxFeePerGas: "10", // Higher value for faster inclusion
  maxPriorityFeePerGas: "2"
};
```

### Adding New Contract Types

To add new contract types:

1. Create the contract ABI and bytecode in `src/utils/contractUtils.ts`
2. Add a new case to the `getContractByMode` function
3. Update the UI in the `DeployContainer.tsx` component to include the new contract type

## Adding Custom Networks

Users can add custom networks programmatically or through the UI. Custom networks require the following information:

- Network ID (unique identifier)
- RPC URL (for connecting to the blockchain)
- Chain ID (numeric identifier for the blockchain)
- Network name (display name)
- Currency symbol
- Explorer URL (for viewing transactions)

Custom networks are stored in the browser's localStorage and will persist between sessions.

## Troubleshooting

### Common Deployment Issues

1. **Transaction Rejected**: Ensure your wallet is properly connected and you have confirmed the transaction.

2. **Insufficient Funds**: Make sure your wallet has enough funds to cover the gas costs for deployment.

3. **Network Congestion**: During times of high network usage, transactions may take longer to confirm. You can increase the gas price settings in the configuration file.

4. **RPC Errors**: If you encounter RPC connection errors, try using a different RPC URL for the network in the configuration file.

5. **Explorer URL Issues**: If transaction or contract links are not working, verify the explorer URL format in the network configuration.

### Debugging

The deployment process includes extensive console logging. If you encounter issues, check the browser console for detailed error messages and debugging information.

## Need More Help?

If you encounter issues not covered in this guide, please refer to the project's GitHub repository or contact the development team for assistance.

