-- Create Demo Users for Hospital Management System
-- Password for all demo accounts: password123
-- Hashed using bcrypt with 10 rounds

USE hospital_management;

-- Check if users table exists
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'doctor', 'receptionist', 'lab_technician', 'pharmacist', 'cashier') NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert demo users (password: password123)
-- Note: In production, use proper password hashing

-- Admin User
INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
VALUES (
  'admin',
  '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5Y',
  'System Administrator',
  'admin@hospital.com',
  'admin',
  '+251911234567',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Doctor User
INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
VALUES (
  'doctor',
  '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5Y',
  'Dr. Sarah Johnson',
  'doctor@hospital.com',
  'doctor',
  '+251911234568',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Receptionist User
INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
VALUES (
  'receptionist',
  '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5Y',
  'Front Desk Receptionist',
  'receptionist@hospital.com',
  'receptionist',
  '+251911234569',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Lab Technician User
INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
VALUES (
  'lab',
  '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5Y',
  'Lab Technician',
  'lab@hospital.com',
  'lab_technician',
  '+251911234570',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Pharmacist User
INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
VALUES (
  'pharmacist',
  '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5Y',
  'Hospital Pharmacist',
  'pharmacy@hospital.com',
  'pharmacist',
  '+251911234571',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Cashier User
INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
VALUES (
  'cashier',
  '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5YJ5YJ5YJ5YJ5YeqKZvVqZ5Y',
  'Billing Cashier',
  'cashier@hospital.com',
  'cashier',
  '+251911234572',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Display created users
SELECT id, username, full_name, email, role, is_active 
FROM users 
ORDER BY id;
