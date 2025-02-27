
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Code, Terminal, Share2, BookOpen, Github, CheckCircle2 } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      title: "Project Generator",
      description: "Create new project scaffolds with best practices and configs pre-configured",
      icon: <Code className="h-8 w-8" />,
      badge: "Popular",
      features: ["Templates for various frameworks", "Custom configurations", "Optimized build setup"]
    },
    {
      title: "CLI Interface",
      description: "Powerful command-line tools to manage your projects from the terminal",
      icon: <Terminal className="h-8 w-8" />,
      features: ["Project management", "Deployment tools", "Database migrations"]
    },
    {
      title: "Component Library",
      description: "Ready-to-use UI components that follow accessibility best practices",
      icon: <Share2 className="h-8 w-8" />,
      badge: "New",
      features: ["Fully responsive", "Theme customization", "Comprehensive documentation"]
    },
    {
      title: "Documentation Builder",
      description: "Generate beautiful, searchable documentation for your projects",
      icon: <BookOpen className="h-8 w-8" />,
      features: ["Markdown support", "Code highlighting", "Versioning"]
    },
    {
      title: "GitHub Integration",
      description: "Seamlessly connect your projects with GitHub repositories",
      icon: <Github className="h-8 w-8" />,
      features: ["Automatic PR creation", "CI/CD integration", "Issue tracking"]
    },
    {
      title: "Code Quality Tools",
      description: "Analyze and improve your codebase quality and maintainability",
      icon: <CheckCircle2 className="h-8 w-8" />,
      features: ["Linting", "Type checking", "Performance analysis"]
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Powerful utilities and resources to streamline your development workflow and improve productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map((tool, index) => (
          <Card key={index} className="relative overflow-hidden group">
            {tool.badge && (
              <Badge className="absolute top-4 right-4 bg-primary">{tool.badge}</Badge>
            )}
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4 text-primary">
                {tool.icon}
              </div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-primary flex-shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" className="mt-6 w-full group-hover:bg-primary/10">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Developer SDK
            </h2>
            <p className="text-muted-foreground mb-6">
              Our comprehensive Software Development Kit gives you all the tools you need to build powerful, 
              scalable applications. With extensive documentation and examples, you'll be up and running in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button>
                <Download className="mr-2 h-4 w-4" /> Download SDK
              </Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </div>
          <div className="bg-background p-4 rounded-md">
            <pre className="text-xs md:text-sm overflow-x-auto">
              <code className="language-bash block p-4">
                {`# Install the SDK
npm install @company/sdk

# Initialize your project
npx @company/sdk init my-project

# Start development server
cd my-project
npm run dev`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-4">Community Resources</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Check out these additional resources created by our community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Starter Templates",
            description: "Pre-configured project templates for various use cases",
            link: "#"
          },
          {
            title: "Plugin Directory",
            description: "Extend functionality with community-built plugins",
            link: "#"
          },
          {
            title: "Developer Forum",
            description: "Get help and share knowledge with other developers",
            link: "#"
          }
        ].map((resource, index) => (
          <a 
            key={index} 
            href={resource.link} 
            className="block p-6 border rounded-lg hover:bg-primary/5 transition-colors"
          >
            <h3 className="font-bold mb-2">{resource.title}</h3>
            <p className="text-muted-foreground mb-4">{resource.description}</p>
            <span className="text-primary flex items-center">
              Explore <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Tools;
