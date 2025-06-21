
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const timeframeOptions = [
  { value: '1d', label: '1 Day' },
  { value: '3d', label: '3 Days' },
  { value: '7d', label: '1 Week' },
  { value: '14d', label: '2 Weeks' },
  { value: '30d', label: '1 Month' },
  { value: '90d', label: '3 Months' },
  { value: '180d', label: '6 Months' },
  { value: '365d', label: '1 Year' }
];

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }: TimeframeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="timeframe-select">Prediction Timeframe</Label>
      <Select value={selectedTimeframe} onValueChange={onTimeframeChange}>
        <SelectTrigger id="timeframe-select">
          <SelectValue placeholder="Choose timeframe" />
        </SelectTrigger>
        <SelectContent>
          {timeframeOptions.map((timeframe) => (
            <SelectItem key={timeframe.value} value={timeframe.value}>
              {timeframe.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeframeSelector;
