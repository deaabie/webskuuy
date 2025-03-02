
import { ChainConfig } from "@/types/cosmos";

// Helper function to dynamically load chain configurations from JSON files
export const loadChainConfigsFromFiles = async (): Promise<any[]> => {
  try {
    // Load mainnet chains first
    const mainnetIndexResponse = await fetch('/chains/mainnet/index.json');
    const mainnetIndex = await mainnetIndexResponse.json();
    
    const mainnetChains = await Promise.all(
      mainnetIndex.map(async (filename: string) => {
        const response = await fetch(`/chains/mainnet/${filename}`);
        return response.json();
      })
    );
    
    // Then load testnet chains
    const testnetIndexResponse = await fetch('/chains/testnet/index.json');
    const testnetIndex = await testnetIndexResponse.json();
    
    const testnetChains = await Promise.all(
      testnetIndex.map(async (filename: string) => {
        const response = await fetch(`/chains/testnet/${filename}`);
        return response.json();
      })
    );
    
    return [...mainnetChains, ...testnetChains];
  } catch (error) {
    console.error("Error loading chain configurations from files:", error);
    return [];
  }
};
