import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";

// Fetch projects from Supabase
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No projects found");
      return [];
    }
    
    // Transform data to match our expected format
    const formattedProjects = data.map(project => ({
      id: project.id,
      name: project.name,
      categories: project.categories || [],
      description: project.description || "",
      logo: project.logo || "",
      status: project.status as "active" | "upcoming" | "ended",
      installation_guide: project.installation_guide || "",
      created_at: project.created_at,
      updated_at: project.updated_at
    }));
    
    return formattedProjects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
};

// Fetch single project by ID
export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
    
    if (!data) {
      console.error("Project not found:", id);
      throw new Error("Project not found");
    }
    
    return {
      id: data.id,
      name: data.name,
      categories: data.categories || [],
      description: data.description || "",
      logo: data.logo || "",
      status: data.status as "active" | "upcoming" | "ended",
      installation_guide: data.installation_guide || "",
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    throw error;
  }
};

// Create new project
export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
  try {
    // Check if a project with this name already exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('name', project.name)
      .maybeSingle();
    
    if (existingProject) {
      // Update the existing project instead
      return updateProjectByName(project);
    }
    
    // Otherwise, insert a new project
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: project.name,
        description: project.description,
        categories: project.categories,
        logo: project.logo,
        status: project.status,
        installation_guide: project.installation_guide
      }])
      .select();
    
    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("Failed to create project, no data returned");
      throw new Error("Failed to create project");
    }
    
    return {
      id: data[0].id,
      name: data[0].name,
      categories: data[0].categories || [],
      description: data[0].description || "",
      logo: data[0].logo || "",
      status: data[0].status as "active" | "upcoming" | "ended",
      installation_guide: data[0].installation_guide || "",
      created_at: data[0].created_at,
      updated_at: data[0].updated_at
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    throw error;
  }
};

// Update project by name (used for upsert operations)
const updateProjectByName = async (project: Omit<Project, "id">): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        description: project.description,
        categories: project.categories,
        logo: project.logo,
        status: project.status,
        installation_guide: project.installation_guide,
        updated_at: new Date().toISOString()
      })
      .eq('name', project.name)
      .select();
    
    if (error) {
      console.error("Error updating project by name:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("Failed to update project by name, no data returned");
      throw new Error("Failed to update project by name");
    }
    
    return {
      id: data[0].id,
      name: data[0].name,
      categories: data[0].categories || [],
      description: data[0].description || "",
      logo: data[0].logo || "",
      status: data[0].status as "active" | "upcoming" | "ended",
      installation_guide: data[0].installation_guide || "",
      created_at: data[0].created_at,
      updated_at: data[0].updated_at
    };
  } catch (error) {
    console.error(`Failed to update project ${project.name}:`, error);
    throw error;
  }
};

