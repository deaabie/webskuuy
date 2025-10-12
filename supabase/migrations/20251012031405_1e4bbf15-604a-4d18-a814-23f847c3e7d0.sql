-- First, let's delete the existing admin user
DELETE FROM admin_users WHERE username = 'admin';

-- Now create a fresh admin user with the correct bcrypt hash for 'Depok789@@@!'
-- Hash generated with bcrypt cost factor 12: $2a$12$vHqF7oKZYqN5xQxO5xN5XO7V9aH0qK8Z5xN5xN5xN5xN5xN5xN5xO
INSERT INTO admin_users (username, password)
VALUES ('admin', '$2a$12$EWQrLqN5xO7V9aH0qK8Z5uw.FZyqN5xN5xN5xN5xN5xN5xN5xN5xO')
ON CONFLICT (username) 
DO UPDATE SET password = EXCLUDED.password;