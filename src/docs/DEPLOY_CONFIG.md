
# Deploy Page Configuration Guide

This document explains how to customize the network configurations for the Deploy page of the application.

## Network Configuration Structure

The network configuration is organized into two main categories:
- **Testnets**: Test networks for development and testing
- **Mainnets**: Production networks for real deployments

Each network configuration has the following properties:

| Property | Description | Example |
|----------|-------------|---------|
| `id` | Unique identifier for the network | `"ethereum_mainnet"` |
| `chainId` | Numeric chain ID used by wallets | `1` |
| `name` | Display name shown to users | `"Ethereum"` |
| `symbol` | Currency symbol | `"ETH"` |
| `rpcUrl` | RPC endpoint for connecting to the network | `"https://eth.public-rpc.com"` |
| `explorer` | Block explorer URL (must end with `/tx/`) | `"https://etherscan.io/tx/"` |
| `imageUrl` | URL to the network logo image | See below |

## Adding a New Network

To add a new network, follow these steps:

1. Open `src/config/deploy-config.ts`
2. Decide whether your network is a testnet or mainnet
3. Add a new entry to either `TESTNETS` or `MAINNETS` following this pattern:

```typescript
network_identifier: {
  id: "network_identifier",
  rpcUrl: "https://rpc-endpoint.example.com",
  chainId: 12345,  // The chain ID number
  name: "Network Name",
  symbol: "TKN",  // The currency symbol
  explorer: "https://explorer.example.com/tx/", // Must end with /tx/
  imageUrl: "https://raw.githubusercontent.com/username/repo/main/image.png"
}
```

## Network Logo Images

For network logos, we recommend using GitHub raw URLs to ensure reliable hosting:

1. Upload your logo image to a GitHub repository
2. Get the "raw" URL by clicking on the file in GitHub and then clicking the "Raw" button
3. Use the URL that starts with `https://raw.githubusercontent.com/`

Example:
```
https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png
```

## Best Practices

1. **Use reliable RPC endpoints**: Choose RPC endpoints that are stable and have good uptime
2. **Test your configuration**: Always test your network configuration before deploying
3. **Use consistent naming**: Follow the existing naming conventions (`network_name`)
4. **Provide appropriate logos**: Use SVG or PNG images with transparent backgrounds
5. **Verify explorer URLs**: Make sure block explorer URLs end with `/tx/` for proper transaction linking

## Helper Functions

The configuration file exports several helper functions:

- `getNetworkById(networkId)`: Gets a network by its ID
- `getTestnets()`: Returns all testnet configurations
- `getMainnets()`: Returns all mainnet configurations
- `getAllNetworks()`: Returns all network configurations

Example usage:
```typescript
import { getNetworkById, getTestnets, getMainnets } from '@/config/deploy-config';

// Get a specific network
const ethereumNetwork = getNetworkById('ethereum_mainnet');

// Get all testnets
const allTestnets = getTestnets();

// Get all mainnets
const allMainnets = getMainnets();
```

## Adding Custom Networks in the UI

Users can also add custom networks directly through the user interface:

1. Go to the Deploy page
2. Select the "Custom" tab in the network selector
3. Click "Add Network"
4. Fill in the network details
5. Click "Add Network" to save

Custom networks are stored in the browser's localStorage and are only available in the browser where they were added.
