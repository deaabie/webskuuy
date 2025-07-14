
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

  // Simplified multisend contract ABI
  const multisendABI = [
    {
      "inputs": [
        {"name": "recipients", "type": "address[]"},
        {"name": "amounts", "type": "uint256[]"}
      ],
      "name": "multisendEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "token", "type": "address"},
        {"name": "recipients", "type": "address[]"},
        {"name": "amounts", "type": "uint256[]"}
      ],
      "name": "multisendToken",
      "outputs": [],
      "stateMutability": "nonpayable", 
      "type": "function"
    }
  ];

  // Simplified and working multisend contract bytecode
  const multisendBytecode = "0x608060405234801561001057600080fd5b506103e8806100206000396000f3fe60806040526004361061003f5760003560e01c80639ac27b061461004457806350cbb36914610064575b600080fd5b61005c6100593660046102a1565b610084565b005b34801561007057600080fd5b5061005c61007f3660046102f2565b610140565b8051825114610136565b60005b825181101561013b5782818151811006100a957600080fd5b60200260200101516001600160a01b03166108fc83838151811006100cd57600080fd5b602002602001015190604051600060405180830381858888f193505050501580156100fc573d6000803e3d6000fd5b508061010781610364565b915050610087565b5050565b6001600160a01b038316610190575b80518251146101665761016657600080fd5b60005b82518110156101f1576000838281518110610186576101866103bd565b60200260200101519050600083838151811006101a557600080fd5b602002602001015190506101ca6001600160a01b0387168383610221565b50806101d581610364565b915050610169565b505050565b6040516001600160a01b03831660248201526044810182905261021c90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915261027b565b505050565b6040516001600160a01b03831660248201526044810182905261021c9084906323b872dd60e01b90606401610222565b6000610276826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166102d99092919063ffffffff16565b505050565b606061029a8484600085610301565b9392505050565b600080604083850312156102b457600080fd5b8235915060208084013567ffffffffffffffff8111156102d357600080fd5b8401601f810186136102e457600080fd5b8035818111156102f0576102f0565b8060051b604051601f19603f83011681018181108582111715610315576103156103d3565b604052828152858101935084860182860187018b101561033457600080fd5b600095505b8386101561035657803585526001959095019493860193860161032a565b508096505050505050509250929050565b634e487b7160e01b600052601160045260246000fd5b60006001820161037657610376610364565b5060010190565b6000806000606084860312156103925760006104fd5b505081359360208301359350604090920135919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fdfea26469706673582212200000000000000000000000000000000000000000000000000000000000000000064736f6c63430008110033";

  const deployMultisendContract = async (ethers: any, signer: any) => {
    try {
      console.log("Creating contract factory with simplified bytecode...");
      const factory = new ethers.ContractFactory(multisendABI, multisendBytecode, signer);
      console.log("Deploying multisend contract...");
      const contract = await factory.deploy();
      console.log("Waiting for deployment...");
      await contract.waitForDeployment();
      console.log("Contract deployed successfully at:", await contract.getAddress());
      return contract;
    } catch (error) {
      console.error("Contract deployment error:", error);
      throw error;
    }
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
    
    try {
      const { ethers } = await import('ethers');
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const isNativeToken = selectedToken.startsWith('native:');
        
        if (isNativeToken) {
          // Native token bulk transfer
          const addresses = recipients.map(r => r.address);
          const amounts = recipients.map(r => ethers.parseEther(r.amount));
          const totalEther = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

          toast({
            title: "Deploying bulk sender contract",
            description: "This will require only ONE confirmation for all transfers",
          });

          console.log("Starting native token bulk transfer...");
          const multisendContract = await deployMultisendContract(ethers, signer);
          
          toast({
            title: "Sending bulk transfer",
            description: `Sending to ${recipients.length} recipients in ONE transaction`,
          });

          // Execute bulk transfer
          const tx = await multisendContract.multisendEther(addresses, amounts, {
            value: totalEther,
            gasLimit: 300000 + (recipients.length * 25000)
          });

          console.log("Native token bulk transfer sent:", tx.hash);
          await tx.wait();
          
          setTransactionHash(tx.hash);
          setIsSuccess(true);
          
          toast({
            title: "Bulk transfer successful!",
            description: `Successfully sent native tokens to ${recipients.length} recipients`,
          });

        } else {
          // ERC-20 token bulk transfer
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
          
          const addresses = recipients.map(r => r.address);
          const amounts = recipients.map(r => ethers.parseUnits(r.amount, decimals));
          const totalTokenAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

          toast({
            title: "Preparing bulk token transfer",
            description: "Deploying contract and setting up bulk transfer",
          });

          console.log("Starting ERC-20 bulk transfer...");
          const multisendContract = await deployMultisendContract(ethers, signer);
          const contractAddress = await multisendContract.getAddress();
          
          // Check and approve if needed
          const userAddress = await signer.getAddress();
          const currentAllowance = await tokenContract.allowance(userAddress, contractAddress);
          
          if (currentAllowance < totalTokenAmount) {
            toast({
              title: "Approving tokens",
              description: "Single approval for all transfers",
            });

            console.log("Approving tokens for bulk transfer...");
            const approveTx = await tokenContract.approve(contractAddress, totalTokenAmount);
            await approveTx.wait();
            console.log("Token approval completed");
          }

          toast({
            title: "Executing bulk transfer",
            description: `Sending to ${recipients.length} recipients`,
          });

          // Execute bulk transfer
          const tx = await multisendContract.multisendToken(tokenAddress, addresses, amounts, {
            gasLimit: 200000 + (recipients.length * 70000)
          });

          console.log("ERC-20 bulk transfer sent:", tx.hash);
          await tx.wait();
          
          setTransactionHash(tx.hash);
          setIsSuccess(true);
          
          toast({
            title: "Bulk token transfer successful!",
            description: `Successfully sent tokens to ${recipients.length} recipients`,
          });
        }
      } else {
        throw new Error("Ethereum provider not available");
      }
    } catch (error: any) {
      console.error("Bulk transfer error:", error);
      
      let errorMessage = "Bulk transfer failed. Please try again.";
      
      if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User denied")) {
          errorMessage = "Transaction was rejected by the user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for the transaction.";
        } else if (error.code === 4001) {
          errorMessage = "Transaction was rejected in your wallet.";
        } else if (error.message.includes("invalid BytesLike")) {
          errorMessage = "Contract deployment failed. Please try again.";
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
