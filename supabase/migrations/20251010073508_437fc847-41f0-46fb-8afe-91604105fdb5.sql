-- Enable read access for everyone on project_details table
CREATE POLICY "Enable read access for all users" 
ON public.project_details 
FOR SELECT 
USING (true);

-- Enable write access for authenticated users only on project_details table
CREATE POLICY "Enable write access for authenticated users only" 
ON public.project_details 
FOR ALL 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');