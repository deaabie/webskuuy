
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check admin authentication
  const checkAdminAuth = () => {
    const authStatus = localStorage.getItem("admin-auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Admin logout
  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    isAdminLoggedIn: isAuthenticated, // Add this property as an alias for isAuthenticated
    handleLoginSuccess,
    handleLogout
  };
};
