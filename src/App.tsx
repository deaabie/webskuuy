
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Tools from "./pages/Tools";
import Faucet from "./pages/Faucet";
import CosmosExplorer from "./pages/CosmosExplorer";
import Footer from "./components/Footer";
import Header from "./components/Header";

const queryClient = new QueryClient();

// Component to conditionally render the footer based on route
const AppContent = () => {
  const location = useLocation();

  // Set default dark mode on initial load
  useEffect(() => {
    // Check localStorage first
    const savedDarkMode = localStorage.getItem("darkMode");
    
    if (savedDarkMode === null || savedDarkMode === "true") {
      // Either no preference or explicitly set to true, apply dark mode
      document.documentElement.classList.add("dark");
    } else {
      // Explicitly set to false, ensure dark mode is not applied
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Toaster />
        <Sonner />
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/explorer" element={<CosmosExplorer />} />
          {/* Removed duplicate route: "/cosmos-explorer" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {location.pathname !== "/" && <Footer />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
