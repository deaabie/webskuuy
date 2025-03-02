
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  errorMessage: string | null;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  if (!errorMessage) return null;
  
  return (
    <div className="text-sm text-destructive border border-destructive/20 bg-destructive/10 p-3 rounded-md flex gap-2">
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
      <div>{errorMessage}</div>
    </div>
  );
};

export default ErrorMessage;
