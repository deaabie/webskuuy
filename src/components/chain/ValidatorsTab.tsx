
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  User,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Percent,
  Heart,
  Activity,
  CalendarClock
} from 'lucide-react';
import { Validator } from '@/services/cosmosService';

interface ValidatorsTabProps {
  validators: Validator[];
  formatNumber: (num: number | string) => string;
}

const ValidatorsTab: React.FC<ValidatorsTabProps> = ({ validators, formatNumber }) => {
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleValidatorClick = (validator: Validator) => {
    setSelectedValidator(validator);
    setIsSheetOpen(true);
  };

  // Sort validators by voting power (descending)
  const sortedValidators = [...validators].sort((a, b) => 
    parseFloat(b.voting_power) - parseFloat(a.voting_power)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validators</CardTitle>
          <CardDescription>Click on validator name to see more details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Moniker</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Voting Power</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedValidators.map((validator, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <span 
                      className="cursor-pointer text-primary hover:underline"
                      onClick={() => handleValidatorClick(validator)}
                    >
                      {validator.moniker}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{validator.address}</TableCell>
                  <TableCell>{formatNumber(validator.voting_power)}</TableCell>
                  <TableCell>{validator.commission}</TableCell>
                  <TableCell>
                    <Badge variant={validator.status === 'Active' ? 'default' : 'secondary'}>
                      {validator.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{validator.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Validator Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          {selectedValidator && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-500" />
                  Validator Details
                </SheetTitle>
                <SheetDescription>
                  Information about {selectedValidator.moniker}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Moniker</span>
                    </div>
                    <span>{selectedValidator.moniker}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Status</span>
                    </div>
                    <Badge variant={selectedValidator.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedValidator.status}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Jailed Status</span>
                    </div>
                    <Badge variant="outline">
                      Not Jailed
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Address</span>
                    </div>
                    <span className="font-mono text-xs truncate max-w-[200px]">{selectedValidator.address}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-pink-500" />
                      <span className="font-medium">Commission</span>
                    </div>
                    <span>{selectedValidator.commission}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Uptime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={parseFloat(selectedValidator.uptime)} className="w-[100px] h-2" />
                      <span>{selectedValidator.uptime}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Voting Power</span>
                    </div>
                    <span>{formatNumber(selectedValidator.voting_power)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Last Update</span>
                    </div>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ValidatorsTab;
