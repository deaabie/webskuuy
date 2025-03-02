
import { Button } from "@/components/ui/button";

interface ClaimButtonProps {
  loading: boolean;
  cooldown: boolean;
  mainnetBalance: string | null;
  onClick: () => void;
}

const ClaimButton = ({ 
  loading, 
  cooldown, 
  mainnetBalance, 
  onClick 
}: ClaimButtonProps) => {
  
  const isDisabled = loading || 
                     cooldown || 
                     !mainnetBalance || 
                     parseFloat(mainnetBalance) < 0.005;
  
  return (
    <Button 
      onClick={onClick} 
      disabled={isDisabled}
      className="w-full mt-2" 
      size="lg"
    >
      {loading ? "Processing..." : "Claim Tokens"}
    </Button>
  );
};

export default ClaimButton;
