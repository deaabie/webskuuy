
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  ArrowLeft, 
  Trash2, 
  Save, 
  Upload, 
  FileText, 
  LogIn,
  Atom,
  Bitcoin,
  Cpu,
  Sun,
  CircleEllipsis,
  FileQuestion
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  categories: string[];
  description: string;
  logo: string;
  status: "active" | "upcoming" | "ended";
  installationGuide: string;
}

// Sample projects data
const initialProjects: Project[] = [
  {
    id: "hemi",
    name: "Hemi",
    categories: ["Cosmos"],
    description: "Hemi is a cutting-edge blockchain protocol focusing on scalability and security.",
    logo: "/lovable-uploads/b0037210-e798-410d-b9d2-e4f24211c714.png",
    status: "active",
    installationGuide: "# Hemi Node Installation Guide\n\n## Prerequisites\n- Ubuntu 20.04 or higher\n- 4 CPU cores\n- 8GB RAM\n- 100GB SSD\n\n## Installation Steps\n```bash\n# Update and install dependencies\napt update && apt upgrade -y\napt install curl git build-essential -y\n\n# Install Hemi\ncurl -sSL https://get.hemi.network | bash\n\n# Start the node\nhemi-node start --testnet\n```"
  },
  {
    id: "sunrise",
    name: "Sunrise",
    categories: ["Solana"],
    description: "Sunrise is a decentralized finance platform built for cross-chain compatibility.",
    logo: "/lovable-uploads/b0037210-e798-410d-b9d2-e4f24211c714.png",
    status: "active",
    installationGuide: "# Sunrise Node Installation Guide\n\n## Prerequisites\n- Ubuntu 20.04 or higher\n- 2 CPU cores\n- 4GB RAM\n- 50GB SSD\n\n## Installation Steps\n```bash\n# Update and install dependencies\napt update && apt upgrade -y\napt install curl git build-essential -y\n\n# Install Sunrise\ncurl -sSL https://get.sunrise.network | bash\n\n# Start the node\nsunrise-node start --testnet\n```"
  },
];

// Admin credentials
const adminCredentials = {
  username: "admin",
  password: "admin123"
};

