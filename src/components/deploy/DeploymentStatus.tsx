
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { DeploymentStatus as DeploymentStatusType } from './types';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface DeploymentStatusProps {
  status: DeploymentStatusType;
  explorerUrl?: string;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ 
  status,
  explorerUrl 
}) => {
  if (status.status === 'idle') {
    return null;
  }

  if (status.status === 'compiling' || status.status === 'deploying') {
    return (
      <Alert className="mt-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <Loader2 className="h-5 w-5 animate-spin text-yellow-500 mr-2" />
        <AlertTitle className="text-yellow-700 dark:text-yellow-400">
          {status.status === 'compiling' ? 'Compiling Contract' : 'Deploying Contract'}
        </AlertTitle>
        <AlertDescription className="text-yellow-600 dark:text-yellow-300">
          {status.message || (status.status === 'compiling' 
            ? 'Your contract is being compiled. This might take a few moments...' 
            : 'Your contract is being deployed to the blockchain. This might take a few moments...')}
        </AlertDescription>
      </Alert>
    );
  }

  if (status.status === 'error') {
    return (
      <Alert className="mt-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <AlertTitle className="text-red-700 dark:text-red-400">
          Deployment Failed
        </AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-300">
          {status.message || 'There was an error deploying your contract. Please check your code and try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (status.status === 'success') {
    return (
      <Alert className="mt-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
        <AlertTitle className="text-green-700 dark:text-green-400">
          Deployment Successful
        </AlertTitle>
        <AlertDescription className="space-y-2">
          <p className="text-green-600 dark:text-green-300">
            Your contract has been successfully deployed!
          </p>
          <div className="pt-2 space-y-1">
            <p className="text-sm font-medium">Contract Address:</p>
            <code className="text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
              {status.contractAddress}
            </code>
          </div>
          {status.txHash && explorerUrl && (
            <div className="pt-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-1 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                onClick={() => window.open(`${explorerUrl.replace('/tx/', '/address/')}${status.contractAddress}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> View Contract
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-1 ml-2 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                onClick={() => window.open(`${explorerUrl}${status.txHash}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> View Transaction
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DeploymentStatus;
