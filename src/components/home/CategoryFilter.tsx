
import { Bitcoin, Coins } from "lucide-react";

interface CategoryFilterProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategories, toggleCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <div className="flex items-center">
        <button
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            selectedCategories.includes("Bitcoin")
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => toggleCategory("Bitcoin")}
        >
          <Bitcoin size={16} />
          <span>Bitcoin</span>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            selectedCategories.includes("Cosmos")
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => toggleCategory("Cosmos")}
        >
          <Coins size={16} />
          <span>Cosmos</span>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            selectedCategories.includes("EVM")
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => toggleCategory("EVM")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L5 12l6 7" />
            <path d="M19 5l-6 7 6 7" />
          </svg>
          <span>EVM</span>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            selectedCategories.includes("Solana")
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => toggleCategory("Solana")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v4" />
            <path d="M12 14h.01" />
          </svg>
          <span>Solana</span>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            selectedCategories.includes("Polkadot")
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => toggleCategory("Polkadot")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Polkadot</span>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            selectedCategories.includes("Other")
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => toggleCategory("Other")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
          <span>Other</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;