// Update project
export const updateProject = async (project: Project): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: project.name,
        description: project.description,
        categories: project.categories,
        logo: project.logo,
        status: project.status,
        installation_guide: project.installation_guide,
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id)
      .select();
    
    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("Failed to update project, no data returned");
      throw new Error("Failed to update project");
    }
    
    return {
      id: data[0].id,
      name: data[0].name,
      categories: data[0].categories || [],
      description: data[0].description || "",
      logo: data[0].logo || "",
      status: data[0].status as "active" | "upcoming" | "ended",
      installation_guide: data[0].installation_guide || "",
      created_at: data[0].created_at,
      updated_at: data[0].updated_at
    };
  } catch (error) {
    console.error(`Failed to update project ${project.id}:`, error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
    
    console.log(`Project ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    throw error;
  }
};

// Add sample projects to the database
export const addSampleProjects = async (): Promise<void> => {
  try {
    // Bitcoin Core
    await createProject({
      name: 'Bitcoin Core',
      description: 'The reference implementation of the Bitcoin protocol',
      categories: ['Bitcoin'],
      logo: 'https://bitcoin.org/img/icons/logotop.svg',
      status: 'active',
      installation_guide: `# Bitcoin Core Installation Guide

## Prerequisites
- **CPU:** 2+ cores
- **RAM:** 4GB minimum (8GB+ recommended)
- **Storage:** 500GB+ SSD (for full blockchain)
- **OS:** Ubuntu 20.04 LTS or later
- **Bandwidth:** Unlimited or 500GB+ monthly

## Installation Steps

### 1. Update your system
\`\`\`bash
sudo apt update
sudo apt upgrade -y
\`\`\`

### 2. Install dependencies
\`\`\`bash
sudo apt install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3 libssl-dev libevent-dev libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-program-options-dev libboost-test-dev libboost-thread-dev libminiupnpc-dev libzmq3-dev libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libqrencode-dev -y
\`\`\`

### 3. Download Bitcoin Core
\`\`\`bash
cd ~
wget https://bitcoincore.org/bin/bitcoin-core-24.0.1/bitcoin-24.0.1-x86_64-linux-gnu.tar.gz
\`\`\`

### 4. Verify and extract
\`\`\`bash
tar -xvf bitcoin-24.0.1-x86_64-linux-gnu.tar.gz
sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-24.0.1/bin/*
\`\`\`

### 5. Create Bitcoin directory and configuration
\`\`\`bash
mkdir -p ~/.bitcoin
nano ~/.bitcoin/bitcoin.conf
\`\`\`

Add the following to your config file:
\`\`\`
server=1
daemon=1
txindex=1
rpcuser=your_username
rpcpassword=your_secure_password
rpcallowip=127.0.0.1
\`\`\`

### 6. Start Bitcoin Core
\`\`\`bash
bitcoind -daemon
\`\`\`

### 7. Monitor the blockchain sync
\`\`\`bash
bitcoin-cli getblockchaininfo
\`\`\`

### 8. Create a service for auto-start (optional)
\`\`\`bash
sudo nano /etc/systemd/system/bitcoind.service
\`\`\`

Add:
\`\`\`
[Unit]
Description=Bitcoin daemon
After=network.target

[Service]
ExecStart=/usr/local/bin/bitcoind -daemon -conf=/home/YOUR_USERNAME/.bitcoin/bitcoin.conf -pid=/home/YOUR_USERNAME/.bitcoin/bitcoind.pid
PIDFile=/home/YOUR_USERNAME/.bitcoin/bitcoind.pid
Type=forking
Restart=always
RestartSec=30
User=YOUR_USERNAME
Group=YOUR_USERNAME

[Install]
WantedBy=multi-user.target
\`\`\`

Enable and start the service:
\`\`\`bash
sudo systemctl enable bitcoind
sudo systemctl start bitcoind
\`\`\`

## Troubleshooting

- Check logs: \`tail -f ~/.bitcoin/debug.log\`
- Check status: \`bitcoin-cli getblockchaininfo\`
- Restart daemon: \`bitcoin-cli stop && sleep 5 && bitcoind -daemon\``
    });

    // Celestia
    await createProject({
      name: 'Celestia',
      description: 'A modular consensus and data network',
      categories: ['Cosmos'],
      logo: 'https://raw.githubusercontent.com/celestiaorg/celestia-brand/97b3c673bcdd0ab9e9c2cac5881f5170bdba82dd/celestia-logo.svg',
      status: 'active',
      installation_guide: `# Celestia Node Installation Guide

## Prerequisites
- **CPU:** 4+ cores
- **RAM:** 8GB+
- **Storage:** 100GB+ SSD
- **OS:** Ubuntu 22.04 LTS
- **Go:** v1.21.0+

## Installation Steps

### 1. Update and install dependencies
\`\`\`bash
sudo apt update
sudo apt upgrade -y
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y
\`\`\`

### 2. Install Go
\`\`\`bash
ver="1.21.0"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
\`\`\`

Add Go to your PATH:
\`\`\`bash
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
\`\`\`

Verify Go installation:
\`\`\`bash
go version
\`\`\`

### 3. Install Celestia Node
\`\`\`bash
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node
git checkout tags/v0.11.0
make install
\`\`\`

Verify installation:
\`\`\`bash
celestia version
\`\`\`

### 4. Initialize Celestia Light Node
\`\`\`bash
celestia light init --p2p.network celestia
\`\`\`

### 5. Create a service file
\`\`\`bash
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-light.service
[Unit]
Description=Celestia Light Node
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=$(which celestia) light start --core.ip https://rpc-celestia.pops.one --p2p.network celestia
Restart=on-failure
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
\`\`\`

### 6. Start the service
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable celestia-light
sudo systemctl start celestia-light
\`\`\`

Check the status:
\`\`\`bash
sudo systemctl status celestia-light
\`\`\`

Check the logs:
\`\`\`bash
journalctl -u celestia-light -f -o cat
\`\`\`

### 7. Create wallet (optional)
\`\`\`bash
celestia light wallet create
\`\`\`

### 8. Get your node ID
\`\`\`bash
AUTH_TOKEN=$(celestia light auth admin --p2p.network celestia)
curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":0,"method":"p2p.Info","params":[]}' http://localhost:26658
\`\`\`

## Upgrading Your Node

When a new version is released:
\`\`\`bash
cd $HOME/celestia-node
git fetch
git checkout tags/vX.Y.Z  # replace with the new version
make install
sudo systemctl restart celestia-light
\`\`\`

## Troubleshooting

- Check node status: \`curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":0,"method":"header.GetSyncStatus","params":[]}' http://localhost:26658\`
- Restart service: \`sudo systemctl restart celestia-light\`
- Check logs: \`journalctl -u celestia-light -f -o cat\``
    });

    // Solana Validator
    await createProject({
      name: 'Solana Validator',
      description: 'Run a validator node on the Solana network',
      categories: ['Solana'],
      logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      status: 'active',
      installation_guide: `# Solana Validator Installation Guide

## Hardware Requirements
- **CPU:** 12 cores / 24 threads, 2.8GHz+
- **RAM:** 128GB+ DDR4
- **Storage:** 2TB+ NVMe SSD
- **OS:** Ubuntu 20.04 LTS
- **Network:** 1 Gbit/s symmetrical bandwidth, stable connection

## Installation Steps

### 1. Update and install dependencies
\`\`\`bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang cmake make libprotobuf-dev protobuf-compiler
\`\`\`

### 2. Install Rust
\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup component add rustfmt
rustup update
\`\`\`

### 3. Install system tuning utilities
\`\`\`bash
sudo apt -y install sysstat iotop
\`\`\`

### 4. Clone and build Solana from source
\`\`\`bash
git clone https://github.com/solana-labs/solana.git
cd solana
git checkout v1.16.14  # replace with the latest stable version
./scripts/cargo-install-all.sh --validator-only .
\`\`\`

### 5. Update your PATH
\`\`\`bash
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
\`\`\`

### 6. Generate identity key
\`\`\`bash
solana-keygen new -o ~/validator-keypair.json
\`\`\`

### 7. Create vote account
\`\`\`bash
solana-keygen new -o ~/vote-account-keypair.json
\`\`\`

### 8. Configure Solana CLI
\`\`\`bash
solana config set --url https://api.mainnet-beta.solana.com
\`\`\`

### 9. Create authorized withdrawer account (optional)
\`\`\`bash
solana-keygen new -o ~/authorized-withdrawer-keypair.json
\`\`\`

### 10. Create validator configuration file
\`\`\`bash
mkdir -p ~/solana/config
cat > ~/solana/config/validator.json << EOF
{
  "identity_pubkey": "$(solana-keygen pubkey ~/validator-keypair.json)",
  "vote_account_pubkey": "$(solana-keygen pubkey ~/vote-account-keypair.json)",
  "authorized_withdrawer_pubkey": "$(solana-keygen pubkey ~/authorized-withdrawer-keypair.json)"
}
EOF
\`\`\`

### 11. Create data directory with proper permissions
\`\`\`bash
mkdir -p ~/solana/ledger
\`\`\`

### 12. Set up validator startup script
\`\`\`bash
cat > ~/start-validator.sh << EOF
#!/bin/bash
exec solana-validator \\
  --identity ~/validator-keypair.json \\
  --vote-account ~/vote-account-keypair.json \\
  --entrypoint entrypoint.mainnet-beta.solana.com:8001 \\
  --entrypoint entrypoint2.mainnet-beta.solana.com:8001 \\
  --entrypoint entrypoint3.mainnet-beta.solana.com:8001 \\
  --entrypoint entrypoint4.mainnet-beta.solana.com:8001 \\
  --entrypoint entrypoint5.mainnet-beta.solana.com:8001 \\
  --known-validator 7Np41oeYqPefeNQEHSv1UDhYrehxin3NStELsSKCT4K2 \\
  --known-validator GdnSyH3YtwcxFvQrVVJMm1JhTS4QVX7MFsX56uJLUfiZ \\
  --known-validator DE1bawNcRJB9rVm3buyMVfr8mBEoyyu73NBovf2oXJsJ \\
  --known-validator CakcnaRDHka2gXyfbEd2d3xsvkJkqsLw2akB3zsN1D2S \\
  --ledger ~/solana/ledger \\
  --rpc-port 8899 \\
  --dynamic-port-range 8000-8020 \\
  --log ~/solana/validator.log \\
  --accounts ~/solana/accounts \\
  --limit-ledger-size \\
  --expected-genesis-hash 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d
EOF
chmod +x ~/start-validator.sh
\`\`\`

### 13. Create system service
\`\`\`bash
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
Environment="PATH=/bin:/usr/bin:/home/$USER/.local/share/solana/install/active_release/bin"
ExecStart=/home/$USER/start-validator.sh

[Install]
WantedBy=multi-user.target
EOF"
\`\`\`

### 14. Start the service
\`\`\`bash
sudo systemctl enable solana-validator
sudo systemctl start solana-validator
\`\`\`

### 15. Monitor your validator
\`\`\`bash
# Check service status
sudo systemctl status solana-validator

# View logs
tail -f ~/solana/validator.log

# Check validator information
solana validators

# Check vote account
solana vote-account ~/vote-account-keypair.json
\`\`\`

## Troubleshooting

- **Frequent crashes**: Check \`~/solana/validator.log\` for detailed error messages
- **Catching up**: New validators can take several days to catch up to the current ledger
- **High resource usage**: Ensure your hardware meets the minimum requirements
- **Cannot connect to RPC**: Check firewall settings for ports 8899-8001

## Maintenance and Updates

When a new version is released:
\`\`\`bash
cd ~/solana
git fetch
git checkout vX.Y.Z  # replace with new version
./scripts/cargo-install-all.sh --validator-only .
sudo systemctl restart solana-validator
\`\`\```
    });

    // Arbitrum Node
    await createProject({
      name: 'Arbitrum Node',
      description: 'Run a node on the Arbitrum One network',
      categories: ['EVM'],
      logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
      status: 'active',
      installation_guide: `# Arbitrum Node Installation Guide

## Prerequisites
- **CPU:** 8+ cores
- **RAM:** 16GB+
- **Storage:** 2TB+ SSD
- **OS:** Ubuntu 20.04 LTS
- **Bandwidth:** 1Gbps+ connection with at least 5TB monthly bandwidth
- **Docker:** Docker and Docker Compose installed

## Installation Steps

### 1. Update system and install dependencies
\`\`\`bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
\`\`\`

### 2. Install Docker
\`\`\`bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
\`\`\`

### 3. Install Docker Compose
\`\`\`bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
\`\`\`

### 4. Add your user to the docker group
\`\`\`bash
sudo usermod -aG docker $USER
\`\`\`
Log out and log back in for this to take effect, or run:
\`\`\`bash
newgrp docker
\`\`\`

### 5. Create a data directory for the node
\`\`\`bash
mkdir -p ~/arbitrum/data
cd ~/arbitrum
\`\`\`

### 6. Create a docker-compose.yml file
\`\`\`bash
cat > docker-compose.yml << EOF
version: "3.9"
services:
  nitro-node:
    container_name: nitro-node
    image: offchainlabs/nitro-node:v2.0.14-2baa4cb
    restart: always
    ports:
      - "8547:8547"
      - "8548:8548"
    volumes:
      - ./data:/home/user/.arbitrum
    command: >
      --l1.url https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
      --l2.chain-id 42161
      --http.api net,web3,eth,debug
      --http.corsdomain "*"
      --http.addr 0.0.0.0
      --http.vhosts "*"
EOF
\`\`\`

Replace \`YOUR_ALCHEMY_API_KEY\` with an actual API key from [Alchemy](https://www.alchemy.com/).

### 7. Start the node
\`\`\`bash
docker-compose up -d
\`\`\`

### 8. Check the logs
\`\`\`bash
docker-compose logs -f
\`\`\`

### 9. Create a systemd service file for automatic startup
\`\`\`bash
sudo bash -c "cat > /etc/systemd/system/arbitrum-node.service << EOF
[Unit]
Description=Arbitrum Node
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/$USER/arbitrum
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF"
\`\`\`

### 10. Enable and start the service
\`\`\`bash
sudo systemctl enable arbitrum-node
sudo systemctl start arbitrum-node
\`\`\`

### 11. Check your node's sync status
\`\`\`bash
curl -X POST http://localhost:8547 \\
  -H "Content-Type: application/json" \\
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'
\`\`\`

If it returns \`{"jsonrpc":"2.0","id":1,"result":false}\`, your node is fully synced.

To check the current block height:
\`\`\`bash
curl -X POST http://localhost:8547 \\
  -H "Content-Type: application/json" \\
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
\`\`\`

## Upgrading Your Node

To upgrade to a newer version:

1. Edit your docker-compose.yml file to update the image version
2. Run:
\`\`\`bash
docker-compose down
docker-compose pull
docker-compose up -d
\`\`\`

## Troubleshooting

- **Node not syncing**: Check your Ethereum L1 endpoint and ensure you have enough disk space
- **Connection errors**: Make sure ports 8547 and 8548 are accessible
- **High CPU/Memory usage**: This is normal during initial sync, but should stabilize afterward
- **Docker errors**: Check docker logs with \`docker logs nitro-node\`

## Maintenance

Regularly check for updates to the Arbitrum node software at [Offchain Labs GitHub](https://github.com/OffchainLabs/nitro) and update your node accordingly.`
    });
    
    console.log("Sample projects added successfully");
  } catch (error) {
    console.error("Failed to add sample projects:", error);
    throw error;
  }
};

// Update Project type in types.ts too
export const fetchProjectsByCategory = async (category: string): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .contains('categories', [category]);
    
    if (error) {
      console.error("Error fetching projects by category:", error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Transform data to match our expected format
    const formattedProjects = data.map(project => ({
      id: project.id,
      name: project.name,
      categories: project.categories || [],
      description: project.description || "",
      logo: project.logo || "",
      status: project.status as "active" | "upcoming" | "ended",
      installation_guide: project.installation_guide || "",
      created_at: project.created_at,
      updated_at: project.updated_at
    }));
    
    return formattedProjects;
  } catch (error) {
    console.error(`Failed to fetch projects by category ${category}:`, error);
    throw error;
  }
};
