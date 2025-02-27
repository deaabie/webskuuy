
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const { toast } = useToast();

  // Check if any admin users exist
  useEffect(() => {
    const checkAdminUsers = async () => {
      const { count, error } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Error checking admin users:", error);
        return;
      }
      
      setAdminExists(count !== null && count > 0);
    };
    
    checkAdminUsers();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setLoginLoading(true);
    
    try {
      console.log("Attempting login with username:", username);
      
      // First, get the admin user with the matching username
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();
      
      console.log("Login response:", { data, error });
      
      if (error) {
        console.error("Database error during login:", error);
        throw error;
      }
      
      // Check if admin exists and password matches
      if (data && data.password === password.trim()) {
        console.log("Admin user found, authentication successful:", data);
        // Store admin credentials in localStorage
        localStorage.setItem("admin-auth", "authenticated");
        localStorage.setItem("admin-username", username);
        
        // Notify success and call the success callback
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        onLoginSuccess();
      } else {
        console.log("No matching admin user found or password incorrect");
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Option to create default admin if none exists
  const createDefaultAdmin = async () => {
    setLoginLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          username: 'admin',
          password: 'admin123'
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setAdminExists(true);
      toast({
        title: "Default Admin Created",
        description: "Username: admin, Password: admin123",
      });
      
      // Auto-fill the form
      setUsername('admin');
      setPassword('admin123');
    } catch (error) {
      console.error("Error creating default admin:", error);
      toast({
        title: "Error",
        description: "Failed to create default admin",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full" 
            onClick={handleLogin}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          
          {!adminExists && (
            <Button 
              variant="outline"
              className="w-full" 
              onClick={createDefaultAdmin}
              disabled={loginLoading}
            >
              Create Default Admin
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
