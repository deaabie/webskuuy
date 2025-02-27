
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowLeft, Trash2, Save, Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  categories: string[];
  description: string;
  logo: string;
  status: "active" | "upcoming" | "ended";
  installation_guide: string;
  created_at?: string;
  updated_at?: string;
}

interface AdminUser {
  id: string;
  username: string;
  password: string;
}

const Admin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states for new project creation
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    categories: [],
    description: "",
    logo: "",
    status: "upcoming",
    installation_guide: ""
  });
  
  useEffect(() => {
    checkAdminAuth();
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  // Check admin authentication
  const checkAdminAuth = async () => {
    const authStatus = localStorage.getItem("admin-auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Admin login
  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setLoginLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        localStorage.setItem("admin-auth", "authenticated");
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
      setPassword("");
    }
  };

  // Admin logout
  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Transform data to match our expected format
      const formattedProjects = data.map(project => ({
        id: project.id,
        name: project.name,
        categories: project.categories || [],
        description: project.description || "",
        logo: project.logo || "",
        status: project.status as "active" | "upcoming" | "ended",
        installation_guide: project.installation_guide || ""
      }));
      
      setProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  // Create new project
  const createProject = async () => {
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: newProject.name,
          description: newProject.description,
          categories: newProject.categories,
          logo: newProject.logo,
          status: newProject.status,
          installation_guide: newProject.installation_guide
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Refresh projects list
      fetchProjects();
      
      // Reset form
      setNewProject({
        name: "",
        categories: [],
        description: "",
        logo: "",
        status: "upcoming",
        installation_guide: ""
      });
      
      // Show success toast
      toast({
        title: "Project Created",
        description: `${newProject.name} has been created successfully`,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    }
  };
  
  // Edit project
  const startEditing = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
  };
  
  // Update project
  const updateProject = async () => {
    if (!selectedProject) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: selectedProject.name,
          description: selectedProject.description,
          categories: selectedProject.categories,
          logo: selectedProject.logo,
          status: selectedProject.status,
          installation_guide: selectedProject.installation_guide,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProject.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh projects list
      fetchProjects();
      
      setIsEditing(false);
      setSelectedProject(null);
      
      // Show success toast
      toast({
        title: "Project Updated",
        description: `${selectedProject.name} has been updated successfully`,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    }
  };
  
  // Delete project
  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Refresh projects list
      fetchProjects();
      
      // Show success toast
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };
  
  // Admin Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Admin Dashboard
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
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
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
                          <span key={cat} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full">
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
                        variant={newProject.categories.includes("Tech") ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory("Tech")}
                      >
                        Tech
                      </Button>
                      <Button 
                        variant={newProject.categories.includes("Community") ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory("Community")}
                      >
                        Community
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
                      onValueChange={(value: "active" | "upcoming" | "ended") => handleFormChange("status", value)}
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
                      value={newProject.installation_guide}
                      onChange={(e) => handleFormChange("installation_guide", e.target.value)}
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
                              project.installation_guide 
                                ? `${project.installation_guide.split('\n').length} lines` 
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
        )}
        
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
                      variant={selectedProject.categories.includes("Tech") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Tech")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Tech")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Tech"]
                          });
                        }
                      }}
                    >
                      Tech
                    </Button>
                    <Button 
                      variant={selectedProject.categories.includes("Community") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedProject.categories.includes("Community")) {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: selectedProject.categories.filter(c => c !== "Community")
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject, 
                            categories: [...selectedProject.categories, "Community"]
                          });
                        }
                      }}
                    >
                      Community
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
                    value={selectedProject.installation_guide}
                    onChange={(e) => setSelectedProject({...selectedProject, installation_guide: e.target.value})}
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