const Admin = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState("login");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setActiveTab("projects");
    }
  }, []);
  
  // Handle login
  const handleLogin = () => {
    if (
      loginForm.username === adminCredentials.username && 
      loginForm.password === adminCredentials.password
    ) {
      setIsLoggedIn(true);
      setActiveTab("projects");
      localStorage.setItem("adminLoggedIn", "true");
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("login");
    localStorage.removeItem("adminLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };
  
  // Form states for new project creation
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    categories: [],
    description: "",
    logo: "",
    status: "upcoming",
    installationGuide: ""
  });
  
  // Handle new project form changes
  const handleFormChange = (field: string, value: any) => {
    setNewProject({
      ...newProject,
      [field]: value
    });
  };
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    if (newProject.categories.includes(category)) {
      handleFormChange("categories", newProject.categories.filter(c => c !== category));
    } else {
      handleFormChange("categories", [...newProject.categories, category]);
    }
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
  
  // Create new project
  const createProject = () => {
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Generate ID from name
    const id = newProject.name.toLowerCase().replace(/\s+/g, '-');
    
    // Create new project object
    const project: Project = {
      ...newProject,
      id
    };
    
    // Add to projects list
    setProjects([...projects, project]);
    
    // Reset form
    setNewProject({
      name: "",
      categories: [],
      description: "",
      logo: "",
      status: "upcoming",
      installationGuide: ""
    });
    
    // Show success toast
    toast({
      title: "Project Created",
      description: `${project.name} has been created successfully`,
    });
  };
  
  // Edit project
  const startEditing = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
  };
  
  // Update project
  const updateProject = () => {
    if (!selectedProject) return;
    
    // Update project in list
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? selectedProject : p
    );
    
    setProjects(updatedProjects);
    setIsEditing(false);
    setSelectedProject(null);
    
    // Show success toast
    toast({
      title: "Project Updated",
      description: `${selectedProject.name} has been updated successfully`,
    });
  };
  
  // Delete project
  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    
    // Show success toast
    toast({
      title: "Project Deleted",
      description: "The project has been deleted successfully",
    });
  };
  
  // Login form component
  const LoginForm = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Login to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            placeholder="Enter your username" 
            value={loginForm.username}
            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Enter your password" 
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleLogin}
        >
          <LogIn size={16} className="mr-2" />
          Login
        </Button>
      </CardFooter>
    </Card>
  );
  
  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="guides">Installation Guides</TabsTrigger>
          </TabsList>
          
          {/* Projects List */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
                    <div className="flex gap-1">
                      {project.categories.map(cat => (
                        <span key={cat} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center">
                          {getCategoryIcon(cat)}
                          {cat}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <img 
                          src={project.logo} 
                          alt={project.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/100x100?text=Logo";
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                    <div className="mt-3">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                          project.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => startEditing(project)}>
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${project.name}?`)) {
                          deleteProject(project.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Create New Project */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Add a new testnet or mainnet project to the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter project name" 
                    value={newProject.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={newProject.categories.includes("Cosmos") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory("Cosmos")}
                      className="flex items-center"
                    >
                      <Atom size={16} className="mr-1" />
                      Cosmos
                    </Button>
                    <Button 
                      variant={newProject.categories.includes("Bitcoin") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory("Bitcoin")}
                      className="flex items-center"
                    >
                      <Bitcoin size={16} className="mr-1" />
                      Bitcoin
                    </Button>
                    <Button 
                      variant={newProject.categories.includes("EVM") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory("EVM")}
                      className="flex items-center"
                    >
                      <Cpu size={16} className="mr-1" />
                      EVM
                    </Button>
                    <Button 
                      variant={newProject.categories.includes("Solana") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory("Solana")}
                      className="flex items-center"
                    >
                      <Sun size={16} className="mr-1" />
                      Solana
                    </Button>
                    <Button 
                      variant={newProject.categories.includes("Polkadot") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory("Polkadot")}
                      className="flex items-center"
                    >
                      <CircleEllipsis size={16} className="mr-1" />
                      Polkadot
                    </Button>
                    <Button 
                      variant={newProject.categories.includes("Other") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory("Other")}
                      className="flex items-center"
                    >
                      <FileQuestion size={16} className="mr-1" />
                      Other
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Project description"
                    value={newProject.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="logo" 
                      placeholder="Enter logo URL"
                      value={newProject.logo}
                      onChange={(e) => handleFormChange("logo", e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Upload size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newProject.status} 
                    onValueChange={(value) => handleFormChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guide">Installation Guide (Markdown)</Label>
                  <Textarea 
                    id="guide" 
                    placeholder="# Installation Guide\n\n## Prerequisites\n- Required software\n- Hardware specs\n\n## Steps\n1. First step\n2. Second step"
                    className="min-h-[200px] font-mono"
                    value={newProject.installationGuide}
                    onChange={(e) => handleFormChange("installationGuide", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={createProject} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Create Project
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Installation Guides */}
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Installation Guides</CardTitle>
                <CardDescription>Manage node installation guides for your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-gray-500" />
                        <div>
                          <p className="font-medium">{project.name} Guide</p>
                          <p className="text-sm text-gray-500">{
                            project.installationGuide 
                              ? `${project.installationGuide.split('\n').length} lines` 
                              : "No guide available"
                          }</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            startEditing(project);
                            setActiveTab("create");
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            navigate(`/project/${project.id}`);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Edit Project Modal */}
        {isEditing && selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Edit Project: {selectedProject.name}</CardTitle>
                <CardDescription>Update project details and installation guide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Project Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedProject.name}
                    onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={selectedProject.categories.includes("Cosmos") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Cosmos")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Cosmos")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Cosmos"]
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <Atom size={16} className="mr-1" />
                      Cosmos
                    </Button>
                    <Button 
                      variant={selectedProject.categories.includes("Bitcoin") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Bitcoin")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Bitcoin")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Bitcoin"]
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <Bitcoin size={16} className="mr-1" />
                      Bitcoin
                    </Button>
                    <Button 
                      variant={selectedProject.categories.includes("EVM") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("EVM")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "EVM")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "EVM"]
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <Cpu size={16} className="mr-1" />
                      EVM
                    </Button>
                    <Button 
                      variant={selectedProject.categories.includes("Solana") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Solana")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Solana")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Solana"]
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <Sun size={16} className="mr-1" />
                      Solana
                    </Button>
                    <Button 
                      variant={selectedProject.categories.includes("Polkadot") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Polkadot")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Polkadot")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Polkadot"]
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <CircleEllipsis size={16} className="mr-1" />
                      Polkadot
                    </Button>
                    <Button 
                      variant={selectedProject.categories.includes("Other") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Other")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Other")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Other"]
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <FileQuestion size={16} className="mr-1" />
                      Other
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    value={selectedProject.description}
                    onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-logo">Logo URL</Label>
                  <Input 
                    id="edit-logo" 
                    value={selectedProject.logo}
                    onChange={(e) => setSelectedProject({...selectedProject, logo: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedProject.status} 
                    onValueChange={(value: "active" | "upcoming" | "ended") => 
                      setSelectedProject({...selectedProject, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-guide">Installation Guide (Markdown)</Label>
                  <Textarea 
                    id="edit-guide" 
                    className="min-h-[200px] font-mono"
                    value={selectedProject.installationGuide}
                    onChange={(e) => setSelectedProject({...selectedProject, installationGuide: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={updateProject}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
