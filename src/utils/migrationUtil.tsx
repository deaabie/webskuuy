
import { useEffect, useState } from 'react';
import { Project } from "@/types/project";
import { importDataFromSupabase, AdminUser } from "@/services/localStorageService";
import { supabase } from "@/integrations/supabase/client";

// This component will handle the one-time migration from Supabase to localStorage
export const DataMigration = () => {
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if migration has already been done
    if (localStorage.getItem('migration-complete')) {
      setMigrationComplete(true);
      return;
    }

    const migrateData = async () => {
      try {
        // Fetch projects from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');
        
        if (projectsError) {
          console.error("Error fetching projects from Supabase:", projectsError);
          setError("Failed to fetch projects from Supabase");
          return;
        }
        
        // Fetch admin users from Supabase
        const { data: adminsData, error: adminsError } = await supabase
          .from('admin_users')
          .select('*');
        
        if (adminsError) {
          console.error("Error fetching admin users from Supabase:", adminsError);
          setError("Failed to fetch admin users from Supabase");
          return;
        }
        
        // Format projects data
        const projects: Project[] = projectsData.map(project => ({
          id: project.id,
          name: project.name,
          categories: project.categories || [],
          description: project.description || "",
          logo: project.logo || "",
          status: project.status as "active" | "upcoming" | "ended",
          installation_guide: project.installation_guide || "",
          created_at: project.created_at,
          updated_at: project.updated_at
        }));
        
        // Format admin users data
        const adminUsers: AdminUser[] = adminsData.map(admin => ({
          id: admin.id,
          username: admin.username,
          password: admin.password,
          created_at: admin.created_at
        }));
        
        // Import data to localStorage
        importDataFromSupabase(projects, adminUsers);
        
        // Mark migration as complete
        localStorage.setItem('migration-complete', 'true');
        setMigrationComplete(true);
        
        console.log("Migration from Supabase to localStorage completed successfully");
      } catch (err) {
        console.error("Error during migration:", err);
        setError("An unexpected error occurred during migration");
      }
    };

    migrateData();
  }, []);

  return null; // This component doesn't render anything
};

export default DataMigration;
