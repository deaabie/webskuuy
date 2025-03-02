
# Cosmos Explorer

A web-based explorer for Cosmos ecosystem blockchains that allows you to browse validators, governance proposals, and blocks for multiple Cosmos chains.

## Features

- Support for multiple Cosmos chains
- Dynamic chain configuration via JSON files
- Network type filtering (mainnet/testnet)
- Validators list with status and details
- Governance proposals overview
- Recent blocks information
- Chain statistics (block height, validators, inflation, etc.)

## Installation Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) or [Bun](https://bun.sh/)

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/your-username/cosmos-explorer.git
cd cosmos-explorer
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Chain Configuration

The explorer supports configuration through JSON files stored in the `public/chains` directory:

```
public/chains/
├── mainnet/
│   ├── index.json
│   ├── cosmoshub.json
│   ├── osmosis.json
│   └── ...
└── testnet/
    ├── index.json
    └── theta-testnet.json
```

### Adding a New Chain

To add a new chain to the explorer:

1. Decide whether the chain belongs to mainnet or testnet
2. Create a new JSON file in the appropriate directory (e.g., `public/chains/mainnet/your-chain.json`)
3. Use the following template for your chain configuration:

```json
{
  "id": "your-chain-id",
  "name": "your-chain-name",
  "prettyName": "Your Chain Display Name",
  "logo": "/path-to-logo.svg",
  "rpc": "https://rpc-endpoint.your-chain.com",
  "rest": "https://rest-endpoint.your-chain.com",
  "denom": "udenom",
  "symbol": "TOKEN",
  "decimals": 6,
  "coinGeckoId": "your-chain-coingecko-id",
  "gasPrice": "0.025udenom",
  "explorerUrl": "https://explorer.your-chain.com",
  "networkType": "mainnet"
}
```

4. Add the JSON filename to the appropriate `index.json` file:

For mainnet:
```json
[
  "cosmoshub.json",
  "osmosis.json",
  "your-chain.json"
]
```

Or for testnet:
```json
[
  "theta-testnet.json",
  "your-testnet-chain.json"
]
```

5. Restart the application or refresh the page to load the new chain configuration

### Chain Configuration Fields

| Field | Description | Required |
|-------|-------------|----------|
| id | Unique identifier for the chain | Yes |
| name | Chain name (used in API calls) | Yes |
| prettyName | Human-readable name | Yes |
| logo | Path to chain logo | Yes |
| rpc | RPC endpoint URL | Yes |
| rest | REST API endpoint URL | Yes |
| denom | Base denomination (e.g., uatom) | Yes |
| symbol | Token symbol (e.g., ATOM) | Yes |
| decimals | Number of decimal places | Yes |
| coinGeckoId | CoinGecko API ID for price data | No |
| gasPrice | Default gas price | No |
| explorerUrl | Block explorer URL | No |
| networkType | "mainnet" or "testnet" | Yes |

## Troubleshooting

### Chain data not appearing

1. Check that your chain's RPC and REST endpoints are accessible
2. Verify that your chain's JSON file is properly formatted
3. Make sure the chain's filename is included in the appropriate `index.json` file
4. Check browser console for any errors
5. Try switching between mainnet and testnet in the explorer interface

### CORS issues

If you experience CORS issues with the API endpoints:

1. Make sure the chain's API endpoints have CORS enabled
2. Consider using a proxy server for development
3. Check that the endpoints are using HTTPS

## Development and Customization

### Adding Custom Chain Logos

1. Add your logo SVG file to `public/cosmos-logos/`
2. Reference it in your chain's JSON configuration:

```json
{
  "logo": "/cosmos-logos/your-logo.svg"
}
```

### Modifying the Explorer Interface

The main explorer component is in `src/pages/CosmosExplorer.tsx`. 
You can modify it to add new features or change the layout.

### Adding New Data Fields

To add new data fields to the explorer:

1. Update the type definitions in `src/types/cosmos.ts`
2. Modify the relevant data fetching functions in `src/services/cosmosService.ts`
3. Update the UI components to display the new data

## License

This project is licensed under the MIT License.
