
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react";
import Markdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  categories: string[];
  description: string;
  logo: string;
  status: "active" | "upcoming" | "ended";
  installationGuide: string;
}

// Sample projects data
const projectsData: Project[] = [
  {
    id: "hemi",
    name: "Hemi",
    categories: ["Tech"],
    description: "Hemi is a cutting-edge blockchain protocol focusing on scalability and security.",
    logo: "/lovable-uploads/b0037210-e798-410d-b9d2-e4f24211c714.png",
    status: "active",
    installationGuide: "# Hemi Node Installation Guide\n\n## Prerequisites\n- Ubuntu 20.04 or higher\n- 4 CPU cores\n- 8GB RAM\n- 100GB SSD\n\n## Installation Steps\n```bash\n# Update and install dependencies\napt update && apt upgrade -y\napt install curl git build-essential -y\n\n# Install Hemi\ncurl -sSL https://get.hemi.network | bash\n\n# Start the node\nhemi-node start --testnet\n```"
  },
  {
    id: "sunrise",
    name: "Sunrise",
    categories: ["Tech", "Community"],
    description: "Sunrise is a decentralized finance platform built for cross-chain compatibility.",
    logo: "/lovable-uploads/b0037210-e798-410d-b9d2-e4f24211c714.png",
    status: "active",
    installationGuide: "# Sunrise Node Installation Guide\n\n## Prerequisites\n- Ubuntu 20.04 or higher\n- 2 CPU cores\n- 4GB RAM\n- 50GB SSD\n\n## Installation Steps\n```bash\n# Update and install dependencies\napt update && apt upgrade -y\napt install curl git build-essential -y\n\n# Install Sunrise\ncurl -sSL https://get.sunrise.network | bash\n\n# Start the node\nsunrise-node start --testnet\n```"
  },
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Find the project by ID
    const foundProject = projectsData.find(p => p.id === id);
    setProject(foundProject || null);
  }, [id]);
  
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
  
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Project not found</p>
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
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <img 
                src={project.logo} 
                alt={project.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/100x100?text=Logo";
                }}
              />
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Installation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <Markdown
                    components={{
                      code(props) {
                        const {children, className, node, ...rest} = props
                        const match = /language-(\w+)/.exec(className || '')
                        
                        // If it's a code block (with language)
                        if (match) {
                          return (
                            <div className="relative">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                <code className={className} {...rest}>
                                  {children}
                                </code>
                              </pre>
                              <button
                                onClick={() => copyCode(children as string)}
                                className="absolute right-2 top-2 bg-gray-800 hover:bg-gray-700 text-gray-300 p-1 rounded"
                              >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>
                          )
                        }
                        
                        // Inline code
                        return (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {project.installationGuide}
                  </Markdown>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Resources</h3>
                    <div className="space-y-2">
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>Official Website</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>Documentation</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>GitHub Repository</span>
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Community</h3>
                    <div className="space-y-2">
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>Twitter</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>Discord</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">CPU</span>
                    <span className="font-medium">4 cores</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">RAM</span>
                    <span className="font-medium">8 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Storage</span>
                    <span className="font-medium">100 GB SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">OS</span>
                    <span className="font-medium">Ubuntu 20.04+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
