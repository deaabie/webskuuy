
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReasonInputProps {
  reason: string;
  setReason: (reason: string) => void;
}

const ReasonInput = ({ reason, setReason }: ReasonInputProps) => {
  return (
    <div>
      <Label htmlFor="reason" className="flex justify-between">
        <span>Reason for request</span>
        <span className="text-xs text-muted-foreground">(Optional)</span>
      </Label>
      <Textarea 
        id="reason"
        placeholder="What are you building or testing?" 
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-1 resize-none"
        rows={3}
      />
    </div>
  );
};

export default ReasonInput;
