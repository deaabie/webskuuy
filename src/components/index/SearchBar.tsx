
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  theme?: string;
  className?: string;
}

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  onSearch,
  placeholder = "Search",
  theme,
  className = ""
}: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 flex">
        <Input 
          type="text" 
          placeholder={placeholder} 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full py-3 px-6 pr-12 rounded-full border-0 ${theme === "dark" ? "bg-gray-800" : ""}`} 
        />
        {onSearch && (
          <Button 
            onClick={onSearch} 
            variant="ghost" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <Search size={18} className="text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
