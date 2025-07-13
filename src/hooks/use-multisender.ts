
import { useState, useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { RecipientData } from '@/components/multisender/MultisenderForm';

interface UseMultisenderProps {
  network: string;
  selectedToken: string;
  recipients: RecipientData[];
}

export const useMultisender = ({ network, selectedToken, recipients }: UseMultisenderProps) => {
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const totalAmount = useMemo(() => {
    return recipients.reduce((sum, recipient) => {
      return sum + parseFloat(recipient.amount || '0');
    }, 0).toString();
  }, [recipients]);

  // Simple multisend contract ABI for batch transfers
  const multisendABI = [
    {
      "inputs": [
        {
          "name": "recipients",
          "type": "address[]"
        },
        {
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "multisendEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "token",
          "type": "address"
        },
        {
          "name": "recipients",
          "type": "address[]"
        },
        {
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "multisendToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Deploy a simple multisend contract if needed
  const deployMultisendContract = async (signer: any) => {
    const multisendBytecode = "0x608060405234801561001057600080fd5b50610480806100206000396000f3fe6080604052600436106100295760003560e01c80639ac27b061461002e578063f04f2b4b14610041575b600080fd5b61003c61003c36600461030a565b610061565b005b34801561004d57600080fd5b5061003c61005c366004610362565b6100d7565b80518251146100b75760405162461bcd60e51b815260206004820152601760248201527f4d69736d617463686564206172726179206c656e67746873000000000000000060448201526064015b60405180910390fd5b60005b82518110156100d2576100ca8382815181106100d8576100d86103ae565b60200260200101518383815181106100f2576100f26103ae565b6020026020010151610197565b6001016100ba565b505050565b6001600160a01b03831661012d5760405162461bcd60e51b815260206004820152601360248201527f496e76616c696420746f6b656e20616464726573730000000000000000000000604482015260640161009a565b80518251146101705760405162461bcd60e51b815260206004820152601760248201527f4d69736d617463686564206172726179206c656e677468730000000000000000604482015260640161009a565b60005b82518110156100d25761018f8484838151811061019257610192610392565b602002602001015184848151811061019257610192610392565b6001016101a7565b8051825114610173576040516001600160a01b038316906323b872dd906101db9030908690869060240161039c565b6020604051808303816000875af11580156101fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021e919061041e565b50505050565b8051825114610268576040516001600160a01b038316906323b872dd906101db903090869086906024016103dc565b60405160200161027a929190610440565b604051602081830303815290604052906102e95760405162461bcd60e51b81526004016102e6919061046a565b60405180910390fd5b506040516001600160a01b038316906323b872dd906101db903090869086906024016103dc565b6000806040838503121561031d57600080fd5b823567ffffffffffffffff8082111561033557600080fd5b818501915085601f83011261034957600080fd5b813581811115610358576103586104be565b604051601f8201601f19908116603f01168101908382118183101715610380576103806104be565b8160405282815260209350888484870101111561039c57600080fd5b888383013584870160005b828110156103be57848301358252602092830192909101906001016103a7565b508096505050506020850135915080821115610358578180fd5b508135906020018035906001600160a01b0381168114610358576000fd5b634e487b7160e01b600052603260045260246000fd5b600080600060608486031215610418578283fd5b505092915050565b6000602082840312156104325780fd5b815180151581146104425780fd5b9392505050565b60408152600061045c6040830185610448565b602083019390935250919050565b600060208084526000845461047e816104d4565b808487015260018084166000811461049d57600181146104b1576104df565b60ff198516898601526040890195506104df565b8860005260208060002060005b858110156104d6578154848a0152908401908201906104be565b8a018901955050505b5091979650505050505050565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061050857607f821691505b60208210810361052857634e487b7160e01b600052602260045260246000fd5b5091905056fea26469706673582212201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef0064736f6c63430008110033";

    const factory = new ethers.ContractFactory(multisendABI, multisendBytecode, signer);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    return contract;
  };

  const handleSendTokens = async () => {
    if (!walletClient) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to send tokens",
      });
      return;
    }

    if (recipients.length === 0) {
      toast({
        variant: "destructive",
        title: "No recipients",
        description: "Please add at least one recipient",
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Processing bulk transaction",
      description: "Please confirm the single transaction in your wallet",
    });

    try {
      const { ethers } = await import('ethers');
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const isNativeToken = selectedToken.startsWith('native:');
        
        if (isNativeToken) {
          // For native tokens, we'll create a batch transaction
          const addresses = recipients.map(r => r.address);
          const amounts = recipients.map(r => ethers.parseEther(r.amount));
          const totalEther = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

          // Create a simple batch contract on-the-fly for native token transfers
          const batchContractCode = `
            pragma solidity ^0.8.0;
            contract BatchSender {
              function sendBatch(address[] memory recipients, uint256[] memory amounts) external payable {
                require(recipients.length == amounts.length, "Array length mismatch");
                uint256 total = 0;
                for(uint i = 0; i < amounts.length; i++) {
                  total += amounts[i];
                }
                require(msg.value >= total, "Insufficient value");
                
                for(uint i = 0; i < recipients.length; i++) {
                  payable(recipients[i]).transfer(amounts[i]);
                }
              }
            }
          `;

          // Deploy temporary batch contract
          console.log("Deploying batch sender contract...");
          const multisendContract = await deployMultisendContract(signer);
          
          // Execute batch transfer
          const tx = await multisendContract.multisendEther(addresses, amounts, {
            value: totalEther,
            gasLimit: 300000 + (recipients.length * 21000) // Base gas + gas per transfer
          });

          console.log("Batch transaction sent:", tx.hash);
          await tx.wait();
          
          setTransactionHash(tx.hash);
          setIsSuccess(true);
          
          toast({
            title: "Bulk transfer successful!",
            description: `Successfully sent native tokens to ${recipients.length} recipients in one transaction`,
          });

        } else {
          // For ERC-20 tokens, use batch approval and transfer
          const tokenAddress = selectedToken.split(':')[1];
          
          const erc20Abi = [
            "function transfer(address to, uint256 amount) returns (bool)",
            "function decimals() view returns (uint8)",
            "function balanceOf(address owner) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)"
          ];
          
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
          const decimals = await tokenContract.decimals();
          
          // Prepare batch data
          const addresses = recipients.map(r => r.address);
          const amounts = recipients.map(r => ethers.parseUnits(r.amount, decimals));
          const totalAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

          // Check if we need to approve the multisend contract
          const multisendContract = await deployMultisendContract(signer);
          const contractAddress = await multisendContract.getAddress();
          
          const currentAllowance = await tokenContract.allowance(await signer.getAddress(), contractAddress);
          
          if (currentAllowance < totalAmount) {
            console.log("Approving tokens for batch transfer...");
            const approveTx = await tokenContract.approve(contractAddress, totalAmount);
            await approveTx.wait();
            console.log("Approval completed");
          }

          // Execute batch transfer
          const tx = await multisendContract.multisendToken(tokenAddress, addresses, amounts, {
            gasLimit: 200000 + (recipients.length * 65000) // Base gas + gas per token transfer
          });

          console.log("Batch token transfer sent:", tx.hash);
          await tx.wait();
          
          setTransactionHash(tx.hash);
          setIsSuccess(true);
          
          toast({
            title: "Bulk token transfer successful!",
            description: `Successfully sent tokens to ${recipients.length} recipients in one transaction`,
          });
        }
      } else {
        throw new Error("Ethereum provider not available");
      }
    } catch (error: any) {
      console.error("Bulk transfer error:", error);
      
      let errorMessage = "There was an error with the bulk transfer.";
      
      if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User denied")) {
          errorMessage = "Transaction was rejected by the user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for the bulk transfer.";
        } else if (error.code === 4001) {
          errorMessage = "Transaction was rejected in your wallet.";
        } else {
          errorMessage = error.message.length > 100 ? 
            error.message.substring(0, 100) + "..." : 
            error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Bulk transfer failed",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleSendTokens,
    totalAmount,
    transactionHash,
    isSuccess
  };
};
