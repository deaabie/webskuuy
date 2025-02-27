
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectsListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  isLoading?: boolean;
}

const ProjectsList = ({ projects, onEditProject, onDeleteProject, isLoading = false }: ProjectsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-gray-500">Create your first project to get started</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <Card key={project.id} className="overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {project.logo ? (
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/100x100?text=Logo";
                    }}
                  />
                ) : (
                  <span className="text-sm">{project.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-medium">{project.name}</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              project.status === 'active' ? 'bg-green-100 text-green-800' : 
              project.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description || "No description provided."}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.categories.map(category => (
                <span key={category} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  {category}
                </span>
              ))}
              {project.categories.length === 0 && (
                <span className="text-xs text-gray-500">No categories</span>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditProject(project)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteProject(project.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
