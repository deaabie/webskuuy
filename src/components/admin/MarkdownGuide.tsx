
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle } from "lucide-react";

const MarkdownGuide = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle size={16} className="mr-2" />
          Markdown Help
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Markdown Guide for Installation Guides</SheetTitle>
          <SheetDescription>
            Use these formatting tips to create professional installation guides
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="basics" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="code">Code Blocks</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm">
              <h3>Headings</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                # Main Title (H1)
                ## Section (H2)
                ### Subsection (H3)
              </pre>

              <h3>Text Formatting</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                **Bold text** for emphasis
                *Italic text* for definitions or notes
              </pre>

              <h3>Lists</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                - Bullet points for unordered lists
                - Another bullet point

                1. Numbered steps for sequential instructions
                2. Second step
              </pre>

              <h3>Blockquotes</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                {">"}  Important note or warning message
                {">"}  Multiple lines in the same blockquote
              </pre>

              <h3>Horizontal Rule</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                ---
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm">
              <h3>Code Blocks with Syntax Highlighting</h3>
              <p>For command-line instructions, use triple backticks with the language specified as "bash":</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                ```bash
                sudo apt update
                sudo apt install -y build-essential
                ```
              </pre>

              <h3>Configuration Files</h3>
              <p>For configuration files, specify the file type:</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                ```toml
                # This is a TOML config
                name = "my-node"
                port = 8545
                ```

                ```yaml
                # This is a YAML config
                name: my-node
                port: 8545
                ```
              </pre>

              <h3>Inline Code</h3>
              <p>For short commands or parameters, use single backticks:</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                Use the `--help` flag to see all available options.
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm">
              <h3>Links</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                [Link text](https://example.com)
                
                // Reference style links
                [Link text][ref]
                [ref]: https://example.com
              </pre>

              <h3>Images</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                ![Alt text](https://example.com/image.png)
                
                // With title
                ![Alt text](https://example.com/image.png "Image title")
              </pre>

              <h3>Tables</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                | Header 1 | Header 2 |
                |----------|----------|
                | Cell 1   | Cell 2   |
                | Cell 3   | Cell 4   |
              </pre>

              <h3>Task Lists</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                - [x] Completed task
                - [ ] Incomplete task
              </pre>

              <h3>Collapsible Sections</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                <details>
                  <summary>Click to expand</summary>
                  This content is hidden by default.
                </details>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium">Installation Guide Template</h3>
          <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-xs overflow-auto mt-2">
{`# Project Name Installation Guide

## Prerequisites
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 500GB SSD
- OS: Ubuntu 22.04 LTS

## Installation Steps

### 1. Update system
\`\`\`bash
sudo apt update
sudo apt upgrade -y
\`\`\`

### 2. Install dependencies
\`\`\`bash
sudo apt install -y build-essential curl git
\`\`\`

### 3. Configure
Edit the configuration file:
\`\`\`bash
nano ~/.project/config.toml
\`\`\`

Add the following:
\`\`\`toml
port = 8080
enable_metrics = true
\`\`\`

## Troubleshooting

- **Error: Port already in use**: Change the port in config.toml
- **Error: Not enough disk space**: Free up at least 500MB`}
          </pre>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MarkdownGuide;
