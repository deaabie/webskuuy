
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";

// Fetch projects from Supabase
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  
  if (error) {
    console.error("Error fetching projects:", error);
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
  
  return formattedProjects;
};

// Fetch single project by ID
export const fetchProjectById = async (id: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
  
  if (!data) {
    throw new Error("Project not found");
  }
  
  return {
    id: data.id,
    name: data.name,
    categories: data.categories || [],
    description: data.description || "",
    logo: data.logo || "",
    status: data.status as "active" | "upcoming" | "ended",
    installation_guide: data.installation_guide || ""
  };
};

// Create new project
export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      name: project.name,
      description: project.description,
      categories: project.categories,
      logo: project.logo,
      status: project.status,
      installation_guide: project.installation_guide
    }])
    .select();
  
  if (error) {
    console.error("Error creating project:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error("Failed to create project");
  }
  
  return {
    id: data[0].id,
    name: data[0].name,
    categories: data[0].categories || [],
    description: data[0].description || "",
    logo: data[0].logo || "",
    status: data[0].status as "active" | "upcoming" | "ended",
    installation_guide: data[0].installation_guide || ""
  };
};

// Update project
export const updateProject = async (project: Project): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      name: project.name,
      description: project.description,
      categories: project.categories,
      logo: project.logo,
      status: project.status,
      installation_guide: project.installation_guide,
      updated_at: new Date().toISOString()
    })
    .eq('id', project.id)
    .select();
  
  if (error) {
    console.error("Error updating project:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error("Failed to update project");
  }
  
  return {
    id: data[0].id,
    name: data[0].name,
    categories: data[0].categories || [],
    description: data[0].description || "",
    logo: data[0].logo || "",
    status: data[0].status as "active" | "upcoming" | "ended",
    installation_guide: data[0].installation_guide || ""
  };
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
