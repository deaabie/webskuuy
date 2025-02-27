
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchProjectDetails, 
  fetchProjectDetailsByType,
  createProjectDetail, 
  updateProjectDetail, 
  deleteProjectDetail,
  updateDetailOrder
} from "@/services/projectDetailService";
import { ProjectDetail, DetailType } from "@/types/project-detail";

// Hook to fetch all details for a project
export function useProjectDetails(projectId: string) {
  return useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => fetchProjectDetails(projectId),
    enabled: !!projectId, // Only run query if projectId is truthy
  });
}

// Hook to fetch details of a specific type for a project
export function useProjectDetailsByType(projectId: string, detailType: DetailType) {
  return useQuery({
    queryKey: ["project-details", projectId, detailType],
    queryFn: () => fetchProjectDetailsByType(projectId, detailType),
    enabled: !!projectId, // Only run query if projectId is truthy
  });
}

// Hook to create a new project detail
export function useCreateProjectDetail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newDetail: Omit<ProjectDetail, "id">) => createProjectDetail(newDetail),
    onSuccess: (createdDetail) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", createdDetail.project_id]
      });
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", createdDetail.project_id, createdDetail.detail_type]
      });
      toast.success("Detail added successfully");
    },
    onError: (error) => {
      console.error("Error creating project detail:", error);
      toast.error("Failed to add detail");
    },
  });
}

// Hook to update a project detail
export function useUpdateProjectDetail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (detail: ProjectDetail) => updateProjectDetail(detail),
    onSuccess: (updatedDetail) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", updatedDetail.project_id]
      });
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", updatedDetail.project_id, updatedDetail.detail_type]
      });
      toast.success("Detail updated successfully");
    },
    onError: (error) => {
      console.error("Error updating project detail:", error);
      toast.error("Failed to update detail");
    },
  });
}

// Hook to delete a project detail
export function useDeleteProjectDetail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, projectId, detailType }: { id: string; projectId: string; detailType: DetailType }) => {
      return deleteProjectDetail(id).then(() => ({ projectId, detailType }));
    },
    onSuccess: ({ projectId, detailType }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", projectId]
      });
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", projectId, detailType]
      });
      toast.success("Detail deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting project detail:", error);
      toast.error("Failed to delete detail");
    },
  });
}

// Hook to update display order for multiple details
export function useUpdateDetailOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ details, projectId, detailType }: { 
      details: { id: string; display_order: number }[];
      projectId: string;
      detailType: DetailType;
    }) => {
      return updateDetailOrder(details).then(() => ({ projectId, detailType }));
    },
    onSuccess: ({ projectId, detailType }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", projectId]
      });
      queryClient.invalidateQueries({ 
        queryKey: ["project-details", projectId, detailType]
      });
    },
    onError: (error) => {
      console.error("Error updating detail order:", error);
      toast.error("Failed to update order");
    },
  });
}
