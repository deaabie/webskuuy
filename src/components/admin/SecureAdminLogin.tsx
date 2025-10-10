
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAdminAuth } from "@/hooks/use-secure-admin-auth";

interface SecureAdminLoginProps {
  onLoginSuccess: () => void;
}

const SecureAdminLogin = ({ onLoginSuccess }: SecureAdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const { toast } = useToast();
  const { secureLogin, createAdmin, isAccountLocked, clearLoginAttempts } = useSecureAdminAuth();

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
      const result = await secureLogin(username, password);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Authentication Failed",
          description: result.error,
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
    if (e.key === 'Enter' && !isAccountLocked) {
      handleLogin();
    }
  };

  // Option to create default admin if none exists
  const createDefaultAdmin = async () => {
    setLoginLoading(true);
    try {
      const result = await createAdmin('admin', 'SecureAdmin123!');
      
      if (result.success) {
        setAdminExists(true);
        toast({
          title: "Default Admin Created",
          description: "Username: admin, Password: SecureAdmin123!",
        });
        
        // Auto-fill the form
        setUsername('admin');
        setPassword('SecureAdmin123!');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create default admin",
          variant: "destructive"
        });
      }
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
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Secure Admin Login</CardTitle>
          </div>
          <CardDescription>
            {isAccountLocked ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                Account temporarily locked due to failed login attempts
              </div>
            ) : (
              "Enter your credentials to access the admin panel"
            )}
          </CardDescription>
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
                disabled={isAccountLocked}
                maxLength={50}
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
                disabled={isAccountLocked}
                maxLength={100}
              />
            </div>
            {isAccountLocked && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded space-y-2">
                <p>Too many failed login attempts. Please wait 15 minutes before trying again.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    clearLoginAttempts();
                    toast({
                      title: "Account Unlocked",
                      description: "You can now try logging in again",
                    });
                    window.location.reload();
                  }}
                >
                  Unlock Account Now
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full" 
            onClick={handleLogin}
            disabled={loginLoading || isAccountLocked}
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

export default SecureAdminLogin;
