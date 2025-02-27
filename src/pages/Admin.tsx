
import { Loader2 } from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";
import TabContent from "@/components/admin/TabContent";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const Admin = () => {
  const { isLoading, isAuthenticated, handleLoginSuccess, handleLogout } = useAdminAuth();
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }
  
  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <AdminHeader onLogout={handleLogout} />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <TabContent />
        )}
      </div>
    </div>
  );
};

export default Admin;
