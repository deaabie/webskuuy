
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";

// Fetch projects from Supabase
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No projects found");
      return [];
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
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
};

// Fetch single project by ID
export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
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
      console.error("Project not found:", id);
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
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    throw error;
  }
};

// Create new project
export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
  try {
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
      console.error("Failed to create project, no data returned");
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
  } catch (error) {
    console.error("Failed to create project:", error);
    throw error;
  }
};

// Update project
export const updateProject = async (project: Project): Promise<Project> => {
  try {
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
      console.error("Failed to update project, no data returned");
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
  } catch (error) {
    console.error(`Failed to update project ${project.id}:`, error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
    
    console.log(`Project ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    throw error;
  }
};
