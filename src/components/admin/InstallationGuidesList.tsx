
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";

interface InstallationGuidesListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onTabChange: (tab: string) => void;
}

const InstallationGuidesList = ({ projects, onEditProject, onTabChange }: InstallationGuidesListProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installation Guides</CardTitle>
        <CardDescription>Manage node installation guides for your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-500" />
                <div>
                  <p className="font-medium">{project.name} Guide</p>
                  <p className="text-sm text-gray-500">{
                    project.installation_guide 
                      ? `${project.installation_guide.split('\n').length} lines` 
                      : "No guide available"
                  }</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    onEditProject(project);
                    onTabChange("create");
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    navigate(`/project/${project.id}`);
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallationGuidesList;
