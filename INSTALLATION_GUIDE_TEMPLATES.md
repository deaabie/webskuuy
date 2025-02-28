
# Installation Guide Templates

This document provides templates for common blockchain node installation guides that you can customize for your specific projects.

## Table of Contents
- [Bitcoin-like Node Template](#bitcoin-like-node-template)
- [EVM-compatible Node Template](#evm-compatible-node-template)
- [Cosmos SDK Node Template](#cosmos-sdk-node-template)
- [Solana Validator Template](#solana-validator-template)
- [General Blockchain CLI Tool Template](#general-blockchain-cli-tool-template)

## Bitcoin-like Node Template

```markdown
# [Project Name] Node Installation Guide

## Prerequisites
- **CPU:** 2+ cores
- **RAM:** 4GB minimum (8GB+ recommended)
- **Storage:** 500GB+ SSD (for full blockchain)
- **OS:** Ubuntu 22.04 LTS
- **Bandwidth:** Unlimited or 500GB+ monthly

## Installation Steps

### 1. Update your system
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install dependencies
```bash
sudo apt install -y build-essential libtool autotools-dev automake pkg-config bsdmainutils python3 libssl-dev libevent-dev libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-program-options-dev libboost-test-dev libboost-thread-dev libminiupnpc-dev libzmq3-dev
```

### 3. Download binary release
```bash
cd ~
wget https://example.com/project/releases/project-version-x86_64-linux-gnu.tar.gz
```

### 4. Verify and extract
```bash
# Verify checksum (optional but recommended)
echo "expected-checksum project-version-x86_64-linux-gnu.tar.gz" | sha256sum -c

# Extract files
tar -xvf project-version-x86_64-linux-gnu.tar.gz
sudo install -m 0755 -o root -g root -t /usr/local/bin project-version/bin/*
```

### 5. Create data directory and configuration
```bash
mkdir -p ~/.project
nano ~/.project/project.conf
```

Add the following to your config file:
```
server=1
daemon=1
txindex=1
rpcuser=YOUR_USERNAME
rpcpassword=YOUR_SECURE_PASSWORD
rpcallowip=127.0.0.1
```

### 6. Start the node
```bash
projectd -daemon
```

### 7. Monitor the blockchain sync
```bash
project-cli getblockchaininfo
```

### 8. Create a service for auto-start (optional)
```bash
sudo nano /etc/systemd/system/project.service
```

Add:
```
[Unit]
Description=Project Daemon
After=network.target

[Service]
ExecStart=/usr/local/bin/projectd -daemon -conf=/home/YOUR_USERNAME/.project/project.conf -pid=/home/YOUR_USERNAME/.project/project.pid
PIDFile=/home/YOUR_USERNAME/.project/project.pid
Type=forking
Restart=always
RestartSec=30
User=YOUR_USERNAME

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable project
sudo systemctl start project
```

## Troubleshooting

- Check logs: `tail -f ~/.project/debug.log`
- Check status: `project-cli getblockchaininfo`
- Restart daemon: `project-cli stop && sleep 5 && projectd -daemon`
```

## EVM-compatible Node Template

```markdown
# [Project Name] Node Installation Guide

## Prerequisites
- **CPU:** 4+ cores
- **RAM:** 8GB+
- **Storage:** 1TB+ SSD
- **OS:** Ubuntu 22.04 LTS
- **Bandwidth:** Unlimited or 1TB+ monthly
- **Docker:** Installed (optional)

## Installation Steps

### Option 1: Using Docker (Recommended)

#### 1. Install Docker if not already installed
```bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
```
Log out and log back in to apply the group membership.

#### 2. Create data directory
```bash
mkdir -p ~/project-data
```

#### 3. Run the node
```bash
docker run -d --name project-node \
  -v ~/project-data:/data \
  -p 8545:8545 -p 8546:8546 -p 30303:30303 -p 30303:30303/udp \
  projectname/node:latest \
  --http --http.addr 0.0.0.0 --http.port 8545 \
  --ws --ws.addr 0.0.0.0 --ws.port 8546 \
  --datadir /data
```

### Option 2: Binary Installation

#### 1. Download and install
```bash
cd ~
wget https://example.com/project/releases/project-linux-amd64.tar.gz
tar -xvf project-linux-amd64.tar.gz
sudo mv project /usr/local/bin/
```

#### 2. Create service file
```bash
sudo nano /etc/systemd/system/project.service
```

Add:
```
[Unit]
Description=Project Node
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/project --datadir /home/$USER/project-data --http --http.addr 0.0.0.0 --http.port 8545 --ws --ws.addr 0.0.0.0 --ws.port 8546
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 3. Start the service
```bash
sudo systemctl daemon-reload
sudo systemctl enable project
sudo systemctl start project
```

### 4. Check sync status
```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'
```

## Troubleshooting

- Check logs: `sudo journalctl -u project -f`
- If sync is stuck: `sudo systemctl restart project`
- For disk space issues: `ncdu ~/project-data` to analyze usage
```

## Cosmos SDK Node Template

```markdown
# [Project Name] Node Installation Guide

## Prerequisites
- **CPU:** 4+ cores
- **RAM:** 16GB+
- **Storage:** 200GB+ SSD
- **OS:** Ubuntu 22.04 LTS
- **Go:** v1.19+ (will be installed in the guide)

## Installation Steps

### 1. Update and install dependencies
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y build-essential curl wget jq git lz4 make gcc
```

### 2. Install Go
```bash
cd $HOME
wget https://go.dev/dl/go1.19.5.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.19.5.linux-amd64.tar.gz
rm go1.19.5.linux-amd64.tar.gz
```

Add Go to your PATH:
```bash
echo "export PATH=\$PATH:/usr/local/go/bin:\$HOME/go/bin" >> ~/.profile
source ~/.profile
```

Verify Go installation:
```bash
go version
```

### 3. Install the node software
```bash
cd $HOME
rm -rf project
git clone https://github.com/project/project.git
cd project
git checkout v1.0.0  # Replace with latest version
make install
```

Verify installation:
```bash
project version
```

### 4. Initialize the node
```bash
project init mynodename --chain-id project-1
```

### 5. Get genesis file and peers
```bash
wget -O $HOME/.project/config/genesis.json https://raw.githubusercontent.com/project/mainnet/main/genesis.json

# Set seeds and peers
SEEDS="seed1@peer.com:26656,seed2@peer.com:26656"
PEERS="peer1@peer.com:26656,peer2@peer.com:26656"

sed -i 's|^seeds =.*|seeds = "'$SEEDS'"|' $HOME/.project/config/config.toml
sed -i 's|^persistent_peers =.*|persistent_peers = "'$PEERS'"|' $HOME/.project/config/config.toml
```

### 6. Configure pruning (optional)
```bash
nano $HOME/.project/config/app.toml
```

Modify pruning settings:
```toml
pruning = "custom"
pruning-keep-recent = "100"
pruning-keep-every = "0"
pruning-interval = "10"
```

### 7. Create service file
```bash
sudo tee /etc/systemd/system/project.service > /dev/null << EOF
[Unit]
Description=Project Node
After=network-online.target

[Service]
User=$USER
ExecStart=$(which project) start
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### 8. Start the service
```bash
sudo systemctl daemon-reload
sudo systemctl enable project
sudo systemctl start project
```

### 9. Check logs and sync status
```bash
# Check logs
sudo journalctl -u project -f --output=cat

# Check sync status
project status 2>&1 | jq .SyncInfo
```

### 10. Create wallet (optional)
```bash
project keys add mywallet
```

Or recover existing wallet:
```bash
project keys add mywallet --recover
```

## Troubleshooting

- Node not syncing: Check your peer connections with `curl localhost:26657/net_info | jq '.result.peers | length'`
- Out of memory errors: Increase swap space or server RAM
- Missing blocks: Ensure your clock is synchronized with `timedatectl`
```

## Solana Validator Template

```markdown
# Solana Validator Installation Guide

## Prerequisites
- **CPU:** 12+ cores, 2.8GHz+
- **RAM:** 128GB+
- **Storage:** 2TB+ NVMe SSD
- **OS:** Ubuntu 22.04 LTS
- **Network:** 1Gbps+ connection, stable with minimal packet loss
- **Solana CLI:** Latest version

## Installation Steps

### 1. Update system
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install dependencies
```bash
sudo apt install -y libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang cmake make libprotobuf-dev protobuf-compiler
```

### 3. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup component add rustfmt
rustup update
```

### 4. Install system tuning utilities
```bash
sudo apt install -y sysstat iotop
```

### 5. Clone and build Solana
```bash
git clone https://github.com/solana-labs/solana.git
cd solana
git checkout v1.14.10  # Replace with latest stable version
./scripts/cargo-install-all.sh .
```

### 6. Update PATH
```bash
echo 'export PATH="$HOME/solana/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 7. Configure and optimize system
```bash
sudo bash -c "cat > /etc/sysctl.d/21-solana-validator.conf << EOF
# Increase UDP buffer sizes
net.core.rmem_default = 134217728
net.core.rmem_max = 134217728
net.core.wmem_default = 134217728
net.core.wmem_max = 134217728

# Increase memory mapped files limit
vm.max_map_count = 1000000

# Increase number of allowed open files
fs.nr_open = 1000000
EOF"

sudo sysctl -p /etc/sysctl.d/21-solana-validator.conf

# Increase systemd file limit
sudo bash -c "cat > /etc/systemd/system.conf.d/10-solana-nofile.conf << EOF
[Manager]
DefaultLimitNOFILE=1000000
EOF"

sudo systemctl daemon-reload
```

### 8. Generate identity and vote account
```bash
mkdir -p ~/solana/validator-keypair
solana-keygen new -o ~/solana/validator-keypair/identity.json
solana-keygen new -o ~/solana/validator-keypair/vote-account.json
```

### 9. Configure Solana CLI
```bash
solana config set --url https://api.mainnet-beta.solana.com
```

### 10. Create data directory
```bash
mkdir -p ~/solana/ledger
```

### 11. Create startup script
```bash
mkdir -p ~/solana/bin
cat > ~/solana/bin/validator.sh << EOF
#!/bin/bash
exec solana-validator \\
  --identity ~/solana/validator-keypair/identity.json \\
  --vote-account ~/solana/validator-keypair/vote-account.json \\
  --ledger ~/solana/ledger \\
  --accounts ~/solana/accounts \\
  --rpc-port 8899 \\
  --dynamic-port-range 8000-8020 \\
  --entrypoint entrypoint.mainnet-beta.solana.com:8001 \\
  --entrypoint entrypoint2.mainnet-beta.solana.com:8001 \\
  --entrypoint entrypoint3.mainnet-beta.solana.com:8001 \\
  --expected-genesis-hash 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d \\
  --wal-recovery-mode skip_any_corrupted_record \\
  --limit-ledger-size \\
  --log ~/solana/validator.log
EOF

chmod +x ~/solana/bin/validator.sh
```

### 12. Create systemd service
```bash
sudo bash -c "cat > /etc/systemd/system/solana-validator.service << EOF
[Unit]
Description=Solana Validator
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=$USER
LimitNOFILE=1000000
Environment=\"PATH=/bin:/usr/bin:$HOME/.local/share/solana/install/active_release/bin:$HOME/solana/bin\"
ExecStart=$HOME/solana/bin/validator.sh

[Install]
WantedBy=multi-user.target
EOF"
```

### 13. Start the validator
```bash
sudo systemctl enable solana-validator
sudo systemctl start solana-validator
```

### 14. Monitor the validator
```bash
# Check status
sudo systemctl status solana-validator

# View logs
tail -f ~/solana/validator.log

# Check validator info
solana validators

# Check vote account
solana vote-account ~/solana/validator-keypair/vote-account.json
```

## Troubleshooting

- **High CPU/Memory usage**: Normal during startup, should stabilize
- **Validator not producing blocks**: Check your clock synchronization with `timedatectl`
- **RPC errors**: Ensure port 8899 is accessible
- **Ledger errors**: Check disk health with `sudo smartctl -a /dev/nvme0n1`
```

## General Blockchain CLI Tool Template

```markdown
# [Project] CLI Tool Installation Guide

## Prerequisites
- **OS:** Ubuntu 22.04 LTS / macOS / Windows 10+
- **Node.js:** v16+ (if Node.js based)
- **Go:** v1.19+ (if Go based)
- **Rust:** latest stable (if Rust based)

## Installation Steps

### For Linux (Ubuntu/Debian)

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl build-essential git

# Install the CLI
curl -L https://example.com/install.sh | bash

# Or for Go-based tools:
go install github.com/project/cli@latest

# Or for Rust-based tools:
cargo install project-cli
```

### For macOS

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install the CLI
brew install project-cli

# Or using curl
curl -L https://example.com/install.sh | bash
```

### For Windows

```powershell
# Using Powershell
Invoke-WebRequest -Uri "https://example.com/project-cli-windows.exe" -OutFile "project-cli.exe"
Move-Item -Path "project-cli.exe" -Destination "C:\Program Files\project-cli\"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\project-cli\", "User")
```

## Configuration

Initialize the CLI:
```bash
project-cli init
```

Configure with your API key:
```bash
project-cli config set api-key YOUR_API_KEY
```

## Common Commands

Check version:
```bash
project-cli --version
```

Get help:
```bash
project-cli --help
```

List resources:
```bash
project-cli list
```

Create a new resource:
```bash
project-cli create resource --name "My Resource" --type basic
```

## Troubleshooting

- **Command not found**: Ensure the CLI is in your PATH
- **Permission errors**: Try running with `sudo` on Linux/macOS
- **Network errors**: Check your internet connection and firewall settings
```

---

These templates should serve as a solid starting point for your project-specific installation guides. Remember to customize them with your project's actual commands, requirements, and configurations.
