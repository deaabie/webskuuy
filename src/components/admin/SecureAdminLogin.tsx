
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
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
  const { toast } = useToast();
  const { secureLogin } = useSecureAdminAuth();

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
    if (e.key === 'Enter') {
      handleLogin();
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
            Enter your credentials to access the admin panel
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
                maxLength={100}
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecureAdminLogin;
