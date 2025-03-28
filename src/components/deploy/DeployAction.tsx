
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface DeployActionProps {
  isDeploying: boolean;
  handleDeploy: () => Promise<void>;
}

const DeployAction = ({ isDeploying, handleDeploy }: DeployActionProps) => {
  return (
    <div className="space-y-4">
      <Button 
        className="w-full py-6 text-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
        onClick={handleDeploy}
        disabled={isDeploying}
        variant="default"
      >
        {isDeploying ? "DEPLOYING..." : "DEPLOY CONTRACT"}
      </Button>
      
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center">
        <span>Need help?</span>
        <a href="https://docs.skuuy.com/deploy" target="_blank" rel="noopener noreferrer" className="ml-2 flex items-center text-primary hover:underline">
          View documentation <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default DeployAction;
