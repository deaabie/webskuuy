
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useProjects } from "@/hooks/use-projects";
import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import CategoryFilter from "@/components/home/CategoryFilter";
import StatusTabs from "@/components/home/StatusTabs";
import SortOptions from "@/components/home/SortOptions";
import ProjectsGrid from "@/components/home/ProjectsGrid";
import ShowMoreButton from "@/components/home/ShowMoreButton";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const { toast } = useToast();

  // Use React Query hook to fetch projects
  const { data: projects = [], isLoading, error } = useProjects();

  // Show error notifications if needed
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Filter projects based on search query, categories, and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => project.categories.includes(cat));
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    return matchesSearch && matchesCategories && matchesStatus;
  });

  // Count projects by status
  const activeCount = projects.filter((p) => p.status === "active").length;
  const upcomingCount = projects.filter((p) => p.status === "upcoming").length;
  const endedCount = projects.filter((p) => p.status === "ended").length;

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">
      {/* Hero Section */}
      <HeroSection>
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Categories Filter */}
        <CategoryFilter
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
        />

        {/* Status Tabs */}
        <StatusTabs
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          activeCount={activeCount}
          upcomingCount={upcomingCount}
          endedCount={endedCount}
        />

        {/* Sort Options */}
        <SortOptions />

        {/* Projects Grid */}
        <ProjectsGrid
          isLoading={isLoading}
          filteredProjects={filteredProjects}
        />

        {/* Show More Button */}
        {filteredProjects.length > 0 && <ShowMoreButton />}
      </HeroSection>
    </div>
  );
};

export default Index;
