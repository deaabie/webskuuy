
import { supabase } from "@/integrations/supabase/client";
import { ProjectDetail, DetailType } from "@/types/project-detail";

// Fetch all details for a project
export const fetchProjectDetails = async (projectId: string): Promise<ProjectDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('project_details')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch details for project ${projectId}:`, error);
    throw error;
  }
};

// Fetch details of a specific type for a project
export const fetchProjectDetailsByType = async (
  projectId: string, 
  detailType: DetailType
): Promise<ProjectDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('project_details')
      .select('*')
      .eq('project_id', projectId)
      .eq('detail_type', detailType)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error(`Error fetching ${detailType} details:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch ${detailType} details for project ${projectId}:`, error);
    throw error;
  }
};

// Create a new project detail
export const createProjectDetail = async (detail: Omit<ProjectDetail, "id">): Promise<ProjectDetail> => {
  try {
    const { data, error } = await supabase
      .from('project_details')
      .insert([detail])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating project detail:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to create project detail, no data returned");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to create project detail:", error);
    throw error;
  }
};

// Update an existing project detail
export const updateProjectDetail = async (detail: ProjectDetail): Promise<ProjectDetail> => {
  try {
    const { data, error } = await supabase
      .from('project_details')
      .update({
        title: detail.title,
        url: detail.url,
        description: detail.description,
        value: detail.value,
        display_order: detail.display_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', detail.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating project detail:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to update project detail, no data returned");
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to update project detail ${detail.id}:`, error);
    throw error;
  }
};

// Delete a project detail
export const deleteProjectDetail = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('project_details')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting project detail:", error);
      throw error;
    }
  } catch (error) {
    console.error(`Failed to delete project detail ${id}:`, error);
    throw error;
  }
};

// Update display order for multiple details
export const updateDetailOrder = async (details: { id: string; display_order: number }[]): Promise<void> => {
  try {
    // Create an array of updates to perform
    const updates = details.map(({ id, display_order }) => ({
      id,
      display_order,
      updated_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('project_details')
      .upsert(updates);
    
    if (error) {
      console.error("Error updating detail order:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to update detail order:", error);
    throw error;
  }
};
