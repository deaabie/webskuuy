
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="relative rounded-full overflow-hidden border border-gray-700">
        <input
          type="text"
          placeholder="Search Nodes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 px-6 pr-12 bg-gray-800 focus:outline-none"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Search size={20} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
