
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hashPassword, verifyPassword, generateSessionToken, isValidSessionToken } from "@/utils/auth";

export const useSecureAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Validate session token
  const validateSession = async (token: string): Promise<boolean> => {
    if (!isValidSessionToken(token)) {
      return false;
    }

    try {
      // Check if session exists in database (you would need to create an admin_sessions table)
      // For now, we'll use a simpler approach with localStorage validation
      const storedSession = localStorage.getItem('admin-session-token');
      const sessionExpiry = localStorage.getItem('admin-session-expiry');
      
      if (storedSession === token && sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry);
        return Date.now() < expiryTime;
      }
      
      return false;
    } catch (error) {
      console.error("Session validation error:", error);
      return false;
    }
  };

  // Check admin authentication
  const checkAdminAuth = async () => {
    const token = localStorage.getItem("admin-session-token");
    if (token && await validateSession(token)) {
      setIsAuthenticated(true);
      setSessionToken(token);
    } else {
      setIsAuthenticated(false);
      setSessionToken(null);
      // Clear invalid session data
      localStorage.removeItem("admin-session-token");
      localStorage.removeItem("admin-session-expiry");
      localStorage.removeItem("admin-username");
    }
    setIsLoading(false);
  };

  // Handle successful login
  const handleLoginSuccess = (username: string) => {
    // Generate secure session token
    const token = generateSessionToken();
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    // Store session data
    localStorage.setItem("admin-session-token", token);
    localStorage.setItem("admin-session-expiry", expiryTime.toString());
    localStorage.setItem("admin-username", username);
    
    setIsAuthenticated(true);
    setSessionToken(token);
  };

  // Secure login function
  const secureLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Login attempt for username:", username);
      
      // Input validation
      if (!username?.trim() || !password?.trim()) {
        console.log("Validation failed: empty credentials");
        return { success: false, error: "Please enter both username and password" };
      }

      if (username.length > 50 || password.length > 100) {
        console.log("Validation failed: credentials too long");
        return { success: false, error: "Invalid credentials" };
      }

      // Get admin user from database
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();
      
      console.log("Database query result:", { found: !!data, error: error?.message });
      
      if (error) {
        console.error("Database error during login:", error);
        throw error;
      }
      
      // Verify credentials
      if (data) {
        console.log("User found, verifying password...");
        console.log("Password hash from DB:", data.password.substring(0, 20));
        
        const passwordMatch = await verifyPassword(password.trim(), data.password);
        console.log("Password match result:", passwordMatch);
        
        if (passwordMatch) {
          handleLoginSuccess(username);
          return { success: true };
        }
      } else {
        console.log("No user found with username:", username);
      }
      
      return { 
        success: false, 
        error: "Invalid username or password" 
      };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: "An error occurred during login" 
      };
    }
  };

  // Admin logout
  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem("admin-session-token");
    localStorage.removeItem("admin-session-expiry");
    localStorage.removeItem("admin-username");
    
    setIsAuthenticated(false);
    setSessionToken(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Create admin with hashed password
  const createAdmin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!username?.trim() || !password?.trim()) {
        return { success: false, error: "Username and password are required" };
      }

      if (username.length < 3 || password.length < 6) {
        return { success: false, error: "Username must be at least 3 characters and password at least 6 characters" };
      }

      const hashedPassword = await hashPassword(password.trim());
      
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          username: username.trim(),
          password: hashedPassword
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error creating admin:", error);
      return { 
        success: false, 
        error: "Failed to create admin user" 
      };
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    sessionToken,
    secureLogin,
    handleLogout,
    createAdmin,
  };
};
