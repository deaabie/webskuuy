
import { Project } from "@/types/project";

// Admin users structure
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

// Initialize localStorage with default data
export const initializeLocalStorage = () => {
  // Check if projects already exist in localStorage
  if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify([]));
  }

  // Check if admin users already exist in localStorage
  if (!localStorage.getItem('admin_users')) {
    // Create a default admin user if none exists
    const defaultAdmin: AdminUser = {
      id: crypto.randomUUID(),
      username: 'admin',
      password: 'admin123', // Note: In a real app, you should hash passwords
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem('admin_users', JSON.stringify([defaultAdmin]));
  }
};

// Get all projects from localStorage
export const getProjects = (): Project[] => {
  const projectsJson = localStorage.getItem('projects');
  if (!projectsJson) return [];
  return JSON.parse(projectsJson);
};

// Get a single project by ID
export const getProjectById = (id: string): Project | null => {
  const projects = getProjects();
  return projects.find(project => project.id === id) || null;
};

// Create a new project
export const createProject = (project: Omit<Project, "id">): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID()
  };
  
  projects.push(newProject);
  localStorage.setItem('projects', JSON.stringify(projects));
  
  return newProject;
};

// Update an existing project
export const updateProject = (project: Project): Project => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index !== -1) {
    const updatedProject = {
      ...project,
      updated_at: new Date().toISOString()
    };
    
    projects[index] = updatedProject;
    localStorage.setItem('projects', JSON.stringify(projects));
    
    return updatedProject;
  }
  
  throw new Error(`Project with ID ${project.id} not found`);
};

// Delete a project
export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length === projects.length) {
    throw new Error(`Project with ID ${id} not found`);
  }
  
  localStorage.setItem('projects', JSON.stringify(filteredProjects));
};

// Admin authentication functions
export const getAdminUsers = (): AdminUser[] => {
  const usersJson = localStorage.getItem('admin_users');
  if (!usersJson) return [];
  return JSON.parse(usersJson);
};

export const authenticateAdmin = (username: string, password: string): boolean => {
  const users = getAdminUsers();
  return users.some(user => user.username === username && user.password === password);
};

// Import data from Supabase (one-time operation)
export const importDataFromSupabase = (projects: Project[], adminUsers: AdminUser[]) => {
  if (projects && projects.length > 0) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }
  
  if (adminUsers && adminUsers.length > 0) {
    localStorage.setItem('admin_users', JSON.stringify(adminUsers));
  }
};
