
import React from "react";

interface ErrorMessageProps {
  errorMessage: string | null;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  if (!errorMessage) return null;
  
  return (
    <div className="text-sm text-destructive border border-destructive/20 bg-destructive/10 p-3 rounded-md">
      {errorMessage}
    </div>
  );
};

export default ErrorMessage;
