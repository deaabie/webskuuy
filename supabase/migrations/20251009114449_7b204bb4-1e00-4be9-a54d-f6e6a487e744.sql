-- Hash existing plaintext passwords for admin users
-- This migration re-hashes the existing admin password using SHA-256

-- First, create a function to hash passwords using SHA-256
CREATE OR REPLACE FUNCTION hash_password_sha256(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(password, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing admin users to have hashed passwords
-- Only update if the password doesn't look like a hash (not 64 hex characters)
UPDATE public.admin_users
SET password = hash_password_sha256(password)
WHERE LENGTH(password) != 64 OR password !~ '^[0-9a-f]{64}$';

-- Drop the temporary function
DROP FUNCTION IF EXISTS hash_password_sha256(TEXT);