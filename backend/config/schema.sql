-- ===========================
-- DATABASE CREATION
-- ===========================
CREATE DATABASE IF NOT EXISTS Clinic_Management_System CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Clinic_Management_System;

-- ===========================
-- 1. Roles Table
-- ===========================
CREATE TABLE IF NOT EXISTS roles (
    role_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Roles
INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
(1, 'Admin', 'Administrator with full access'),
(2, 'Doctor', 'Medical Doctor'),
(3, 'Nurse', 'Medical Nurse'),
(4, 'Receptionist', 'Front Desk Receptionist'),
(5, 'Pharmacist', 'Pharmacy Staff'),
(6, 'Laboratorist', 'Lab Technician');


-- ===========================
-- 2. Users Table (Staff)
-- ===========================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100), -- For doctors
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_role_id (role_id),
    INDEX idx_email (email)
);

-- ===========================
-- 2. Patients
-- ===========================
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    emergency_contact VARCHAR(20),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allergies TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_phone (phone),
    INDEX idx_name (full_name),
    FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ===========================
-- 3. Appointments
-- ===========================
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id VARCHAR(36) NOT NULL,
    doctor_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    type ENUM('new', 'follow_up', 'emergency') DEFAULT 'new',
    reason TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_doctor_slot (doctor_id, appointment_date, appointment_time),
    INDEX idx_doctor_date (doctor_id, appointment_date),
    INDEX idx_patient (patient_id),
    INDEX idx_status (status),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ===========================
-- 4. Consultations
-- ===========================
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    appointment_id VARCHAR(36) UNIQUE NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    doctor_id VARCHAR(36) NOT NULL,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    temperature DECIMAL(4,2),
    pulse_rate INT,
    respiratory_rate INT,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    bmi DECIMAL(4,2),
    spo2 DECIMAL(4,2),
    symptoms TEXT,
    diagnosis TEXT,
    notes TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_date (created_at),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- ===========================
-- 5. Prescriptions
-- ===========================
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    consultation_id VARCHAR(36) NOT NULL,
    drug_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    status ENUM('pending', 'dispensed', 'cancelled') DEFAULT 'pending',
    dispensed_at TIMESTAMP NULL,
    dispensed_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_consultation(consultation_id),
    INDEX idx_status(status),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (dispensed_by) REFERENCES users(id)
);

-- ===========================
-- 6. Lab Requests
-- ===========================
CREATE TABLE IF NOT EXISTS lab_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    consultation_id VARCHAR(36) NOT NULL,
    test_name VARCHAR(200) NOT NULL,
    test_type ENUM('blood', 'urine', 'imaging', 'other') DEFAULT 'blood',
    instructions TEXT,
    status ENUM('requested', 'sample_collected', 'processing', 'completed', 'cancelled') DEFAULT 'requested',
    result TEXT,
    result_unit VARCHAR(50),
    normal_range VARCHAR(100),
    completed_at TIMESTAMP NULL,
    completed_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_consultation(consultation_id),
    INDEX idx_status(status),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_by) REFERENCES users(id)
);

-- ===========================
-- 7. Pharmacy Inventory
-- ===========================
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    drug_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    reorder_level INT DEFAULT 10,
    expiry_date DATE NOT NULL,
    status ENUM('available','expired') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_drug_name (drug_name),
    INDEX idx_category (category),
    INDEX idx_expiry_status (expiry_date, status)
);

-- ===========================
-- 8. Bills
-- ===========================
CREATE TABLE IF NOT EXISTS bills (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    consultation_id VARCHAR(36),
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    pharmacy_total DECIMAL(10,2) DEFAULT 0,
    lab_total DECIMAL(10,2) DEFAULT 0,
    other_charges DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'mobile_money', 'insurance') DEFAULT 'cash',
    payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
    insurance_provider VARCHAR(100),
    insurance_claim_number VARCHAR(100),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient(patient_id),
    INDEX idx_bill_number(bill_number),
    INDEX idx_payment_status(payment_status),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ===========================
-- 9. Bill Items
-- ===========================
CREATE TABLE IF NOT EXISTS bill_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    bill_id VARCHAR(36) NOT NULL,
    item_type ENUM('consultation', 'pharmacy', 'lab', 'other') NOT NULL,
    item_description VARCHAR(200) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    prescription_id VARCHAR(36),
    lab_request_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bill(bill_id),
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id),
    FOREIGN KEY (lab_request_id) REFERENCES lab_requests(id)
);

-- ===========================
-- 10. Notifications
-- ===========================
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    staff_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_staff_unread (staff_id, is_read)
);

-- ===========================
-- 11. Dispensations
-- ===========================
CREATE TABLE IF NOT EXISTS dispensations (
    dispense_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    drug_id VARCHAR(36) NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    dispensed_by VARCHAR(36) NOT NULL,
    dispensed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks VARCHAR(255),
    CONSTRAINT fk_dispense_drug FOREIGN KEY (drug_id)
        REFERENCES pharmacy_inventory(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_dispense_patient FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_dispense_staff FOREIGN KEY (dispensed_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_dispense_drug (drug_id),
    INDEX idx_dispense_patient (patient_id),
    INDEX idx_dispense_staff (dispensed_by)
) ENGINE=InnoDB;

-- Enable event scheduler if not already
SET GLOBAL event_scheduler = ON;

-- Create daily event
CREATE EVENT IF NOT EXISTS mark_expired_drugs
ON SCHEDULE EVERY 1 DAY
DO
  UPDATE pharmacy_inventory
  SET status = 'expired'
  WHERE expiry_date <= CURDATE() AND status = 'available';
