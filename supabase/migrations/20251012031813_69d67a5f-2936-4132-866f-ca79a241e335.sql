-- Delete all existing admin users
DELETE FROM admin_users;

-- Insert simple admin user with plain text password
INSERT INTO admin_users (username, password)
VALUES ('admin', 'Depok789@@@!');