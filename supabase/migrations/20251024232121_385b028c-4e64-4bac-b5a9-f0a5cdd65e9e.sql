-- Fix RLS policies to allow admin panel operations with anon role

-- Update the UPDATE policy for projects table
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON public.projects;

CREATE POLICY "Enable update for admin operations" 
ON public.projects 
FOR UPDATE 
USING (true);

-- Update the INSERT policy for projects table
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON public.projects;

CREATE POLICY "Enable insert for admin operations" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

-- Update the UPDATE policy for project_details table
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON public.project_details;

CREATE POLICY "Enable update for admin operations" 
ON public.project_details 
FOR UPDATE 
USING (true);

-- Update the INSERT policy for project_details table
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON public.project_details;

CREATE POLICY "Enable insert for admin operations" 
ON public.project_details 
FOR INSERT 
WITH CHECK (true);