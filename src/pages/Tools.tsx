
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Server, Terminal, Activity, BookOpen, Shield, Gauge } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      title: "Node Launcher",
      description: "Automated node deployment with pre-configured settings for popular blockchains",
      icon: <Server className="h-8 w-8" />,
      badge: "Popular",
      features: ["One-click node deployment", "Multi-chain support", "Infrastructure optimization"]
    },
    {
      title: "Validator CLI",
      description: "Command-line interface for managing validator operations across networks",
      icon: <Terminal className="h-8 w-8" />,
      features: ["Validator management", "Key generation", "Transaction signing"]
    },
    {
      title: "Performance Monitor",
      description: "Real-time monitoring and alerting for validator nodes and blockchain metrics",
      icon: <Activity className="h-8 w-8" />,
      badge: "New",
      features: ["Uptime tracking", "Slashing protection", "Performance analytics"]
    },
    {
      title: "Documentation Hub",
      description: "Comprehensive guides for setting up nodes across different blockchain networks",
      icon: <BookOpen className="h-8 w-8" />,
      features: ["Network-specific guides", "Troubleshooting tips", "Security best practices"]
    },
    {
      title: "Security Analyzer",
      description: "Audit your validator setup for security vulnerabilities and best practices",
      icon: <Shield className="h-8 w-8" />,
      features: ["Security scanning", "Configuration validation", "Vulnerability detection"]
    },
    {
      title: "Staking Calculator",
      description: "Calculate potential rewards, costs, and ROI for different validator setups",
      icon: <Gauge className="h-8 w-8" />,
      features: ["Revenue projections", "Cost analysis", "Network comparisons"]
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Node Operator Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Essential utilities and resources for setting up, managing, and optimizing your blockchain validators.
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
              Validator SDK
            </h2>
            <p className="text-muted-foreground mb-6">
              Our comprehensive Validator SDK gives you programmatic access to node management APIs, 
              staking functions, and blockchain interaction tools. Built for both solo validators and 
              staking-as-a-service providers.
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
                {`# Install the Validator SDK
npm install @skuuy/validator-sdk

# Initialize validator for Ethereum
const validator = new ValidatorClient({
  network: "ethereum",
  endpoint: "YOUR_RPC_URL",
  keystore: "./validator_keys.json"
});

# Start validation
await validator.start();`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-4">Blockchain Network Resources</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Network-specific resources to help you run validators on major blockchains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Ethereum Staking Suite",
            description: "Complete toolkit for ETH validators including monitoring and MEV optimization",
            link: "#"
          },
          {
            title: "Solana Validator Pack",
            description: "High-performance tools for Solana validators with vote account management",
            link: "#"
          },
          {
            title: "Cosmos Validator Bundle",
            description: "Multi-chain tooling for running validators across the Cosmos ecosystem",
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
