-- Fix admin_users RLS policies to allow login
-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Service role can read admin users" ON public.admin_users;

-- Create a new policy that allows anyone to read admin users (needed for login verification)
CREATE POLICY "Allow anon to read admin users for authentication" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Keep write operations restricted to service role only
-- (The other policies for INSERT, UPDATE, DELETE remain unchanged)