-- Enable RLS on all public tables that have policies but RLS is not enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faucet_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop the insecure policy that allows all authenticated users to read admin credentials
DROP POLICY IF EXISTS "Admin users can be read by authenticated users" ON public.admin_users;

-- Create secure policies for admin_users table
-- Only allow service role to read admin users (for authentication purposes)
CREATE POLICY "Service role can read admin users"
ON public.admin_users
FOR SELECT
TO service_role
USING (true);

-- Only allow service role to insert admin users
CREATE POLICY "Service role can insert admin users"
ON public.admin_users
FOR INSERT
TO service_role
WITH CHECK (true);

-- Only allow service role to update admin users
CREATE POLICY "Service role can update admin users"
ON public.admin_users
FOR UPDATE
TO service_role
USING (true);

-- Only allow service role to delete admin users
CREATE POLICY "Service role can delete admin users"
ON public.admin_users
FOR DELETE
TO service_role
USING (true);