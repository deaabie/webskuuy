
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/use-projects";
import IndexFooter from "@/components/IndexFooter";
import AdBanner from "@/components/index/AdBanner";
import HeroSection from "@/components/index/HeroSection";
import ProjectsGrid from "@/components/index/ProjectsGrid";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const { toast } = useToast();

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

  // Get current theme
  const [theme, setTheme] = useState<string>("dark");
  
  useEffect(() => {
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem("darkMode");
    const isDarkMode = savedTheme === null || savedTheme === "true";
    setTheme(isDarkMode ? "dark" : "light");
    
    // Listen for theme changes
    const handleThemeChange = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setTheme(isDarkMode ? "dark" : "light");
    };
    
    // Create a mutation observer to watch for class changes on html element
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} transition-colors duration-300`}>
      <AdBanner theme={theme} />
      
      <HeroSection
        theme={theme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        activeCount={activeCount}
        upcomingCount={upcomingCount}
        endedCount={endedCount}
      />
      
      <ProjectsGrid 
        isLoading={isLoading}
        filteredProjects={filteredProjects}
        theme={theme}
      />
      
      <IndexFooter />
    </div>
  );
};

export default Index;
