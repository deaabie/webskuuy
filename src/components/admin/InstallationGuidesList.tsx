
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Loader2 } from "lucide-react";
import { Project } from "@/types/project";

interface InstallationGuidesListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onTabChange: (tab: string) => void;
  isLoading?: boolean;
}

const InstallationGuidesList = ({ 
  projects, 
  onEditProject, 
  onTabChange,
  isLoading = false
}: InstallationGuidesListProps) => {
  
  const handleEditGuide = (project: Project) => {
    onEditProject(project);
    onTabChange("create");
  };
  
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
        <p className="text-gray-500">Create a project first to add installation guides</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {projects.map(project => (
        <Card key={project.id}>
          <CardContent className="p-0">
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
              <Button variant="outline" size="sm" onClick={() => handleEditGuide(project)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Guide
              </Button>
            </div>
            <div className="p-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {project.installation_guide 
                    ? project.installation_guide.length > 200 
                      ? project.installation_guide.substring(0, 200) + "..." 
                      : project.installation_guide
                    : "No installation guide provided."
                  }
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InstallationGuidesList;
