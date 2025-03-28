
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, Loader2, Edit } from "lucide-react";
import Markdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { useProject, useProjectBySlug } from "@/hooks/use-projects";
import { useProjectDetailsByType } from "@/hooks/use-project-details";
import ProjectDetailsList from "@/components/project/ProjectDetailsList";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdminAuth();
  
  // Use the React Query hook to fetch project data by slug
  const { 
    data: project, 
    isLoading, 
    error 
  } = useProjectBySlug(slug || "");
  
  // Fetch project details by type if we have a project
  const projectId = project?.id || "";
  const { data: resources = [], isLoading: isLoadingResources } = useProjectDetailsByType(projectId, "resource");
  const { data: communityLinks = [], isLoading: isLoadingCommunity } = useProjectDetailsByType(projectId, "community");
  const { data: requirements = [], isLoading: isLoadingRequirements } = useProjectDetailsByType(projectId, "requirement");
  
  // Handle code copy
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Command copied to clipboard",
    });
    
    // Reset copy state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Show error state
  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6 gap-4">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {project.logo ? (
                <img 
                  src={project.logo} 
                  alt={project.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/100x100?text=Logo";
                  }}
                />
              ) : (
                <span className="text-sm">{project.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex gap-2 mt-1">
                {project.categories.map(cat => (
                  <span key={cat} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full">
                    {cat}
                  </span>
                ))}
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
            </div>
          </div>
          
          {isAdminLoggedIn && (
            <Link to={`/admin?editProject=${project.id}`} className="ml-auto">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle>Installation Guide</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {project.installation_guide ? (
                  <div className="prose dark:prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-4 p-6 bg-white dark:bg-gray-800 rounded-b-lg">
                    <Markdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-0 mb-4 text-purple-700 dark:text-purple-400" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-indigo-600 dark:text-indigo-400" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-5 mb-2 text-blue-600 dark:text-blue-400" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        p: ({ node, ...props }) => <p className="my-3" {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-600 dark:text-gray-300" {...props} />
                        ),
                        code(props) {
                          const {children, className, node, ...rest} = props
                          const match = /language-(\w+)/.exec(className || '')
                          
                          // If it's a code block (with language)
                          if (match) {
                            return (
                              <div className="relative my-4">
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm border-l-4 border-purple-500">
                                  <code className={className} {...rest}>
                                    {children}
                                  </code>
                                </pre>
                                <button
                                  onClick={() => copyCode(String(children))}
                                  className="absolute right-2 top-2 bg-gray-700 hover:bg-gray-600 text-gray-300 p-1.5 rounded"
                                  title="Copy to clipboard"
                                >
                                  {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                              </div>
                            )
                          }
                          
                          // Inline code
                          return (
                            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-purple-600 dark:text-purple-400">
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {project.installation_guide}
                    </Markdown>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800">
                    <p className="text-gray-500">No installation guide available for this project.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Project Info Card */}
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4">
                <CardTitle>Project Info</CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-gray-800 p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>
                
                <div className="space-y-6">
                  {/* Resources Section */}
                  <div>
                    <h3 className="font-medium text-purple-600 dark:text-purple-400 mb-3">Resources</h3>
                    <ProjectDetailsList
                      details={resources}
                      detailType="resource"
                      projectId={project.id}
                      isLoading={isLoadingResources}
                      isAdmin={isAdminLoggedIn}
                    />
                  </div>
                  
                  {/* Community Section */}
                  <div>
                    <h3 className="font-medium text-purple-600 dark:text-purple-400 mb-3">Community</h3>
                    <ProjectDetailsList
                      details={communityLinks}
                      detailType="community"
                      projectId={project.id}
                      isLoading={isLoadingCommunity}
                      isAdmin={isAdminLoggedIn}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Requirements Card */}
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4">
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-gray-800 p-6">
                <ProjectDetailsList
                  details={requirements}
                  detailType="requirement"
                  projectId={project.id}
                  isLoading={isLoadingRequirements}
                  isAdmin={isAdminLoggedIn}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
