-- Delete the existing admin user with incorrect password hash
DELETE FROM admin_users WHERE username = 'admin';

-- The new admin will be created through the application using proper bcrypt hashing
-- Default credentials will be: username: admin, password: admin123