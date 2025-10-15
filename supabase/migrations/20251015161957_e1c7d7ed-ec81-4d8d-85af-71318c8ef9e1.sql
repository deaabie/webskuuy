-- Delete the Pipe Network projects
DELETE FROM public.projects WHERE slug IN ('pipe-network', 'pipe-networkd');

-- Update RLS policy to allow anon role to delete (for admin panel)
DROP POLICY IF EXISTS "Enable delete for authenticated users and service role" ON public.projects;

CREATE POLICY "Enable delete for admin operations" 
ON public.projects 
FOR DELETE 
USING (true);

-- Same for project_details table
DROP POLICY IF EXISTS "Enable delete for authenticated users and service role" ON public.project_details;

CREATE POLICY "Enable delete for admin operations" 
ON public.project_details 
FOR DELETE 
USING (true);