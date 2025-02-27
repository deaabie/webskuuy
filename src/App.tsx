
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Tools from "./pages/Tools";
import About from "./pages/About";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  // Set default dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  
  const [showLoginInfo, setShowLoginInfo] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showLoginInfo && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
            <Alert className="bg-purple-800 text-white">
              <AlertTitle className="flex justify-between items-center">
                Admin Login Credentials
                <button onClick={() => setShowLoginInfo(false)}>
                  <X size={16} />
                </button>
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <p><strong>Username:</strong> admin</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
