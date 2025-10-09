import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useSecureAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const getLoginAttempts = (): LoginAttempt => {
    const stored = localStorage.getItem("admin-login-attempts");
    if (!stored) return { count: 0, lastAttempt: 0 };
    return JSON.parse(stored);
  };

  const updateLoginAttempts = (attempts: LoginAttempt) => {
    localStorage.setItem("admin-login-attempts", JSON.stringify(attempts));
  };

  const isAccountLocked = (): boolean => {
    const attempts = getLoginAttempts();
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        return true;
      } else {
        // Reset attempts after lockout period
        updateLoginAttempts({ count: 0, lastAttempt: 0 });
        return false;
      }
    }
    return false;
  };

  const validateSession = (token: string): boolean => {
    const storedToken = localStorage.getItem("admin-session-token");
    return storedToken === token && token.length > 0;
  };

  const checkAdminAuth = async () => {
    const token = localStorage.getItem("admin-session-token");
    
    if (token && validateSession(token)) {
      setSessionToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setSessionToken(null);
      localStorage.removeItem("admin-session-token");
      localStorage.removeItem("admin-username");
    }
    
    setIsLoading(false);
  };

  const handleLoginSuccess = (username: string, token: string) => {
    localStorage.setItem("admin-session-token", token);
    localStorage.setItem("admin-username", username);
    localStorage.setItem("admin-login-attempts", JSON.stringify({ count: 0, lastAttempt: 0 }));
    
    setSessionToken(token);
    setIsAuthenticated(true);
  };

  const secureLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isAccountLocked()) {
      return { 
        success: false, 
        error: "Account is locked due to too many failed attempts. Please try again later." 
      };
    }

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    if (username.length > 50 || password.length > 100) {
      return { success: false, error: "Invalid input length" };
    }

    try {
      // Call edge function for authentication
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'login',
          username, 
          password 
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error("Authentication service error");
      }

      if (data.success) {
        handleLoginSuccess(username, data.sessionToken);
        return { success: true };
      } else {
        // Increment failed login attempts
        const attempts = getLoginAttempts();
        const newAttempts = {
          count: attempts.count + 1,
          lastAttempt: Date.now()
        };
        updateLoginAttempts(newAttempts);

        return { 
          success: false, 
          error: data.error || "Invalid username or password" 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An error occurred during login" 
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-session-token");
    localStorage.removeItem("admin-username");
    setIsAuthenticated(false);
    setSessionToken(null);
  };

  const createAdmin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    if (username.length < 3 || username.length > 50) {
      return { success: false, error: "Username must be between 3 and 50 characters" };
    }

    if (password.length < 8 || password.length > 100) {
      return { success: false, error: "Password must be between 8 and 100 characters" };
    }

    try {
      // Call edge function to create admin
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'create',
          username, 
          password 
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error("Failed to create admin user");
      }

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to create admin" };
      }
    } catch (error) {
      console.error("Create admin error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create admin user" 
      };
    }
  };

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
    isAccountLocked: isAccountLocked()
  };
};
