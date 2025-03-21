
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DeployButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

const DeployButton: React.FC<DeployButtonProps> = ({ 
  loading, 
  disabled, 
  onClick 
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || loading}
      className="w-full mt-2" 
      size="lg"
    >
      {loading ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></span>
          DEPLOYING...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-5 w-5" />
          DEPLOY
        </>
      )}
    </Button>
  );
};

export default DeployButton;
