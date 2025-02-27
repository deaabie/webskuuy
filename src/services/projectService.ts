
import { Project } from "@/types/project";
import { 
  getProjects as getLocalProjects,
  getProjectById as getLocalProjectById,
  createProject as createLocalProject,
  updateProject as updateLocalProject,
  deleteProject as deleteLocalProject
} from "./localStorageService";

// Fetch projects from localStorage
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    return getLocalProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
};

// Fetch single project by ID
export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const project = getLocalProjectById(id);
    
    if (!project) {
      console.error("Project not found:", id);
      throw new Error("Project not found");
    }
    
    return project;
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    throw error;
  }
};

// Create new project
export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
  try {
    return createLocalProject(project);
  } catch (error) {
    console.error("Failed to create project:", error);
    throw error;
  }
};

// Update project
export const updateProject = async (project: Project): Promise<Project> => {
  try {
    return updateLocalProject(project);
  } catch (error) {
    console.error(`Failed to update project ${project.id}:`, error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    deleteLocalProject(id);
    console.log(`Project ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    throw error;
  }
};
