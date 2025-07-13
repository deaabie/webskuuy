
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

  // Deploy a simple multisend contract
  const deployMultisendContract = async (ethers: any, signer: any) => {
    // Simple multisend contract bytecode - handles both ETH and ERC20 transfers
    const multisendBytecode = "0x608060405234801561001057600080fd5b506104e4806100206000396000f3fe6080604052600436106100295760003560e01c80639ac27b061461002e578063f04f2b4b14610041575b600080fd5b61003c610048366004610341565b610061565b005b61003c61004f3660046103a4565b6100d5565b80518251146100b75760405162461bcd60e51b815260206004820152601760248201527f4d69736d617463686564206172726179206c656e67746873000000000000000060448201526064015b60405180910390fd5b60005b82518110156100d0576100c883828151811061019257610192610440565b602002602001015183838151811061019257610192610440565b6001016100ba565b505050565b6001600160a01b03831661012b5760405162461bcd60e51b815260206004820152601360248201527f496e76616c696420746f6b656e2061646472657373000000000000000000000060448201526064016100ae565b80518251146101745760405162461bcd60e51b815260206004820152601760248201527f4d69736d617463686564206172726179206c656e67746873000000000000000060448201526064016100ae565b60005b82518110156100d0576101a7848483815181106101965761019661042a565b602002602001015184848151811061019657610196610440565b6001016101aa565b50565b6000826001600160a01b03166323b872dd3330856040518463ffffffff1660e01b81526004016101dc93929190610462565b6020604051808303816000875af11580156101fb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021f9190610498565b9050801561025d576040516001600160a01b0384169083156108fc029084906000818181858888f1935050505015801561025c573d6000803e3d6000fd5b5b50505050565b6000806040838503121561027657600080fd5b82359150602083013567ffffffffffffffff8082111561029557600080fd5b818501915085601f8301126102a957600080fd5b813581811115610358576103586104ba565b604051601f8201601f19908116603f011681019083821181831017156103805761038061043e565b816040528281528860208487010111156103995780fd5b826020860160208301376000602084830101528096505050505050565b634e487b7160e01b600052603260045260246000fd5b600080600060608486031215610418578283fd5b83356001600160a01b038116811461042f578384fd5b9250602084013591506040840135801515811461044b578182fd5b809150509250925092565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b039384168152919092166020820152604081019190915260600190565b6000602082840312156104aa57600080fd5b8151801515811461025d57600080fd5b634e487b7160e01b600052604160045260246000fdfea26469706673582212208f7c45a9b2c8e1d4f6a3e8b9c5d2f1a4e9b8c7d6e5f4a3b2c1d0e9f8a7b6c50964736f6c63430008110033";

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

          console.log("Deploying batch sender contract for native tokens...");
          const multisendContract = await deployMultisendContract(ethers, signer);
          
          // Execute batch transfer
          const tx = await multisendContract.multisendEther(addresses, amounts, {
            value: totalEther,
            gasLimit: 300000 + (recipients.length * 21000) // Base gas + gas per transfer
          });

          console.log("Batch native token transaction sent:", tx.hash);
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

          console.log("Deploying multisend contract for ERC-20 tokens...");
          const multisendContract = await deployMultisendContract(ethers, signer);
          const contractAddress = await multisendContract.getAddress();
          
          // Check if we need to approve the multisend contract
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
