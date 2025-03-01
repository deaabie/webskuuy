
import FaucetHeader from "@/components/faucet/FaucetHeader";
import FaucetForm from "@/components/faucet/FaucetForm";
import FaucetInfo from "@/components/faucet/FaucetInfo";
import FaucetFooter from "@/components/faucet/FaucetFooter";
import { NetworkConfig } from "@/components/faucet/types";

const NETWORKS: NetworkConfig[] = [
  { id: "ethereum_sepolia", name: "Ethereum Sepolia", symbol: "ETH" },
  { id: "ethereum_holesky", name: "Ethereum Holesky", symbol: "ETH" },
  { id: "ethereum_base", name: "Ethereum Base", symbol: "ETH" },
  { id: "ethereum_optimism", name: "Ethereum Optimism", symbol: "ETH" },
  { id: "ethereum_arbitrum", name: "Ethereum Arbitrum", symbol: "ETH" },
];

const Faucet = () => {
  return (
    <div className="container max-w-4xl py-12">
      <FaucetHeader 
        title="Testnet Faucet"
        description="Get testnet tokens for development and testing purposes. Each request provides 0.001 tokens with a 24-hour cooldown period."
      />

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <FaucetForm networks={NETWORKS} />
        <FaucetInfo />
      </div>

      <FaucetFooter />
    </div>
  );
};

export default Faucet;
