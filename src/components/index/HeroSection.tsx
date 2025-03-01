
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import CategoryFilters from "./CategoryFilters";
import StatusTabs from "./StatusTabs";

interface HeroSectionProps {
  theme: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  activeCount: number;
  upcomingCount: number;
  endedCount: number;
}

const HeroSection = ({
  theme,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  toggleCategory,
  selectedStatus,
  setSelectedStatus,
  activeCount,
  upcomingCount,
  endedCount
}: HeroSectionProps) => {
  return (
    <section className="py-12 text-center">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold mb-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Skuuy is Your Gateway to Web3 Node Operation
      </motion.h2>
      
      <motion.p 
        className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Comprehensive guides and tools for setting up and managing blockchain nodes
      </motion.p>
      
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme} />
      
      <CategoryFilters 
        selectedCategories={selectedCategories} 
        toggleCategory={toggleCategory} 
        theme={theme} 
      />
      
      <StatusTabs 
        selectedStatus={selectedStatus} 
        setSelectedStatus={setSelectedStatus} 
        activeCount={activeCount} 
        upcomingCount={upcomingCount} 
        endedCount={endedCount} 
        theme={theme} 
      />
    </section>
  );
};

export default HeroSection;
