
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { ethers } from 'https://esm.sh/ethers@6.8.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Get private key from environment variable
const FAUCET_PRIVATE_KEY = Deno.env.get('FAUCET_PRIVATE_KEY');

if (!FAUCET_PRIVATE_KEY) {
  console.error('FAUCET_PRIVATE_KEY environment variable is not set');
}

// Define RPC endpoints and network configuration - updated to latest testnet networks
const NETWORK_CONFIG = {
  ethereum_sepolia: {
    rpcUrl: Deno.env.get('ETHEREUM_SEPOLIA_RPC_URL') || 'https://sepolia.drpc.org',
    chainId: 11155111, // Sepolia
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  ethereum_holesky: {
    rpcUrl: Deno.env.get('ETHEREUM_HOLESKY_RPC_URL') || 'https://ethereum-holesky.publicnode.com',
    chainId: 17000, // Holesky
    name: 'Ethereum Holesky',
    symbol: 'ETH',
    explorer: 'https://holesky.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  base_sepolia: {
    rpcUrl: Deno.env.get('ETHEREUM_BASE_RPC_URL') || 'https://sepolia.base.org',
    chainId: 84532, // Base Sepolia
    name: 'Base Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.basescan.org/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/base.png'
  },
  optimism_sepolia: {
    rpcUrl: Deno.env.get('ETHEREUM_OPTIMISM_RPC_URL') || 'https://sepolia.optimism.io',
    chainId: 11155420, // Optimism Sepolia
    name: 'Optimism Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia-optimism.etherscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  arbitrum_sepolia: {
    rpcUrl: Deno.env.get('ETHEREUM_ARBITRUM_RPC_URL') || 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 421614, // Arbitrum Sepolia
    name: 'Arbitrum Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.arbiscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  },
  blast_sepolia: {
    rpcUrl: 'https://sepolia.blast.io',
    chainId: 168587773, // Blast Sepolia
    name: 'Blast Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.blastscan.io/tx/',
    imageUrl: 'https://raw.githubusercontent.com/deaabie/images/refs/heads/main/Ethereum.png'
  }
}

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Amount to send for each claim (in ether)
const CLAIM_AMOUNT = "0.001"

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Helper function to get client IP
function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Helper function to validate Ethereum address
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Helper function to sanitize input
function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500); // Limit length and trim whitespace
}

// Rate limiting check
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  try {
    const { count } = await supabase
      .from('faucet_claims')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(windowStart).toISOString())
      .eq('address', ip); // Using address field to store IP for rate limiting
    
    return (count || 0) < MAX_REQUESTS_PER_WINDOW;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow request if rate limit check fails
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const clientIP = getClientIP(req);
  console.log(`Request from IP: ${clientIP}`);

  try {
    // Check rate limiting
    const withinRateLimit = await checkRateLimit(clientIP);
    if (!withinRateLimit) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      )
    }

    // Parse the request
    const { address, network, reason } = await req.json()

    // Validate the request
    if (!address || !network) {
      return new Response(
        JSON.stringify({ error: 'Address and network are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate and sanitize inputs
    if (!isValidEthereumAddress(address)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const sanitizedReason = reason ? sanitizeInput(reason) : 'No reason provided';

    // Get network configuration
    const networkConfig = NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG]
    if (!networkConfig) {
      return new Response(
        JSON.stringify({ error: 'Invalid network specified' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check for recent claims from the same address
    const { data: existingClaims, error: fetchError } = await supabase
      .from('faucet_claims')
      .select('created_at, tx_hash')
      .eq('address', address.toLowerCase())
      .eq('network', network)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching existing claims:', fetchError)
      throw new Error('Failed to check claim history')
    }

    // Check cooldown period (24 hours)
    if (existingClaims && existingClaims.length > 0) {
      const lastClaim = new Date(existingClaims[0].created_at)
      const cooldownTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000)
      
      if (cooldownTime > new Date()) {
        const timeLeftHours = Math.ceil((cooldownTime.getTime() - new Date().getTime()) / (1000 * 60 * 60))
        return new Response(
          JSON.stringify({ 
            error: 'Cooldown period',
            message: `You can claim again in approximately ${timeLeftHours} hours`,
            cooldown: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        )
      }
    }

    // Verify private key is available
    if (!FAUCET_PRIVATE_KEY) {
      console.error('FAUCET_PRIVATE_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Faucet configuration error. Please contact administrator.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Set up a provider with the network's RPC URL
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)
    
    // Create a wallet with the private key
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider)
    
    // Check wallet balance to ensure sufficient funds
    const balance = await wallet.provider.getBalance(wallet.address)
    if (balance < ethers.parseEther(CLAIM_AMOUNT)) {
      console.error(`Insufficient funds in faucet wallet for ${network}`)
      return new Response(
        JSON.stringify({ error: 'Faucet is currently out of funds. Please try again later or contact the administrator.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Send transaction
    console.log(`Sending ${CLAIM_AMOUNT} ${networkConfig.symbol} to ${address} on ${networkConfig.name}`)

    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(CLAIM_AMOUNT),
      gasLimit: 21000, // Standard gas limit for ETH transfers
      maxFeePerGas: ethers.parseUnits("5", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("1", "gwei")
    })

    console.log(`Transaction sent: ${tx.hash}`)

    // Record the claim in the database
    const { error: insertError } = await supabase
      .from('faucet_claims')
      .insert([
        { 
          address: address.toLowerCase(), 
          network,
          reason: sanitizedReason,
          tx_hash: tx.hash,
          amount: CLAIM_AMOUNT,
          status: 'pending'
        }
      ])

    if (insertError) {
      console.error('Error recording claim:', insertError)
      // Continue anyway since the transaction was sent
    }

    // Set up a background task to update the transaction status
    const updateTransactionStatus = async () => {
      try {
        // Wait for transaction to be mined
        const receipt = await tx.wait()
        
        // Update the transaction status in the database
        const { error: updateError } = await supabase
          .from('faucet_claims')
          .update({ status: 'completed' })
          .eq('tx_hash', tx.hash)
        
        if (updateError) {
          console.error('Error updating transaction status:', updateError)
        }
      } catch (error) {
        console.error('Error waiting for transaction confirmation:', error)
        
        // Update the transaction status to failed
        const { error: updateError } = await supabase
          .from('faucet_claims')
          .update({ status: 'failed' })
          .eq('tx_hash', tx.hash)
        
        if (updateError) {
          console.error('Error updating transaction status to failed:', updateError)
        }
      }
    }

    // Use Deno's EdgeRuntime.waitUntil to run the task in the background
    EdgeRuntime.waitUntil(updateTransactionStatus())

    // Make sure the explorer URL is properly formatted
    let explorerUrl = networkConfig.explorer;
    if (!explorerUrl.endsWith('/')) {
      explorerUrl += '/';
    }
    if (!explorerUrl.endsWith('tx/')) {
      explorerUrl = explorerUrl.endsWith('/') ? explorerUrl + 'tx/' : explorerUrl + '/tx/';
    }
    
    // Return the transaction details with fixed explorer URL
    return new Response(
      JSON.stringify({
        success: true,
        txHash: tx.hash,
        amount: CLAIM_AMOUNT,
        network: networkConfig.name,
        symbol: networkConfig.symbol,
        explorerUrl: explorerUrl + tx.hash
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Log the error for debugging
    console.error('Faucet error:', error)
    
    // Return a generic error message to the client
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process the request',
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
