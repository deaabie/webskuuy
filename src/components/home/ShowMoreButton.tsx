
import { ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShowMoreButton = () => {
  const { toast } = useToast();
  
  return (
    <div className="mt-10">
      <button
        className="flex items-center gap-2 mx-auto px-6 py-2 rounded-full bg-gray-800"
        onClick={() =>
          toast({
            title: "Coming Soon",
            description: "More projects will be available soon!",
          })
        }
      >
        <span>Show more</span>
        <ArrowDown size={16} />
      </button>
    </div>
  );
};

export default ShowMoreButton;
