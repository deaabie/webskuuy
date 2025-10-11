-- Insert admin user with bcrypt hashed password
-- Username: admin
-- Password: Depok789@@@!
INSERT INTO admin_users (username, password)
VALUES ('admin', '$2a$12$xQKZY5J8H6rJ4YvN0LYzQeXN7VK3rZJf8hLxJ5vZ3Y1mK9pT4wQ6m')
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password;