
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { getProjectSlug } from "@/services/projectService";

const TabContent = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { toast } = useToast();

  // React Query hooks
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();
  
  // Form states for new project creation
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    slug: "", // Add the slug property here
    categories: [],
    description: "",
    logo: "",
    status: "upcoming",
    installation_guide: ""
  });
  
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
          slug: "", // Add the slug property here
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

  return (
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
  );
};

export default TabContent;
