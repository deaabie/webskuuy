
import { useState, useEffect } from "react";
import { Search, Filter, ArrowDown, Bitcoin, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useProjects } from "@/hooks/use-projects";
import IndexFooter from "@/components/IndexFooter";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const {
    toast
  } = useToast();

  // Use React Query hook to fetch projects
  const {
    data: projects = [],
    isLoading,
    error
  } = useProjects();

  // Show error notifications if needed
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Filter projects based on search query, categories, and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || selectedCategories.some(cat => project.categories.includes(cat));
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    return matchesSearch && matchesCategories && matchesStatus;
  });

  // Count projects by status
  const activeCount = projects.filter(p => p.status === "active").length;
  const upcomingCount = projects.filter(p => p.status === "upcoming").length;
  const endedCount = projects.filter(p => p.status === "ended").length;

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">
      
      {/* Ad Banner */}
      <div className="py-2 px-4 bg-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-500 text-white px-1 rounded">Ad</span>
          <span className="text-sm">SPACE AVAILABLE * SPACE AVAILABLE * SPACE AVAILABLE</span>
        </div>
        <button className="text-gray-500">&times;</button>
      </div>
      
      {/* Hero Section */}
      <section className="py-12 text-center">
        
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }}>Skuuy is Your Gateway to Web3 Node Operation</motion.h2>
        <motion.p className="text-lg text-gray-400 mb-8" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }}>Comprehensive guides and tools for setting up and managing blockchain nodes</motion.p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative rounded-full overflow-hidden border border-gray-700">
            <input type="text" placeholder="Search Nodes" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full py-3 px-6 pr-12 bg-gray-800 focus:outline-none" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center">
            <button className={`px-3 py-1 rounded-full flex items-center gap-2 ${selectedCategories.includes('Bitcoin') ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`} onClick={() => toggleCategory('Bitcoin')}>
              <Bitcoin size={16} />
              <span>Bitcoin</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className={`px-3 py-1 rounded-full flex items-center gap-2 ${selectedCategories.includes('Cosmos') ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`} onClick={() => toggleCategory('Cosmos')}>
              <Coins size={16} />
              <span>Cosmos</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className={`px-3 py-1 rounded-full flex items-center gap-2 ${selectedCategories.includes('EVM') ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`} onClick={() => toggleCategory('EVM')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L5 12l6 7" />
                <path d="M19 5l-6 7 6 7" />
              </svg>
              <span>EVM</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className={`px-3 py-1 rounded-full flex items-center gap-2 ${selectedCategories.includes('Solana') ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`} onClick={() => toggleCategory('Solana')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v4" />
                <path d="M12 14h.01" />
              </svg>
              <span>Solana</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className={`px-3 py-1 rounded-full flex items-center gap-2 ${selectedCategories.includes('Polkadot') ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`} onClick={() => toggleCategory('Polkadot')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Polkadot</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className={`px-3 py-1 rounded-full flex items-center gap-2 ${selectedCategories.includes('Other') ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`} onClick={() => toggleCategory('Other')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
              <span>Other</span>
            </button>
          </div>
        </div>
        
        {/* Status Tabs */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <button className={`flex items-center ${selectedStatus === 'active' ? 'text-purple-500' : 'text-gray-500'}`} onClick={() => setSelectedStatus('active')}>
            <span>Active</span>
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800">{activeCount}</span>
          </button>
          <button className={`flex items-center ${selectedStatus === 'upcoming' ? 'text-purple-500' : 'text-gray-500'}`} onClick={() => setSelectedStatus('upcoming')}>
            <span>Upcoming</span>
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800">{upcomingCount}</span>
          </button>
          <button className={`flex items-center ${selectedStatus === 'ended' ? 'text-purple-500' : 'text-gray-500'}`} onClick={() => setSelectedStatus('ended')}>
            <span>Ended</span>
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800">{endedCount}</span>
          </button>
        </div>
        
        {/* Sort Options */}
        <div className="flex justify-end max-w-6xl mx-auto mb-4">
          <button className="flex items-center gap-1 text-sm text-gray-500">
            <span>Newest</span>
            <Filter size={16} />
          </button>
        </div>
        
        {/* Projects Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {isLoading ?
        // Loading skeleton
        Array.from({
          length: 8
        }).map((_, index) => <div key={index} className="block rounded-lg p-4 bg-gray-800">
                <div className="animate-pulse flex flex-col h-full">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="flex-grow flex items-center justify-center py-4">
                    <div className="w-20 h-20 rounded-full bg-gray-700"></div>
                  </div>
                  <div className="h-5 bg-gray-700 rounded w-1/2 mt-2"></div>
                </div>
              </div>) : filteredProjects.length > 0 ? filteredProjects.map(project => <Link to={`/project/${project.slug}`} key={project.id} className="block rounded-lg p-4 transition-transform duration-300 transform hover:scale-105 bg-gray-800 hover:bg-gray-750 relative">
                {/* Status Badge */}
                <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${project.status === 'active' ? 'bg-green-700 text-white' : project.status === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </div>
                
                <div className="flex flex-col h-full">
                  <div className="mb-2 text-sm text-gray-500">
                    {project.categories.join("/")}
                  </div>
                  <div className="flex-grow flex items-center justify-center py-4">
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                      <img src={project.logo} alt={project.name} className="w-12 h-12 object-contain" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/100x100?text=Logo";
                }} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{project.name}</h3>
                </div>
              </Link>) : <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No projects found. Try adjusting your filters.</p>
            </div>}
        </div>
        
        {/* Show More Button */}
        {filteredProjects.length > 0 && <div className="mt-10">
            <button className="flex items-center gap-2 mx-auto px-6 py-2 rounded-full bg-gray-800" onClick={() => toast({
          title: "Coming Soon",
          description: "More projects will be available soon!"
        })}>
              <span>Show more</span>
              <ArrowDown size={16} />
            </button>
          </div>}
      </section>
      
      {/* Footer */}
      <IndexFooter />
    </div>;
};

export default Index;
