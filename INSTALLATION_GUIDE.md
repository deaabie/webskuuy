
# Cosmos Explorer Installation Guide

This guide will help you set up and configure the Cosmos Explorer application for live usage. Follow these steps to get the explorer up and running.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or newer
- [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), or [Bun](https://bun.sh/)
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Clone or Download the Repository

```bash
git clone https://github.com/your-username/cosmos-explorer.git
cd cosmos-explorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Run the Development Server

For testing and development:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The explorer should now be accessible at `http://localhost:8080`.

### 4. Build for Production

When you're ready to deploy:

```bash
npm run build
# or
yarn build
# or
bun run build
```

This will create a production-ready build in the `dist` directory.

### 5. Serving the Production Build

You can use any static file server to serve the contents of the `dist` directory. For example:

```bash
# Using npm serve package
npm install -g serve
serve -s dist

# Or using a simple Python HTTP server
cd dist
python -m http.server 8080
```

## Chain Configuration

The Cosmos Explorer uses JSON configuration files to define chain connections. These files are located in the `public/chains` directory.

### Chain Directory Structure

```
public/chains/
├── mainnet/
│   ├── index.json       # List of mainnet chain config filenames
│   ├── cosmoshub.json   # Cosmos Hub configuration
│   ├── osmosis.json     # Osmosis configuration
│   └── ...              # Other mainnet chains
└── testnet/
    ├── index.json       # List of testnet chain config filenames
    └── theta-testnet.json  # Cosmos Hub testnet configuration
```

### Adding a New Chain

1. **Create a Chain Configuration File**

   Create a new JSON file in either `public/chains/mainnet/` or `public/chains/testnet/` depending on the network type.

   Example for a mainnet chain (`public/chains/mainnet/your-chain.json`):

   ```json
   {
     "id": "your-chain-id",
     "name": "your-chain-name",
     "prettyName": "Your Chain Display Name",
     "logo": "/cosmos-logos/your-logo.svg",
     "rpc": "https://rpc-endpoint.your-chain.com",
     "rest": "https://rest-endpoint.your-chain.com",
     "denom": "udenom",
     "symbol": "TOKEN",
     "decimals": 6,
     "coinGeckoId": "your-coin-gecko-id",
     "gasPrice": "0.025udenom",
     "explorerUrl": "https://explorer.your-chain.com",
     "networkType": "mainnet"
   }
   ```

2. **Update the Index File**

   Add the filename of your new chain configuration to the appropriate index.json file:

   For mainnet (`public/chains/mainnet/index.json`):
   ```json
   [
     "cosmoshub.json",
     "osmosis.json",
     "your-chain.json"
   ]
   ```

   For testnet (`public/chains/testnet/index.json`):
   ```json
   [
     "theta-testnet.json",
     "your-testnet-chain.json"
   ]
   ```

3. **Add Chain Logo (Optional)**

   If your chain has a custom logo, add the SVG file to `public/cosmos-logos/` and update the "logo" field in your chain configuration to point to it.

4. **Restart or Refresh**

   If the application is running, refresh the page to load your new chain configuration.

### Required Chain Configuration Fields

| Field | Description | Example |
|-------|-------------|---------|
| id | Unique identifier for the chain | "cosmoshub" |
| name | Chain name (used in API calls) | "cosmoshub" |
| prettyName | Human-readable name | "Cosmos Hub" |
| logo | Path to chain logo | "/cosmos-logos/atom.svg" |
| rpc | RPC endpoint URL | "https://rpc.cosmos.network" |
| rest | REST API endpoint URL | "https://rest.cosmos.network" |
| denom | Base denomination | "uatom" |
| symbol | Token symbol | "ATOM" |
| decimals | Number of decimal places | 6 |
| networkType | "mainnet" or "testnet" | "mainnet" |

### Optional Chain Configuration Fields

| Field | Description | Example |
|-------|-------------|---------|
| coinGeckoId | CoinGecko API ID | "cosmos" |
| gasPrice | Default gas price | "0.025uatom" |
| explorerUrl | Block explorer URL | "https://www.mintscan.io/cosmos" |

## Troubleshooting

### Common Issues

1. **Cannot connect to chain endpoints**

   - Verify that the RPC and REST URLs in your chain configuration are correct and accessible
   - Check that the endpoints have CORS enabled if accessing from a browser
   - Try using HTTPS endpoints instead of HTTP

2. **Chain doesn't appear in the explorer**

   - Make sure you've added the chain's JSON filename to the appropriate `index.json` file
   - Verify that the JSON file has the correct format and all required fields
   - Check the browser console for any error messages

3. **Data not displaying correctly**

   - Different chains might have slightly different API structures
   - Check the browser console for any errors
   - Verify that the chain's API endpoints are returning the expected data

### Debugging Tips

- Check the browser console (F12) for error messages
- Use the Network tab in browser developer tools to inspect API requests and responses
- Verify API endpoints manually by visiting them in your browser or using tools like curl or Postman

## Customization

### Adding Custom CSS

To customize the appearance of the explorer, you can modify the styles in the `src/index.css` file or add new CSS files and import them in your components.

### Modifying Components

The main explorer components are located in:

- `src/pages/CosmosExplorer.tsx`: Main explorer page
- `src/components/cosmos/`: Explorer-specific components
- `src/services/cosmosService.ts`: API interaction functions

## Deploying to a Live Server

### Basic Deployment

1. Build the application as described in step 4 above
2. Upload the contents of the `dist` directory to your web server
3. Configure your web server to serve the application and handle client-side routing

### Using Docker

You can also containerize the application using Docker:

1. Create a `Dockerfile` in the project root:

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create an `nginx.conf` file:

```
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

3. Build and run the Docker container:

```bash
docker build -t cosmos-explorer .
docker run -p 80:80 cosmos-explorer
```

The explorer should now be accessible at `http://localhost`.

## Keeping the Explorer Updated

### Updating Chain Configurations

As chains update their endpoints or parameters, you may need to update the configuration files. Simply edit the JSON files in the `public/chains` directory.

### Updating the Application

To update the explorer application itself:

1. Pull the latest changes from the repository
2. Reinstall dependencies
3. Rebuild and redeploy the application

```bash
git pull
npm install
npm run build
# Then redeploy the contents of the dist directory
```

## Conclusion

You should now have a fully functional Cosmos Explorer that can be customized to support any number of Cosmos chains. If you encounter any issues or have questions, please refer to the project's documentation or open an issue in the repository.
