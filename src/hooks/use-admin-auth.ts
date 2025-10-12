import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const checkAdminAuth = () => {
    const isAdmin = localStorage.getItem("admin-authenticated") === "true";
    setIsAuthenticated(isAdmin);
    setIsLoading(false);
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!username || !password) {
        return { success: false, error: "Please enter both username and password" };
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();
      
      if (error) {
        console.error("Database error:", error);
        return { success: false, error: "An error occurred" };
      }
      
      if (data) {
        localStorage.setItem("admin-authenticated", "true");
        localStorage.setItem("admin-username", username);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: "Invalid username or password" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    localStorage.removeItem("admin-username");
    setIsAuthenticated(false);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    isAdminLoggedIn: isAuthenticated,
    login,
    handleLoginSuccess,
    handleLogout,
  };
};
