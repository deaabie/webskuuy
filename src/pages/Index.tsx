
import { useState } from "react";
import { Search, Moon, Sun, Menu, Filter, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Atom, Bitcoin, Cpu, CircleEllipsis, FileQuestion } from "lucide-react";

// Project type definition
interface Project {
  id: string;
  name: string;
  categories: string[];
  logo: string;
  status: "active" | "upcoming" | "ended";
}

// Sample projects data
const projectsData: Project[] = [{
  id: "hemi",
  name: "Hemi",
  categories: ["Cosmos"],
  logo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGNvc21vcyUyMGNoYWlufGVufDB8fDB8fHww",
  status: "active"
}, {
  id: "sunrise",
  name: "Sunrise",
  categories: ["Solana"],
  logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c29sYW5hJTIwYmxvY2tjaGFpbnxlbnwwfHwwfHx8MA%3D%3D",
  status: "active"
}, {
  id: "sahara-ai",
  name: "Sahara AI",
  categories: ["EVM", "Cosmos"],
  logo: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXRoZXJldW18ZW58MHx8MHx8fDA%3D",
  status: "active"
}, {
  id: "nexus",
  name: "Nexus",
  categories: ["Polkadot"],
  logo: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9sa2Fkb3R8ZW58MHx8MHx8fDA%3D",
  status: "active"
}, {
  id: "iota",
  name: "IOTA",
  categories: ["Other"],
  logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsb2NrY2hhaW58ZW58MHx8MHx8fDA%3D",
  status: "active"
}, {
  id: "pell",
  name: "Pell",
  categories: ["Bitcoin"],
  logo: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Yml0Y29pbnxlbnwwfHwwfHx8MA%3D%3D",
  status: "active"
}, {
  id: "dill",
  name: "Dill",
  categories: ["EVM"],
  logo: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXRoZXJldW18ZW58MHx8MHx8fDA%3D",
  status: "upcoming"
}, {
  id: "solv",
  name: "Solv",
  categories: ["Cosmos", "Polkadot"],
  logo: "https://images.unsplash.com/photo-1545726408-5d071b83e1f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvc21vc3xlbnwwfHwwfHx8MA%3D%3D",
  status: "active"
}, {
  id: "story",
  name: "Story",
  categories: ["Solana"],
  logo: "https://images.unsplash.com/photo-1647428475543-0ec9c4731d96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c29sYW5hfGVufDB8fDB8fHww",
  status: "ended"
}, {
  id: "symbiotic",
  name: "Symbiotic",
  categories: ["Bitcoin"],
  logo: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Yml0Y29pbnxlbnwwfHwwfHx8MA%3D%3D",
  status: "active"
}, {
  id: "airchains",
  name: "Airchains",
  categories: ["EVM"],
  logo: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGV0aGVyZXVtfGVufDB8fDB8fHww",
  status: "upcoming"
}, {
  id: "nubit",
  name: "Nubit",
  categories: ["Other"],
  logo: "https://images.unsplash.com/photo-1642079418385-17777550d549?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3J5cHRvfGVufDB8fDB8fHww",
  status: "active"
}];
const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const {
    toast
  } = useToast();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cosmos":
        return <Atom size={16} className="mr-1" />;
      case "Bitcoin":
        return <Bitcoin size={16} className="mr-1" />;
      case "EVM":
        return <Cpu size={16} className="mr-1" />;
      case "Solana":
        return <Sun size={16} className="mr-1" />;
      case "Polkadot":
        return <CircleEllipsis size={16} className="mr-1" />;
      case "Other":
        return <FileQuestion size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  // Filter projects based on search query, categories, and status
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || selectedCategories.some(cat => project.categories.includes(cat));
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    return matchesSearch && matchesCategories && matchesStatus;
  });

  // Count projects by status
  const activeCount = projectsData.filter(p => p.status === "active").length;
  const upcomingCount = projectsData.filter(p => p.status === "upcoming").length;
  const endedCount = projectsData.filter(p => p.status === "ended").length;

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  return <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl flex items-center">
              <span className="text-purple-500">Skuuy.</span>
              <span>com</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/portal" className="btn btn-primary btn-sm rounded-full">
              Testnets portal
            </Link>
            <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn btn-ghost btn-circle md:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Ad Banner */}
      <div className={`py-2 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-500 text-white px-1 rounded">Ad</span>
          <span className="text-sm">VPS/VDS in 30+ countries. Accept crypto, card eu/ru/ua - etc world, and more different payments methods</span>
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
          <div className={`relative rounded-full overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <input type="text" placeholder="Enter project" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full py-3 px-6 pr-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} focus:outline-none`} />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center">
            <button className={`flex items-center px-3 py-1 rounded-full ${selectedCategories.includes('Cosmos') ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} onClick={() => toggleCategory('Cosmos')}>
              <Atom size={16} className="mr-1" />
              Cosmos
            </button>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center px-3 py-1 rounded-full ${selectedCategories.includes('Bitcoin') ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} onClick={() => toggleCategory('Bitcoin')}>
              <Bitcoin size={16} className="mr-1" />
              Bitcoin
            </button>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center px-3 py-1 rounded-full ${selectedCategories.includes('EVM') ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} onClick={() => toggleCategory('EVM')}>
              <Cpu size={16} className="mr-1" />
              EVM
            </button>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center px-3 py-1 rounded-full ${selectedCategories.includes('Solana') ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} onClick={() => toggleCategory('Solana')}>
              <Sun size={16} className="mr-1" />
              Solana
            </button>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center px-3 py-1 rounded-full ${selectedCategories.includes('Polkadot') ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} onClick={() => toggleCategory('Polkadot')}>
              <CircleEllipsis size={16} className="mr-1" />
              Polkadot
            </button>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center px-3 py-1 rounded-full ${selectedCategories.includes('Other') ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} onClick={() => toggleCategory('Other')}>
              <FileQuestion size={16} className="mr-1" />
              Other
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
          {filteredProjects.map(project => <Link to={`/project/${project.id}`} key={project.id} className={`block rounded-lg p-4 transition-transform duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <div className="flex flex-col h-full">
                <div className="mb-2 text-sm text-gray-500 flex items-center">
                  {project.categories.map(cat => (
                    <span key={cat} className="mr-2 flex items-center">
                      {getCategoryIcon(cat)}
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="flex-grow flex items-center justify-center py-4">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img src={project.logo} alt={project.name} className="w-full h-full object-cover" onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/100x100?text=Logo";
                    }} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-2">{project.name}</h3>
              </div>
            </Link>)}
        </div>
        
        {/* Show More Button */}
        <div className="mt-10">
          <button className={`flex items-center gap-2 mx-auto px-6 py-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} onClick={() => toast({
          title: "Coming Soon",
          description: "More projects will be available soon!"
        })}>
            <span>Show more</span>
            <ArrowDown size={16} />
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Our Products</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Explorers</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Staking</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Contact Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">About</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Feedback & Bug Report</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Help Center</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Socials</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Twitter</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">GitHub</a></li>
                <li><a href="#" className="text-gray-500 hover:text-purple-500">Telegram</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Admin Panel Button */}
      <div className="fixed bottom-6 right-6">
        <Link to="/admin" className="btn btn-primary btn-circle shadow-lg" onClick={() => toast({
        title: "Admin Access",
        description: "Redirecting to admin portal"
      })}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </Link>
      </div>
    </div>;
};
export default Index;
