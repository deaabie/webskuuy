
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

// Fetch projects from Supabase
export const fetchProjects = async (): Promise<Project[]> => {
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
  
  return formattedProjects;
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
    throw error;
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
export const updateProject = async (project: Project): Promise<void> => {
  const { error } = await supabase
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
    .eq('id', project.id);
  
  if (error) {
    throw error;
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
};
