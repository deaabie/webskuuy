
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ExternalLink, Plus, Save, X } from "lucide-react";
import { ProjectDetail, DetailType } from "@/types/project-detail";
import { useUpdateProjectDetail, useDeleteProjectDetail, useCreateProjectDetail } from "@/hooks/use-project-details";

interface ProjectDetailsListProps {
  details: ProjectDetail[];
  detailType: DetailType;
  projectId: string;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const ProjectDetailsList: React.FC<ProjectDetailsListProps> = ({
  details,
  detailType,
  projectId,
  isLoading = false,
  isAdmin = false,
}) => {
  const [editingDetail, setEditingDetail] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newDetail, setNewDetail] = useState<Partial<ProjectDetail>>({
    project_id: projectId,
    detail_type: detailType,
    title: "",
    url: detailType !== "requirement" ? "" : undefined,
    value: detailType === "requirement" ? "" : undefined,
    display_order: details.length,
  });
  const [editedValues, setEditedValues] = useState<Partial<ProjectDetail>>({});

  const { mutate: updateDetail } = useUpdateProjectDetail();
  const { mutate: deleteDetail } = useDeleteProjectDetail();
  const { mutate: createDetail } = useCreateProjectDetail();

  const handleEditStart = (detail: ProjectDetail) => {
    setEditingDetail(detail.id);
    setEditedValues({
      title: detail.title,
      url: detail.url || "",
      description: detail.description || "",
      value: detail.value || "",
    });
  };

  const handleEditSave = (detail: ProjectDetail) => {
    updateDetail({
      ...detail,
      title: editedValues.title || detail.title,
      url: detailType !== "requirement" ? (editedValues.url as string) || null : null,
      description: detailType !== "requirement" ? editedValues.description || null : null,
      value: detailType === "requirement" ? editedValues.value as string || null : null,
    });
    setEditingDetail(null);
    setEditedValues({});
  };

  const handleEditCancel = () => {
    setEditingDetail(null);
    setEditedValues({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteDetail({ id, projectId, detailType });
    }
  };

  const handleAddStart = () => {
    setIsAdding(true);
  };

  const handleAddSave = () => {
    if (newDetail.title) {
      createDetail({
        project_id: projectId,
        detail_type: detailType,
        title: newDetail.title as string,
        url: detailType !== "requirement" ? (newDetail.url as string) || null : null,
        description: detailType !== "requirement" ? (newDetail.description as string) || null : null,
        value: detailType === "requirement" ? (newDetail.value as string) || null : null,
        display_order: details.length,
      });
      setIsAdding(false);
      setNewDetail({
        project_id: projectId,
        detail_type: detailType,
        title: "",
        url: detailType !== "requirement" ? "" : undefined,
        value: detailType === "requirement" ? "" : undefined,
        display_order: details.length + 1,
      });
    }
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setNewDetail({
      project_id: projectId,
      detail_type: detailType,
      title: "",
      url: detailType !== "requirement" ? "" : undefined,
      value: detailType === "requirement" ? "" : undefined,
      display_order: details.length,
    });
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>;
  }

  return (
    <div className="space-y-4">
      {details.map((detail) => (
        <div key={detail.id} className={detailType === "requirement" 
          ? "flex justify-between items-center py-2"
          : "flex items-center gap-2 py-2"
        }>
          {editingDetail === detail.id ? (
            // Edit mode
            <>
              <div className="flex-1 flex gap-2">
                <Input
                  value={editedValues.title || ""}
                  onChange={(e) => setEditedValues({ ...editedValues, title: e.target.value })}
                  placeholder="Title"
                  className="w-full"
                />
                
                {detailType !== "requirement" ? (
                  <Input
                    value={editedValues.url || ""}
                    onChange={(e) => setEditedValues({ ...editedValues, url: e.target.value })}
                    placeholder="URL"
                    className="w-full"
                  />
                ) : (
                  <Input
                    value={editedValues.value || ""}
                    onChange={(e) => setEditedValues({ ...editedValues, value: e.target.value })}
                    placeholder="Value"
                    className="w-1/3"
                  />
                )}
              </div>
              
              <div className="flex gap-1 ml-2">
                <Button size="icon" variant="ghost" onClick={() => handleEditSave(detail)}>
                  <Save size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleEditCancel}>
                  <X size={16} />
                </Button>
              </div>
            </>
          ) : (
            // View mode
            <>
              {detailType === "requirement" ? (
                <>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{detail.title}</span>
                  <span className="font-bold text-purple-700 dark:text-purple-400">{detail.value}</span>
                </>
              ) : (
                <a
                  href={detail.url || "#"}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  <span>{detail.title}</span>
                </a>
              )}
              
              {isAdmin && (
                <div className="flex gap-1 ml-auto">
                  <Button size="icon" variant="ghost" onClick={() => handleEditStart(detail)}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(detail.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      
      {isAdmin && (
        isAdding ? (
          <div className="flex gap-2 mt-4 items-center">
            <div className="flex-1 flex gap-2">
              <Input
                value={newDetail.title || ""}
                onChange={(e) => setNewDetail({ ...newDetail, title: e.target.value })}
                placeholder={`New ${detailType === "requirement" ? "requirement" : "link"} name`}
                className="w-full"
              />
              
              {detailType !== "requirement" ? (
                <Input
                  value={newDetail.url || ""}
                  onChange={(e) => setNewDetail({ ...newDetail, url: e.target.value })}
                  placeholder="URL"
                  className="w-full"
                />
              ) : (
                <Input
                  value={newDetail.value || ""}
                  onChange={(e) => setNewDetail({ ...newDetail, value: e.target.value })}
                  placeholder="Value"
                  className="w-1/3"
                />
              )}
            </div>
            
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={handleAddSave}>
                <Save size={16} />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleAddCancel}>
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 mt-2 text-muted-foreground"
            onClick={handleAddStart}
          >
            <Plus size={16} />
            <span>Add {detailType === "requirement" ? "requirement" : "link"}</span>
          </Button>
        )
      )}
    </div>
  );
};

export default ProjectDetailsList;
