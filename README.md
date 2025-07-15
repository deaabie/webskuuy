
# 🚀 Skuuy Deploy - Multi-Chain Deployment Platform

A comprehensive platform for deploying smart contracts across multiple blockchain networks with built-in faucet, multisender, and explorer features.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Supported Networks](#-supported-networks)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)

## ✨ Features

- **Multi-Chain Contract Deployment** - Deploy smart contracts across 20+ blockchain networks
- **Built-in Faucet** - Get testnet tokens for development
- **Multisender Tool** - Send tokens to multiple addresses in bulk
- **Chain Explorer** - Explore blockchain data and transactions
- **Network Management** - Add custom networks easily
- **Admin Panel** - Manage projects and installation guides

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### 1. Clone & Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Environment Setup

### Supabase Configuration

1. **Create Supabase Project**
   - Visit [supabase.com](https://supabase.com) and create an account
   - Create a new project
   - Wait for the project to be ready (2-3 minutes)

2. **Get Project Credentials**
   - Go to Settings → API
   - Copy your Project URL and anon key

3. **Update Configuration**
   
   Edit `src/integrations/supabase/client.ts`:
   ```typescript
   const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
   const supabaseKey = 'YOUR_ANON_KEY_HERE';
   ```

4. **Setup Database**
   
   Go to SQL Editor in your Supabase dashboard and run:
   ```sql
   -- Create admin_users table
   CREATE TABLE admin_users (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       username TEXT NOT NULL,
       password TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Create projects table
   CREATE TABLE projects (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       categories TEXT[] DEFAULT '{}',
       logo TEXT,
       status TEXT DEFAULT 'upcoming',
       installation_guide TEXT,
       created_at TIMESTAMPTZ DEFAULT now(),
       updated_at TIMESTAMPTZ DEFAULT now()
   );

   -- Create default admin user
   INSERT INTO admin_users (username, password)
   VALUES ('admin', 'admin123');
   ```

## 🌐 Supported Networks

### Testnets
- **Ethereum**: Sepolia, Holesky
- **Layer 2**: Base Sepolia, Optimism Sepolia, Blast Sepolia
- **Alternative Chains**: 
  - Monad Testnet
  - Citrea Testnet (Bitcoin L2)
  - Berachain Bepolia
  - Plume Testnet
  - XRPL EVM Testnet
  - Rome Protocol
  - Nexus

### Mainnets
- **Ethereum Mainnet**
- **Layer 2**: Optimism, Arbitrum, Base, Blast
- **Sidechains**: Polygon
- **Alternative**: Plume, Berachain

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── deploy/         # Contract deployment
│   ├── faucet/         # Testnet faucet
│   ├── multisender/    # Bulk token sender
│   └── ui/             # Reusable UI components
├── config/             # Network and app configuration
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
└── integrations/       # Third-party integrations
```

## 📖 Usage Guide

### 1. Deploy Contracts

1. Navigate to `/deploy`
2. Connect your wallet using RainbowKit
3. Select target network (testnet/mainnet/custom)
4. Choose contract type (ERC20, ERC721, etc.)
5. Fill in contract parameters
6. Deploy and verify

### 2. Use Faucet

1. Go to `/faucet`
2. Select testnet
3. Enter your wallet address
4. Provide reason for request
5. Claim testnet tokens

### 3. Multisender

1. Visit `/multisender`
2. Connect wallet and select network
3. Choose token (native or ERC20)
4. Add recipients (manual or CSV)
5. Review and send bulk transactions

### 4. Add Custom Networks

1. Go to Deploy page
2. Click "Custom" tab
3. Click "Add Network" card
4. Fill network details:
   - Name and ID
   - Chain ID and RPC URL
   - Native token symbol
   - Block explorer URL

### 5. Admin Panel

Access at `/admin` with default credentials:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Change these credentials in production!**

## 🔗 Network Configuration

### Adding New Networks

Edit `src/config/deploy-config.ts`:

```typescript
const newNetwork = {
  id: "network_id",
  rpcUrl: 'https://rpc-url.com',
  chainId: 12345,
  name: 'Network Name',
  symbol: 'TOKEN',
  explorer: 'https://explorer.com/tx/',
  imageUrl: 'https://logo-url.png'
};
```

Also add to `src/config/wagmi.ts` for wallet integration.

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: wagmi + viem + RainbowKit
- **Backend**: Supabase (Database + Auth)
- **State**: TanStack Query

## 🚀 Deployment

### Option 1: Lovable Platform
1. Open [Lovable Project](https://lovable.dev/projects/591701b0-a550-4cc2-8b31-b8d8f54e6b8b)
2. Click Share → Publish

### Option 2: Netlify
1. Build the project: `npm run build`
2. Deploy `dist` folder to Netlify
3. Set environment variables if needed

### Option 3: Custom Hosting
1. Run `npm run build`
2. Upload `dist` folder to your hosting provider
3. Configure redirects for SPA routing

## 📚 Additional Resources

- [Markdown Guide](MARKDOWN_GUIDE.md) - Writing installation guides
- [Installation Tips](INSTALLATION_GUIDE_TIPS.md) - Best practices
- [Templates](INSTALLATION_GUIDE_TEMPLATES.md) - Guide templates

## 🆘 Support

- [Lovable Documentation](https://docs.lovable.dev/)
- [Discord Community](https://discord.gg/lovable)
- [YouTube Tutorials](https://www.youtube.com/@lovabledev)

## 🔐 Security Notes

1. **Change default admin credentials** in production
2. **Use environment variables** for sensitive data
3. **Enable RLS policies** in Supabase for data security
4. **Verify smart contracts** before deployment

---

**Ready to deploy? Start with `npm install && npm run dev` and visit `http://localhost:5173`**
