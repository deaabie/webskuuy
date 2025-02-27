
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLogin from "@/components/admin/AdminLogin";
import ProjectsList from "@/components/admin/ProjectsList";
import ProjectForm from "@/components/admin/ProjectForm";
import InstallationGuidesList from "@/components/admin/InstallationGuidesList";
import { Project } from "@/types/project";
import { 
  useProjects, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject 
} from "@/hooks/use-projects";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // React Query hooks
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();
  
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
  }, []);

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

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
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
  
  // Handle new project form changes
  const handleFormChange = (field: string, value: any) => {
    setNewProject({
      ...newProject,
      [field]: value
    });
  };
  
  // Handle project form changes when editing
  const handleEditFormChange = (field: string, value: any) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        [field]: value
      });
    }
  };
  
  // Handle category toggle for new project
  const toggleCategory = (category: string) => {
    if (newProject.categories.includes(category)) {
      handleFormChange("categories", newProject.categories.filter(c => c !== category));
    } else {
      handleFormChange("categories", [...newProject.categories, category]);
    }
  };
  
  // Handle category toggle for editing project
  const toggleEditCategory = (category: string) => {
    if (selectedProject) {
      if (selectedProject.categories.includes(category)) {
        handleEditFormChange("categories", selectedProject.categories.filter(c => c !== category));
      } else {
        handleEditFormChange("categories", [...selectedProject.categories, category]);
      }
    }
  };
  
  // Create new project using React Query
  const handleCreateProject = async () => {
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    createProject(newProject, {
      onSuccess: () => {
        // Reset form
        setNewProject({
          name: "",
          categories: [],
          description: "",
          logo: "",
          status: "upcoming",
          installation_guide: ""
        });
      }
    });
  };
  
  // Start editing project
  const startEditing = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
    setActiveTab("create");
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedProject(null);
  };
  
  // Update project using React Query
  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    
    updateProject(selectedProject, {
      onSuccess: () => {
        setIsEditing(false);
        setSelectedProject(null);
      }
    });
  };
  
  // Delete project using React Query
  const handleDeleteProject = async (id: string) => {
    deleteProject(id);
  };
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
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
              <ProjectsList 
                projects={projects} 
                onEditProject={startEditing} 
                onDeleteProject={handleDeleteProject}
                isLoading={isLoadingProjects}
              />
            </TabsContent>
            
            {/* Create New Project */}
            <TabsContent value="create">
              {isEditing && selectedProject ? (
                <ProjectForm 
                  project={selectedProject}
                  isEditing={true}
                  onCategoryToggle={toggleEditCategory}
                  onFieldChange={handleEditFormChange}
                  onSubmit={handleUpdateProject}
                  onCancel={cancelEditing}
                />
              ) : (
                <ProjectForm 
                  project={newProject}
                  isEditing={false}
                  onCategoryToggle={toggleCategory}
                  onFieldChange={handleFormChange}
                  onSubmit={handleCreateProject}
                />
              )}
            </TabsContent>
            
            {/* Installation Guides */}
            <TabsContent value="guides">
              <InstallationGuidesList 
                projects={projects} 
                onEditProject={startEditing} 
                onTabChange={setActiveTab}
                isLoading={isLoadingProjects}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;
