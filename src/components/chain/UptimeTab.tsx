
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { Activity, Search, User, Shield, ShieldCheck, ShieldAlert, BarChart, Clock, Hash, AlertTriangle, RefreshCw } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Validator, ChainConfig } from '@/services/cosmosService';
import { Button } from "@/components/ui/button";

interface UptimeTabProps {
  validators: Validator[];
  formatNumber: (num: number | string) => string;
  chain: ChainConfig;
}

const UptimeTab: React.FC<UptimeTabProps> = ({ validators, formatNumber, chain }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValidatorsRef = useRef<Validator[]>([]);
  const [blockHeight, setBlockHeight] = useState<number>(0);

  // Filter active validators only
  const activeValidators = validators.filter(v => v.status === 'Active');
  
  // Filter validators based on search term
  const filteredValidators = activeValidators.filter(validator => 
    validator.moniker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check for updates in validators data
  useEffect(() => {
    if (validators.length && prevValidatorsRef.current.length) {
      // Check if validators data has changed
      const hasChanged = JSON.stringify(validators) !== JSON.stringify(prevValidatorsRef.current);
      
      if (hasChanged) {
        setLastUpdated(new Date());
        // Update mock block height
        setBlockHeight(prev => prev + 1);
        // Show visual update indicator
        setIsUpdating(true);
        setTimeout(() => {
          setIsUpdating(false);
        }, 1000);
      }
    }
    
    prevValidatorsRef.current = [...validators];
  }, [validators]);

  const handleValidatorClick = (validator: Validator) => {
    setSelectedValidator(validator);
    setIsSheetOpen(true);
  };

  // Function to parse uptime string to get missed blocks count
  const getMissedBlocks = (uptime: string): number => {
    const uptimePercentage = parseFloat(uptime.replace('%', ''));
    // Assuming 100 blocks window, calculate missed blocks
    return Math.round((100 - uptimePercentage) / 100 * 100);
  };

  // Generate block visualization based on validator uptime
  const renderBlockVisualization = (validator: Validator) => {
    const missedBlocks = getMissedBlocks(validator.uptime);
    const committedBlocks = 100 - missedBlocks;
    
    // Generate an array representing the last 100 blocks
    // For visualization purposes, we'll randomly distribute the missed blocks
    const blocks = Array(100).fill('committed');
    
    // Randomly assign 'missed' status to blocks based on the missed block count
    const missedIndices = new Set();
    while (missedIndices.size < missedBlocks) {
      const randomIndex = Math.floor(Math.random() * 100);
      missedIndices.add(randomIndex);
    }
    
    // Set the missed blocks in the array
    missedIndices.forEach(index => {
      blocks[index as number] = 'missed';
    });
    
    // Add a few precommitted blocks for visualization variety (optional)
    const precommittedCount = Math.min(5, committedBlocks / 10); // Using 5% of committed blocks or max 5
    const precommittedIndices = new Set();
    while (precommittedIndices.size < precommittedCount) {
      const randomIndex = Math.floor(Math.random() * 100);
      if (!missedIndices.has(randomIndex)) {
        precommittedIndices.add(randomIndex);
      }
    }
    
    // Set the precommitted blocks in the array
    precommittedIndices.forEach(index => {
      blocks[index as number] = 'precommitted';
    });
    
    return (
      <div className="flex items-center">
        <div className="w-10 text-xs font-mono text-right mr-2">
          {blockHeight > 0 ? blockHeight.toLocaleString() : '...'}
        </div>
        <div className="flex-1 flex h-6 bg-gray-800 rounded overflow-hidden">
          {blocks.map((status, i) => (
            <div
              key={i}
              className={`h-full w-[2px] mx-[0.5px] ${
                status === 'committed' 
                  ? 'bg-green-500' 
                  : status === 'precommitted' 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              } ${isUpdating && i === blocks.length - 1 ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Helper function to generate the uptime visualization
  const renderUptimeVisualization = (uptime: string) => {
    const uptimePercentage = parseFloat(uptime.replace('%', ''));
    const missedBlocks = getMissedBlocks(uptime);
    const committedBlocks = 100 - missedBlocks;
    
    // Create a visualization with colored blocks
    return (
      <div className="flex items-center w-full">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500" 
            style={{ width: `${uptimePercentage}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">{uptime}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className={`transition-all duration-300 ${isUpdating ? 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Validator Uptime
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
              <RefreshCw className={`h-3 w-3 ${isUpdating ? 'animate-spin text-purple-500' : ''}`} />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </CardTitle>
          <CardDescription>
            Real-time uptime statistics for all active validators on {chain.display_name}
          </CardDescription>
          <div className="mt-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search validators..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Committed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Precommitted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Missed</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {filteredValidators.map((validator, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 hover:bg-accent cursor-pointer transition-all duration-300 ${
                  isUpdating ? 'animate-pulse' : ''
                }`}
                onClick={() => handleValidatorClick(validator)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium truncate">{validator.moniker}</h3>
                  <Badge variant={validator.uptime === "100%" ? "default" : "destructive"}>
                    {validator.uptime}
                  </Badge>
                </div>
                
                {renderBlockVisualization(validator)}
                
                <div className="mt-2">
                  {renderUptimeVisualization(validator.uptime)}
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                  <span>Committed: {100 - getMissedBlocks(validator.uptime)}</span>
                  <span>Missed: {getMissedBlocks(validator.uptime)}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredValidators.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No validators found matching your search criteria.
            </div>
          )}
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
                    <Badge variant="default">
                      {selectedValidator.status}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Uptime</span>
                    </div>
                    <Badge variant={selectedValidator.uptime === "100%" ? "default" : "destructive"}>
                      {selectedValidator.uptime}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Committed Blocks</span>
                    </div>
                    <span>{100 - getMissedBlocks(selectedValidator.uptime)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Missed Blocks</span>
                    </div>
                    <span>{getMissedBlocks(selectedValidator.uptime)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Voting Power</span>
                    </div>
                    <span>{formatNumber(selectedValidator.voting_power)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Address</span>
                    </div>
                    <span className="font-mono text-xs truncate max-w-[200px]">{selectedValidator.address}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Last Update</span>
                    </div>
                    <span>{lastUpdated.toLocaleString()}</span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Block Height Visualization</h4>
                    {renderBlockVisualization(selectedValidator)}
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

export default UptimeTab;
