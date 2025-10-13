
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchProjects, 
  fetchProjectById,
  fetchProjectBySlug,
  createProject, 
  updateProject, 
  deleteProject,
  fetchProjectsByCategory,
  getProjectSlug
} from "@/services/projectService";
import { Project } from "@/types/project";

// Hook to fetch all projects
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

// Hook to fetch projects by category
export function useProjectsByCategory(category: string) {
  return useQuery({
    queryKey: ["projects", "category", category],
    queryFn: () => fetchProjectsByCategory(category),
    enabled: !!category, // Only run query if category is truthy
  });
}

// Hook to fetch a single project by ID
export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id, // Only run query if id is truthy
  });
}

// Hook to fetch a single project by slug
export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug, // Only run query if slug is truthy
  });
}

// Hook to create a new project
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newProject: Omit<Project, "id">) => {
      // If slug is empty, generate it from the name
      if (!newProject.slug || newProject.slug.trim() === '') {
        newProject.slug = getProjectSlug(newProject.name);
      }
      return createProject(newProject);
    },
    onSuccess: () => {
      // Invalidate projects cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });
}

// Hook to update a project
export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Project) => updateProject(project),
    onSuccess: (updatedProject) => {
      // Update projects cache
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", updatedProject.id] });
      queryClient.invalidateQueries({ queryKey: ["projects", "slug", updatedProject.slug] });
      queryClient.refetchQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });
}

// Hook to delete a project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      // Invalidate and refetch all project-related queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.refetchQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    },
  });
}
