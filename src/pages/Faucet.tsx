
import FaucetHeader from "@/components/faucet/FaucetHeader";
import FaucetForm from "@/components/faucet/FaucetForm";
import FaucetInfo from "@/components/faucet/FaucetInfo";
import FaucetFooter from "@/components/faucet/FaucetFooter";
import { NETWORK_CONFIG } from "@/integrations/supabase/client";

const Faucet = () => {
  // Use the network configuration directly
  const networks = Object.values(NETWORK_CONFIG);
  
  return (
    <div className="container max-w-4xl py-12">
      <FaucetHeader 
        title="Testnet Faucet"
        description="Get testnet tokens for development and testing purposes. Each request provides 0.001 tokens with a 24-hour cooldown period."
      />

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <FaucetForm networks={networks} />
        <FaucetInfo />
      </div>

      <FaucetFooter />
    </div>
  );
};

export default Faucet;
