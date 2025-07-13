
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { RecipientData } from './MultisenderForm';

interface ManualInputProps {
  recipients: RecipientData[];
  onRecipientsChange: (recipients: RecipientData[]) => void;
}

const ManualInput = ({ recipients, onRecipientsChange }: ManualInputProps) => {
  const addRecipient = () => {
    onRecipientsChange([...recipients, { address: "", amount: "" }]);
  };

  const removeRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    onRecipientsChange(newRecipients);
  };

  const updateRecipient = (index: number, field: keyof RecipientData, value: string) => {
    const newRecipients = recipients.map((recipient, i) => 
      i === index ? { ...recipient, [field]: value } : recipient
    );
    onRecipientsChange(newRecipients);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recipients</h3>
        <Button onClick={addRecipient} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Recipient
        </Button>
      </div>

      {recipients.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No recipients added yet. Click "Add Recipient" to start.
            </p>
          </CardContent>
        </Card>
      )}

      {recipients.map((recipient, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`address-${index}`}>Wallet Address</Label>
                <Input
                  id={`address-${index}`}
                  placeholder="0x..."
                  value={recipient.address}
                  onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor={`amount-${index}`}>Amount</Label>
                  <Input
                    id={`amount-${index}`}
                    placeholder="0.0"
                    type="number"
                    step="any"
                    value={recipient.amount}
                    onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => removeRecipient(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManualInput;
