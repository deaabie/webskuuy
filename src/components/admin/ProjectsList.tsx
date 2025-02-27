
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectsListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

const ProjectsList = ({ projects, onEditProject, onDeleteProject }: ProjectsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
            <div className="flex gap-1">
              {project.categories.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <img 
                  src={project.logo} 
                  alt={project.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/100x100?text=Logo";
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
            <div className="mt-3">
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                  project.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                }`}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => onEditProject(project)}>
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${project.name}?`)) {
                  onDeleteProject(project.id);
                }
              }}
            >
              <Trash2 size={16} />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
