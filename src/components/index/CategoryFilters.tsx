
import { Bitcoin, Coins } from "lucide-react";

interface CategoryFiltersProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  theme: string;
}

const CategoryFilters = ({ selectedCategories, toggleCategory, theme }: CategoryFiltersProps) => {
  const categories = [
    { 
      name: 'Bitcoin', 
      icon: <Bitcoin size={16} /> 
    },
    { 
      name: 'Cosmos', 
      icon: <Coins size={16} /> 
    },
    { 
      name: 'EVM', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L5 12l6 7" />
        <path d="M19 5l-6 7 6 7" />
      </svg> 
    },
    { 
      name: 'Solana', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v4" />
        <path d="M12 14h.01" />
      </svg> 
    },
    { 
      name: 'Polkadot', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg> 
    },
    { 
      name: 'Other', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg> 
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map(category => (
        <div className="flex items-center" key={category.name}>
          <button 
            className={`px-3 py-1 rounded-full flex items-center gap-2 ${
              selectedCategories.includes(category.name) 
                ? 'bg-purple-500 text-white' 
                : theme === "dark" 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
            }`} 
            onClick={() => toggleCategory(category.name)}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilters;
