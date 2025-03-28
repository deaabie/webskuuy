
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
  CalendarClock,
  Globe,
  CircleUser,
  FileText
} from 'lucide-react';
import { Validator } from '@/services/cosmosService';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

  // Filter active validators and sort by voting power (descending)
  // Then limit to a maximum of 100 validators
  const filteredAndSortedValidators = [...validators]
    .filter(validator => validator.status === 'Active')
    .sort((a, b) => parseFloat(b.voting_power) - parseFloat(a.voting_power))
    .slice(0, 100);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Validators</CardTitle>
          <CardDescription>Showing top 100 active validators by voting power. Click on validator name to see more details.</CardDescription>
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
              {filteredAndSortedValidators.map((validator, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        {validator.image ? (
                          <AvatarImage src={validator.image} alt={validator.moniker} />
                        ) : (
                          <AvatarFallback>{getInitials(validator.moniker)}</AvatarFallback>
                        )}
                      </Avatar>
                      <Button 
                        variant="link"
                        className="p-0 h-auto font-medium text-primary cursor-pointer"
                        onClick={() => handleValidatorClick(validator)}
                      >
                        {validator.moniker}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]">{validator.address}</TableCell>
                  <TableCell>{formatNumber(validator.voting_power)}</TableCell>
                  <TableCell>{validator.commission}</TableCell>
                  <TableCell>
                    <Badge variant="default">
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
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedValidator && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    {selectedValidator.image ? (
                      <AvatarImage src={selectedValidator.image} alt={selectedValidator.moniker} />
                    ) : (
                      <AvatarFallback>{getInitials(selectedValidator.moniker)}</AvatarFallback>
                    )}
                  </Avatar>
                  <SheetTitle className="flex items-center gap-2">
                    {selectedValidator.moniker}
                  </SheetTitle>
                </div>
                <SheetDescription>
                  Validator Information
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
                      <span className="font-medium">Validator Address</span>
                    </div>
                    <span className="font-mono text-xs truncate max-w-[200px]">{selectedValidator.address}</span>
                  </div>

                  <Separator />

                  {selectedValidator.account_address && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CircleUser className="h-4 w-4 text-indigo-500" />
                          <span className="font-medium">Account Address</span>
                        </div>
                        <span className="font-mono text-xs truncate max-w-[200px]">{selectedValidator.account_address}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {selectedValidator.website && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-cyan-500" />
                          <span className="font-medium">Website</span>
                        </div>
                        <a 
                          href={selectedValidator.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline truncate max-w-[200px]"
                        >
                          {selectedValidator.website}
                        </a>
                      </div>
                      <Separator />
                    </>
                  )}
                  
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

                  {selectedValidator.details && (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">Details</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedValidator.details}</p>
                      </div>
                    </>
                  )}
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
