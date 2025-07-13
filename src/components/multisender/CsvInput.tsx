
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RecipientData } from './MultisenderForm';

interface CsvInputProps {
  onRecipientsChange: (recipients: RecipientData[]) => void;
}

const CsvInput = ({ onRecipientsChange }: CsvInputProps) => {
  const [csvText, setCsvText] = useState("");

  const sampleCsv = `0x1234567890123456789012345678901234567890,1.5
0x2345678901234567890123456789012345678901,2.0
0x3456789012345678901234567890123456789012,0.5`;

  const parseCsv = () => {
    if (!csvText.trim()) {
      toast({
        variant: "destructive",
        title: "Empty CSV",
        description: "Please enter CSV data or upload a file",
      });
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      const recipients: RecipientData[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [address, amount] = line.split(',').map(item => item.trim());
        
        if (!address || !amount) {
          toast({
            variant: "destructive",
            title: "Invalid CSV format",
            description: `Line ${i + 1}: Both address and amount are required`,
          });
          return;
        }

        if (!address.startsWith('0x') || address.length !== 42) {
          toast({
            variant: "destructive",
            title: "Invalid address format",
            description: `Line ${i + 1}: Address must be a valid Ethereum address`,
          });
          return;
        }

        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
          toast({
            variant: "destructive",
            title: "Invalid amount",
            description: `Line ${i + 1}: Amount must be a positive number`,
          });
          return;
        }

        recipients.push({ address, amount });
      }

      if (recipients.length === 0) {
        toast({
          variant: "destructive",
          title: "No valid recipients",
          description: "Please check your CSV format",
        });
        return;
      }

      onRecipientsChange(recipients);
      toast({
        title: "CSV imported successfully",
        description: `Imported ${recipients.length} recipients`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "CSV parsing error",
        description: "Please check your CSV format and try again",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_multisender.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">CSV Import</h3>
        <Button onClick={downloadSample} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Sample
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="csv-upload">Upload CSV File</Label>
            <div className="mt-2">
              <input
                id="csv-upload"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('csv-upload')?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose CSV File
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            or
          </div>

          <div>
            <Label htmlFor="csv-text">Paste CSV Data</Label>
            <Textarea
              id="csv-text"
              placeholder="address,amount&#10;0x1234...,1.5&#10;0x2345...,2.0"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              className="font-mono"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            <p><strong>Format:</strong> address,amount (one per line)</p>
            <p><strong>Example:</strong> 0x1234567890123456789012345678901234567890,1.5</p>
          </div>

          <Button onClick={parseCsv} className="w-full">
            Import Recipients
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CsvInput;
