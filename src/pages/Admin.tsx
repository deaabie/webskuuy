
import { Loader2 } from "lucide-react";
import SecureAdminLogin from "@/components/admin/SecureAdminLogin";
import TabContent from "@/components/admin/TabContent";
import AdminHeader from "@/components/admin/AdminHeader";
import { useSecureAdminAuth } from "@/hooks/use-secure-admin-auth";

const Admin = () => {
  const { isLoading, isAuthenticated, handleLogout } = useSecureAdminAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <SecureAdminLogin onLoginSuccess={() => {}} />;
  }
  
  // Admin Dashboard
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
