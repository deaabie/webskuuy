
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Upload } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectFormProps {
  project: Partial<Project>;
  isEditing: boolean;
  onCategoryToggle: (category: string) => void;
  onFieldChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

const ProjectForm = ({ 
  project, 
  isEditing, 
  onCategoryToggle, 
  onFieldChange, 
  onSubmit,
  onCancel 
}: ProjectFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? `Edit Project: ${project.name}` : 'Create New Project'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update project details and installation guide' 
            : 'Add a new testnet or mainnet project to the platform'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input 
            id="name" 
            placeholder="Enter project name" 
            value={project.name || ''}
            onChange={(e) => onFieldChange("name", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={project.categories?.includes("Tech") ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle("Tech")}
            >
              Tech
            </Button>
            <Button 
              variant={project.categories?.includes("Community") ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle("Community")}
            >
              Community
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Project description"
            value={project.description || ''}
            onChange={(e) => onFieldChange("description", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <div className="flex gap-2">
            <Input 
              id="logo" 
              placeholder="Enter logo URL"
              value={project.logo || ''}
              onChange={(e) => onFieldChange("logo", e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Upload size={16} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={project.status || 'upcoming'} 
            onValueChange={(value: "active" | "upcoming" | "ended") => onFieldChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="guide">Installation Guide (Markdown)</Label>
          <Textarea 
            id="guide" 
            placeholder="# Installation Guide\n\n## Prerequisites\n- Required software\n- Hardware specs\n\n## Steps\n1. First step\n2. Second step"
            className="min-h-[200px] font-mono"
            value={project.installation_guide || ''}
            onChange={(e) => onFieldChange("installation_guide", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className={isEditing ? "flex justify-between" : ""}>
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={onSubmit} className="w-full">
            <Plus size={16} className="mr-2" />
            Create Project
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectForm;
