-- Update RLS policies for projects table to allow service role operations
-- This allows admin operations to work properly

-- Drop existing write policy
DROP POLICY IF EXISTS "Enable write access for authenticated users only" ON public.projects;

-- Create new policies with service role access
CREATE POLICY "Enable insert for authenticated users and service role"
  ON public.projects
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Enable update for authenticated users and service role"
  ON public.projects
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Enable delete for authenticated users and service role"
  ON public.projects
  FOR DELETE
  USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

-- Update RLS policies for project_details table as well
DROP POLICY IF EXISTS "Enable write access for authenticated users only" ON public.project_details;

CREATE POLICY "Enable insert for authenticated users and service role"
  ON public.project_details
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Enable update for authenticated users and service role"
  ON public.project_details
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Enable delete for authenticated users and service role"
  ON public.project_details
  FOR DELETE
  USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );