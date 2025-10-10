
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hashPassword, verifyPassword, generateSessionToken, isValidSessionToken } from "@/utils/auth";

// Rate limiting for login attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

export const useSecureAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Get login attempts from localStorage
  const getLoginAttempts = (): LoginAttempt => {
    try {
      const stored = localStorage.getItem('admin-login-attempts');
      return stored ? JSON.parse(stored) : { count: 0, lastAttempt: 0 };
    } catch {
      return { count: 0, lastAttempt: 0 };
    }
  };

  // Update login attempts
  const updateLoginAttempts = (attempts: LoginAttempt) => {
    localStorage.setItem('admin-login-attempts', JSON.stringify(attempts));
  };

  // Check if account is locked
  const isAccountLocked = (): boolean => {
    const attempts = getLoginAttempts();
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        return true;
      } else {
        // Auto-unlock after lockout duration
        clearLoginAttempts();
        return false;
      }
    }
    return false;
  };

  // Clear login attempts (for unlocking)
  const clearLoginAttempts = () => {
    localStorage.removeItem('admin-login-attempts');
  };

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
    
    // Clear login attempts
    localStorage.removeItem('admin-login-attempts');
    
    setIsAuthenticated(true);
    setSessionToken(token);
  };

  // Secure login function
  const secureLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check if account is locked
    if (isAccountLocked()) {
      const attempts = getLoginAttempts();
      const timeLeft = Math.ceil((LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 60000);
      return { 
        success: false, 
        error: `Account temporarily locked. Try again in ${timeLeft} minutes.` 
      };
    }

    try {
      // Input validation
      if (!username?.trim() || !password?.trim()) {
        return { success: false, error: "Please enter both username and password" };
      }

      if (username.length > 50 || password.length > 100) {
        return { success: false, error: "Invalid credentials" };
      }

      // Get admin user from database
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();
      
      if (error) {
        console.error("Database error during login:", error);
        throw error;
      }
      
      // Verify credentials
      if (data && await verifyPassword(password.trim(), data.password)) {
        handleLoginSuccess(username);
        return { success: true };
      } else {
        // Update failed login attempts
        const attempts = getLoginAttempts();
        const newAttempts = {
          count: attempts.count + 1,
          lastAttempt: Date.now()
        };
        updateLoginAttempts(newAttempts);
        
        return { 
          success: false, 
          error: "Invalid username or password" 
        };
      }
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
    isAccountLocked: isAccountLocked(),
    clearLoginAttempts
  };
};
