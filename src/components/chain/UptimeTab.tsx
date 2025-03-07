
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  Activity, 
  HeartPulse, 
  User,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Percent
} from 'lucide-react';
import { Validator, ChainConfig } from '@/services/cosmosService';

interface UptimeTabProps {
  validators: Validator[];
  chain: ChainConfig;
}

const UptimeTab: React.FC<UptimeTabProps> = ({ validators, chain }) => {
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleValidatorClick = (validator: Validator) => {
    setSelectedValidator(validator);
    setIsSheetOpen(true);
  };

  // Sort validators by moniker name
  const sortedValidators = [...validators].sort((a, b) => a.moniker.localeCompare(b.moniker));

  const getUptimeColor = (uptime: string) => {
    const uptimeValue = parseFloat(uptime);
    if (uptimeValue >= 99) return "bg-green-500";
    if (uptimeValue >= 95) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderUptimeBar = (validator: Validator, index: number) => {
    const uptimeValue = parseFloat(validator.uptime);
    // Replace percentage sign if it exists
    const uptimeString = validator.uptime.replace('%', '');
    
    // Create an array of 50 elements for the uptime bars
    const bars = Array.from({ length: 50 }, (_, i) => {
      // Calculate if this bar should be filled based on the uptime percentage
      const shouldBeFilled = (i / 50) * 100 <= parseFloat(uptimeString);
      return (
        <div 
          key={i} 
          className={`h-4 w-1 ${shouldBeFilled ? getUptimeColor(validator.uptime) : 'bg-gray-300 dark:bg-gray-700'} mx-[0.5px]`}
        />
      );
    });

    return (
      <div 
        key={index} 
        className="mb-2 cursor-pointer" 
        onClick={() => handleValidatorClick(validator)}
      >
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium mr-1">{index + 1}.</span>
          <span className="text-xs font-medium truncate max-w-[150px]">{validator.moniker}</span>
          <Badge 
            variant="outline" 
            className="ml-auto text-xs"
          >
            {uptimeValue === 100 ? (
              <span className="text-green-500">100%</span>
            ) : (
              <span className={uptimeValue >= 95 ? "text-yellow-500" : "text-red-500"}>
                {validator.uptime}
              </span>
            )}
          </Badge>
        </div>
        <div className="flex items-center">{bars}</div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-purple-500" />
            Validator Uptime
          </CardTitle>
          <CardDescription>
            Block commitment history for {chain.display_name} validators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedValidators.map((validator, index) => renderUptimeBar(validator, index))}
          </div>
          <div className="mt-4 pt-2 border-t flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Committed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Precommitted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Missed</span>
            </div>
          </div>
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
                  Uptime information for {selectedValidator.moniker}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Recent Uptime</h3>
                  <Progress 
                    value={parseFloat(selectedValidator.uptime)} 
                    className="h-2 mb-1" 
                  />
                  <p className="text-sm text-muted-foreground">
                    {selectedValidator.uptime} of blocks signed
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Status</span>
                    </div>
                    <Badge variant={selectedValidator.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedValidator.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Voting Power</span>
                    </div>
                    <span>{selectedValidator.voting_power}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Commission</span>
                    </div>
                    <span>{selectedValidator.commission}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Address</span>
                    </div>
                    <span className="font-mono text-xs truncate max-w-[200px]">
                      {selectedValidator.address}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UptimeTab;
