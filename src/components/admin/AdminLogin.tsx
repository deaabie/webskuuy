
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authenticateAdmin, getAdminUsers, initializeLocalStorage } from "@/services/localStorageService";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();

  // Initialize local storage on component mount
  useState(() => {
    initializeLocalStorage();
  });

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
      
      // Check if admin credentials are valid
      const isAuthenticated = authenticateAdmin(username.trim(), password.trim());
      
      if (isAuthenticated) {
        console.log("Admin authentication successful");
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

  // Check if there are any admin users
  const adminExists = getAdminUsers().length > 0;

  // Option to create default admin if none exists
  const createDefaultAdmin = async () => {
    setLoginLoading(true);
    try {
      // This will initialize the local storage with a default admin user
      initializeLocalStorage();
      
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
