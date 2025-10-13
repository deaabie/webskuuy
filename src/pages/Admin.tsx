import { Loader2 } from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";
import TabContent from "@/components/admin/TabContent";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const Admin = () => {
  const { isLoading, isAuthenticated, handleLogout, checkAdminAuth } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={checkAdminAuth} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <AdminHeader onLogout={handleLogout} />
        <TabContent />
      </div>
    </div>
  );
};

export default Admin;
