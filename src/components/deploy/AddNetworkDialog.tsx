
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NetworkConfig } from "@/components/faucet/types";

interface AddNetworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newNetwork: Partial<NetworkConfig>;
  formErrors: Record<string, string>;
  onInputChange: (field: string, value: string | number) => void;
  onAddNetwork: () => void;
}

const AddNetworkDialog = ({ 
  open, 
  onOpenChange, 
  newNetwork, 
  formErrors, 
  onInputChange, 
  onAddNetwork 
}: AddNetworkDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Network</DialogTitle>
          <DialogDescription>
            Enter the details of your custom blockchain network
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="networkName">Network Name</Label>
            <Input
              id="networkName"
              placeholder="My Custom Network"
              value={newNetwork.name || ""}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="networkId">Network ID</Label>
            <Input
              id="networkId"
              placeholder="custom_testnet"
              value={newNetwork.id || ""}
              onChange={(e) => onInputChange('id', e.target.value)}
              className={formErrors.id ? "border-red-500" : ""}
            />
            {formErrors.id && <p className="text-xs text-red-500">{formErrors.id}</p>}
            <p className="text-xs text-muted-foreground">
              A unique identifier, e.g., "custom_testnet"
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="chainId">Chain ID</Label>
            <Input
              id="chainId"
              type="number"
              placeholder="12345"
              value={newNetwork.chainId || ""}
              onChange={(e) => onInputChange('chainId', parseInt(e.target.value) || 0)}
              className={formErrors.chainId ? "border-red-500" : ""}
            />
            {formErrors.chainId && <p className="text-xs text-red-500">{formErrors.chainId}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="symbol">Token Symbol</Label>
            <Input
              id="symbol"
              placeholder="ETH"
              value={newNetwork.symbol || ""}
              onChange={(e) => onInputChange('symbol', e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="rpcUrl">RPC URL</Label>
            <Input
              id="rpcUrl"
              placeholder="https://rpc.example.com"
              value={newNetwork.rpcUrl || ""}
              onChange={(e) => onInputChange('rpcUrl', e.target.value)}
              className={formErrors.rpcUrl ? "border-red-500" : ""}
            />
            {formErrors.rpcUrl && <p className="text-xs text-red-500">{formErrors.rpcUrl}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="explorer">Block Explorer URL</Label>
            <Input
              id="explorer"
              placeholder="https://explorer.example.com/tx/"
              value={newNetwork.explorer || ""}
              onChange={(e) => onInputChange('explorer', e.target.value)}
              className={formErrors.explorer ? "border-red-500" : ""}
            />
            {formErrors.explorer && <p className="text-xs text-red-500">{formErrors.explorer}</p>}
            <p className="text-xs text-muted-foreground">
              Make sure to include /tx/ at the end for transaction links
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddNetwork}>
            Add Network
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNetworkDialog;
