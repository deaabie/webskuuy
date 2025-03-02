
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { faucetService } from "@/services/faucetService";

interface AddressInputProps {
  address: string;
  setAddress: (address: string) => void;
  setMainnetBalance: (balance: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const AddressInput = ({ 
  address, 
  setAddress, 
  setMainnetBalance, 
  setLoading 
}: AddressInputProps) => {
  
  // Function to validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    // Only check balance if there's a valid address
    if (isValidAddress(newAddress)) {
      setLoading(true);
      try {
        const balance = await faucetService.getMainnetBalance(newAddress);
        setMainnetBalance(balance);
      } catch (error) {
        console.error("Error checking mainnet balance:", error);
        setMainnetBalance(null);
      } finally {
        setLoading(false);
      }
    } else {
      setMainnetBalance(null);
    }
  };

  return (
    <div>
      <Label htmlFor="wallet-address">Wallet Address</Label>
      <Input 
        id="wallet-address"
        placeholder="0x..." 
        value={address}
        onChange={handleAddressChange}
        className="mt-1"
      />
      
    </div>
  );
};

export default AddressInput;
