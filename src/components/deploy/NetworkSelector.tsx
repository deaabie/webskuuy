
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworkManagement } from "@/hooks/use-network-management";
import NetworkGrid from "./NetworkGrid";
import AddNetworkDialog from "./AddNetworkDialog";

interface NetworkSelectionProps {
  onNetworkChange: (networkId: string) => void;
}

const NetworkSelector = ({ onNetworkChange }: NetworkSelectionProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [networkMode, setNetworkMode] = useState("testnet");
  const [showAddNetworkDialog, setShowAddNetworkDialog] = useState(false);
  
  const {
    customNetworks,
    newNetwork,
    formErrors,
    testnets,
    mainnets,
    resetNewNetwork,
    addCustomNetwork,
    updateNetworkField
  } = useNetworkManagement();

  // Forward selected network to parent component
  useEffect(() => {
    if (selectedNetwork) {
      onNetworkChange(selectedNetwork);
    }
  }, [selectedNetwork, onNetworkChange]);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
  };

  const openAddNetworkDialog = () => {
    resetNewNetwork();
    setShowAddNetworkDialog(true);
  };

  const handleAddNetwork = () => {
    const success = addCustomNetwork();
    if (success) {
      setShowAddNetworkDialog(false);
    }
  };

  const handleNetworkFormChange = (field: string, value: string | number) => {
    updateNetworkField(field, value);
  };

  return (
    <div>
      <Tabs defaultValue="testnet" className="w-full" onValueChange={setNetworkMode}>
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50">
          <TabsTrigger value="testnet" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Testnet</TabsTrigger>
          <TabsTrigger value="mainnet" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Mainnet</TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="testnet" className="space-y-4 mt-4">
          <NetworkGrid 
            networks={testnets}
            selectedNetwork={selectedNetwork}
            onNetworkSelect={handleNetworkSelect}
          />
        </TabsContent>
        
        <TabsContent value="mainnet" className="space-y-4 mt-4">
          <NetworkGrid 
            networks={mainnets}
            selectedNetwork={selectedNetwork}
            onNetworkSelect={handleNetworkSelect}
          />
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 mt-4">
          <NetworkGrid 
            networks={customNetworks}
            selectedNetwork={selectedNetwork}
            onNetworkSelect={handleNetworkSelect}
            showAddNetwork={true}
            onAddNetworkClick={openAddNetworkDialog}
            emptyMessage="No custom networks added yet. Click the 'Add Network' card to create one."
          />
        </TabsContent>
      </Tabs>

      <AddNetworkDialog
        open={showAddNetworkDialog}
        onOpenChange={setShowAddNetworkDialog}
        newNetwork={newNetwork}
        formErrors={formErrors}
        onInputChange={handleNetworkFormChange}
        onAddNetwork={handleAddNetwork}
      />
    </div>
  );
};

export default NetworkSelector;
