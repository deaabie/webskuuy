
import { Filter } from "lucide-react";

const SortOptions = () => {
  return (
    <div className="flex justify-end max-w-6xl mx-auto mb-4">
      <button className="flex items-center gap-1 text-sm text-gray-500">
        <span>Newest</span>
        <Filter size={16} />
      </button>
    </div>
  );
};

export default SortOptions;
