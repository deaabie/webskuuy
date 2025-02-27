
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Atom,
  Bitcoin,
  ChevronDown,
  Cpu,
  ExternalLink,
  FileQuestion,
  Loader2,
  Search,
  Sun,
  CircleEllipsis,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  categories: string[];
  description: string;
  logo: string;
  status: "active" | "upcoming" | "ended";
}

// Get category icon - moved outside of components to be accessible to both Index and ProjectCard
const getCategoryIcon = (category: string) => {
  const foundCategory = categories.find(c => c.value === category);
  return foundCategory ? foundCategory.icon : null;
};

// Available categories - moved outside to be accessible globally
const categories = [
  { value: "Cosmos", icon: <Atom size={16} /> },
  { value: "Bitcoin", icon: <Bitcoin size={16} /> },
  { value: "EVM", icon: <Cpu size={16} /> },
  { value: "Solana", icon: <Sun size={16} /> },
  { value: "Polkadot", icon: <CircleEllipsis size={16} /> },
  { value: "Other", icon: <FileQuestion size={16} /> },
];

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
        
        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }
        
        // Transform data format to match our interface
        const transformedData = data.map(project => ({
          id: project.id,
          name: project.name,
          categories: project.categories || [],
          description: project.description || "",
          logo: project.logo || "",
          status: project.status as "active" | "upcoming" | "ended",
        }));
        
        setProjects(transformedData);
      } catch (error) {
        console.error('Error in fetchProjects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Filter projects based on search query, selected categories, and active tab
  const filteredProjects = projects.filter((project) => {
    // Filter by status
    if (activeTab !== "all" && project.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (
      searchQuery &&
      !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !project.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by selected categories
    if (
      selectedCategories.length > 0 &&
      !project.categories.some((category) =>
        selectedCategories.includes(category)
      )
    ) {
      return false;
    }
    
    return true;
  });
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ServerIcon className="h-8 w-8" />
              <span className="text-2xl font-bold">Web3 Node Ops</span>
            </div>
            <div className="flex gap-4">
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link to="/tools">
                <Button variant="ghost">Tools</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost">Contact</Button>
              </Link>
              <Link to="/admin">
                <Button>Admin</Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 mb-10 text-center">
            <h1 className="text-5xl font-bold mb-4">Run Web3 Infrastructure</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple guides for setting up and running nodes for various blockchain networks. Join testnets, earn rewards, and contribute to decentralization.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 py-6 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-lg"
                placeholder="Search for projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="container mx-auto max-w-6xl px-4 -mt-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All Projects</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="ended">Ended</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    Filter Categories <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.value}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    >
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.value}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No projects found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simple Footer */}
      <footer className="mt-20 py-10 bg-gray-800 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <ServerIcon className="h-6 w-6" />
              <span className="text-xl font-bold">Web3 Node Ops</span>
            </div>
            <div className="flex gap-4">
              <Link to="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link to="/tools" className="text-gray-300 hover:text-white">
                Tools
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            © 2023 Web3 Node Ops. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src={project.logo || "https://placehold.co/100x100?text=Logo"}
                alt={project.name}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/100x100?text=Logo";
                }}
              />
            </div>
            <CardTitle>{project.name}</CardTitle>
          </div>
          <Badge
            variant={
              project.status === "active"
                ? "default"
                : project.status === "upcoming"
                ? "secondary"
                : "outline"
            }
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {project.categories.map((category) => (
            <div
              key={category}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <CardDescription className="line-clamp-3 h-[60px]">
          {project.description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <Link to={`/project/${project.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <Button size="sm" variant="ghost" className="gap-1">
            <ExternalLink size={16} />
            Website
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Index;
