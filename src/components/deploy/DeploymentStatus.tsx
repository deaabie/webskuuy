
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Plus } from 'lucide-react';

const mockDeployments = [
  {
    id: '1',
    name: 'MyToken',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    network: 'Ethereum Sepolia',
    timestamp: '2023-08-10T14:25:00Z',
    status: 'Success',
  },
  {
    id: '2',
    name: 'GameItems',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    network: 'Polygon Mumbai',
    timestamp: '2023-08-05T09:15:00Z',
    status: 'Success',
  },
  {
    id: '3',
    name: 'NFTCollection',
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    network: 'Base Goerli',
    timestamp: '2023-07-28T16:40:00Z',
    status: 'Success',
  },
];

const DeploymentStatus = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const truncateAddress = (address: string) => {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Deployments</h3>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Custom RPC
        </Button>
      </div>

      <div className="space-y-4">
        {mockDeployments.map((deployment) => (
          <Card key={deployment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{deployment.name}</CardTitle>
                  <CardDescription className="text-xs">
                    Deployed on {formatDate(deployment.timestamp)}
                  </CardDescription>
                </div>
                <Badge variant={deployment.status === 'Success' ? 'default' : 'destructive'}>
                  {deployment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Network:</span> {deployment.network}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Address:</span> 
                  <code className="bg-muted px-1 rounded text-xs">
                    {truncateAddress(deployment.address)}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="text-xs">
                  View Contract
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Copy ABI
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockDeployments.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No deployments found</p>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatus;
