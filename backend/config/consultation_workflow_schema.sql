-- ===========================
-- CONSULTATION WORKFLOW ENHANCEMENTS
-- Add these to your existing schema
-- ===========================

USE Clinic_Management_System;

-- Add status column to consultations table (ignore error if exists)
ALTER TABLE consultations 
ADD COLUMN status ENUM('DRAFT', 'WAITING_FOR_LAB_RESULTS', 'READY_FOR_REVIEW', 'COMPLETED') 
DEFAULT 'DRAFT' AFTER doctor_id;

-- Add ICD code column (ignore error if exists)
ALTER TABLE consultations 
ADD COLUMN icd_code VARCHAR(20) AFTER diagnosis;

-- Add lab_request_id reference for tracking (ignore error if exists)
ALTER TABLE consultations 
ADD COLUMN lab_request_id VARCHAR(36) AFTER status;

-- Create lab_notifications table for workflow
CREATE TABLE IF NOT EXISTS lab_notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    consultation_id VARCHAR(36) NOT NULL,
    lab_request_id VARCHAR(36) NOT NULL,
    doctor_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_doctor_unread (doctor_id, is_read),
    INDEX idx_consultation (consultation_id),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (lab_request_id) REFERENCES lab_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add urgency to lab_requests (ignore error if exists)
ALTER TABLE lab_requests 
ADD COLUMN urgency ENUM('normal', 'urgent') DEFAULT 'normal' AFTER test_type;

-- Create Ethiopian MOH lab tests table
CREATE TABLE IF NOT EXISTS ethiopian_moh_lab_tests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    test_name VARCHAR(200) NOT NULL UNIQUE,
    test_code VARCHAR(50) UNIQUE,
    test_type ENUM('blood', 'urine', 'imaging', 'microbiology', 'serology', 'other') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    normal_range VARCHAR(200),
    unit VARCHAR(50),
    price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_test_type (test_type),
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Seed Ethiopian MOH Standard Lab Tests
INSERT INTO ethiopian_moh_lab_tests (test_name, test_code, test_type, category, description, normal_range, unit, price) VALUES
-- Hematology
('Complete Blood Count (CBC)', 'CBC', 'blood', 'Hematology', 'Full blood count including RBC, WBC, platelets, hemoglobin', 'Varies by component', 'cells/μL', 150.00),
('Hemoglobin', 'HGB', 'blood', 'Hematology', 'Hemoglobin level measurement', 'M: 13.5-17.5, F: 12.0-15.5', 'g/dL', 50.00),
('Hematocrit', 'HCT', 'blood', 'Hematology', 'Percentage of red blood cells in blood', 'M: 38.8-50.0, F: 34.9-44.5', '%', 50.00),
('White Blood Cell Count', 'WBC', 'blood', 'Hematology', 'Total white blood cell count', '4,500-11,000', 'cells/μL', 50.00),
('Platelet Count', 'PLT', 'blood', 'Hematology', 'Platelet count', '150,000-400,000', 'cells/μL', 50.00),
('Erythrocyte Sedimentation Rate (ESR)', 'ESR', 'blood', 'Hematology', 'Rate at which RBCs settle', 'M: 0-15, F: 0-20', 'mm/hr', 75.00),
('Blood Film', 'BF', 'blood', 'Hematology', 'Microscopic examination of blood cells', 'Normal morphology', '', 100.00),

-- Clinical Chemistry
('Fasting Blood Sugar (FBS)', 'FBS', 'blood', 'Clinical Chemistry', 'Glucose level after fasting', '70-100', 'mg/dL', 80.00),
('Random Blood Sugar (RBS)', 'RBS', 'blood', 'Clinical Chemistry', 'Glucose level without fasting', '<140', 'mg/dL', 70.00),
('HbA1c', 'HBA1C', 'blood', 'Clinical Chemistry', 'Glycated hemoglobin - 3 month average', '<5.7%', '%', 200.00),
('Lipid Profile', 'LIPID', 'blood', 'Clinical Chemistry', 'Cholesterol, triglycerides, HDL, LDL', 'Varies by component', 'mg/dL', 250.00),
('Total Cholesterol', 'CHOL', 'blood', 'Clinical Chemistry', 'Total cholesterol level', '<200', 'mg/dL', 100.00),
('Triglycerides', 'TRIG', 'blood', 'Clinical Chemistry', 'Triglyceride level', '<150', 'mg/dL', 100.00),
('HDL Cholesterol', 'HDL', 'blood', 'Clinical Chemistry', 'High-density lipoprotein', 'M: >40, F: >50', 'mg/dL', 100.00),
('LDL Cholesterol', 'LDL', 'blood', 'Clinical Chemistry', 'Low-density lipoprotein', '<100', 'mg/dL', 100.00),

-- Liver Function Tests
('Liver Function Test (LFT)', 'LFT', 'blood', 'Clinical Chemistry', 'Complete liver function panel', 'Varies by component', '', 300.00),
('ALT (SGPT)', 'ALT', 'blood', 'Clinical Chemistry', 'Alanine aminotransferase', '7-56', 'U/L', 100.00),
('AST (SGOT)', 'AST', 'blood', 'Clinical Chemistry', 'Aspartate aminotransferase', '10-40', 'U/L', 100.00),
('Alkaline Phosphatase (ALP)', 'ALP', 'blood', 'Clinical Chemistry', 'Alkaline phosphatase level', '44-147', 'U/L', 100.00),
('Total Bilirubin', 'TBIL', 'blood', 'Clinical Chemistry', 'Total bilirubin level', '0.1-1.2', 'mg/dL', 80.00),
('Direct Bilirubin', 'DBIL', 'blood', 'Clinical Chemistry', 'Direct bilirubin level', '0-0.3', 'mg/dL', 80.00),
('Total Protein', 'TP', 'blood', 'Clinical Chemistry', 'Total protein in blood', '6.0-8.3', 'g/dL', 80.00),
('Albumin', 'ALB', 'blood', 'Clinical Chemistry', 'Albumin level', '3.5-5.5', 'g/dL', 80.00),

-- Kidney Function Tests
('Renal Function Test (RFT)', 'RFT', 'blood', 'Clinical Chemistry', 'Complete kidney function panel', 'Varies by component', '', 300.00),
('Blood Urea Nitrogen (BUN)', 'BUN', 'blood', 'Clinical Chemistry', 'Urea nitrogen in blood', '7-20', 'mg/dL', 80.00),
('Creatinine', 'CREAT', 'blood', 'Clinical Chemistry', 'Creatinine level', 'M: 0.7-1.3, F: 0.6-1.1', 'mg/dL', 80.00),
('Uric Acid', 'UA', 'blood', 'Clinical Chemistry', 'Uric acid level', 'M: 3.5-7.2, F: 2.6-6.0', 'mg/dL', 80.00),
('Electrolytes', 'ELEC', 'blood', 'Clinical Chemistry', 'Sodium, potassium, chloride', 'Varies by component', 'mEq/L', 200.00),

-- Urinalysis
('Urinalysis Complete', 'URINE', 'urine', 'Clinical Chemistry', 'Complete urine examination', 'Normal', '', 100.00),
('Urine Protein', 'UPROT', 'urine', 'Clinical Chemistry', 'Protein in urine', 'Negative', '', 50.00),
('Urine Glucose', 'UGLUC', 'urine', 'Clinical Chemistry', 'Glucose in urine', 'Negative', '', 50.00),
('Urine Microscopy', 'UMIC', 'urine', 'Clinical Chemistry', 'Microscopic examination of urine', 'Normal', '', 80.00),

-- Serology/Immunology
('HIV Rapid Test', 'HIV', 'blood', 'Serology', 'HIV antibody screening', 'Non-reactive', '', 150.00),
('Hepatitis B Surface Antigen (HBsAg)', 'HBSAG', 'blood', 'Serology', 'Hepatitis B screening', 'Non-reactive', '', 200.00),
('Hepatitis C Antibody', 'HCV', 'blood', 'Serology', 'Hepatitis C screening', 'Non-reactive', '', 200.00),
('VDRL/RPR', 'VDRL', 'blood', 'Serology', 'Syphilis screening', 'Non-reactive', '', 150.00),
('Widal Test', 'WIDAL', 'blood', 'Serology', 'Typhoid fever screening', 'Negative', '', 150.00),
('Blood Group & Rh', 'BG', 'blood', 'Serology', 'Blood type determination', 'A/B/AB/O, Rh+/-', '', 100.00),

-- Microbiology
('Stool Examination', 'STOOL', 'other', 'Microbiology', 'Stool microscopy and culture', 'No parasites/pathogens', '', 120.00),
('Urine Culture', 'UCULTURE', 'urine', 'Microbiology', 'Urine bacterial culture', 'No growth', '', 250.00),
('Blood Culture', 'BCULTURE', 'blood', 'Microbiology', 'Blood bacterial culture', 'No growth', '', 300.00),
('Sputum AFB', 'AFB', 'other', 'Microbiology', 'Acid-fast bacilli for TB', 'Negative', '', 150.00),
('Gram Stain', 'GRAM', 'other', 'Microbiology', 'Gram staining for bacteria', 'Normal flora', '', 100.00),

-- Imaging (Reference only - actual imaging done separately)
('Chest X-Ray', 'CXR', 'imaging', 'Radiology', 'Chest radiograph', 'Normal', '', 300.00),
('Abdominal Ultrasound', 'USG-ABD', 'imaging', 'Radiology', 'Abdominal ultrasound', 'Normal', '', 500.00),
('Pelvic Ultrasound', 'USG-PEL', 'imaging', 'Radiology', 'Pelvic ultrasound', 'Normal', '', 500.00),
('Obstetric Ultrasound', 'USG-OBS', 'imaging', 'Radiology', 'Pregnancy ultrasound', 'Normal', '', 600.00),

-- Pregnancy Tests
('Pregnancy Test (Urine)', 'UPT', 'urine', 'Clinical Chemistry', 'Urine pregnancy test', 'Negative/Positive', '', 80.00),
('Beta-hCG (Blood)', 'BHCG', 'blood', 'Clinical Chemistry', 'Quantitative pregnancy hormone', '<5 (non-pregnant)', 'mIU/mL', 200.00),

-- Thyroid Function
('Thyroid Function Test (TFT)', 'TFT', 'blood', 'Clinical Chemistry', 'Complete thyroid panel', 'Varies by component', '', 400.00),
('TSH', 'TSH', 'blood', 'Clinical Chemistry', 'Thyroid stimulating hormone', '0.4-4.0', 'μIU/mL', 200.00),
('Free T3', 'FT3', 'blood', 'Clinical Chemistry', 'Free triiodothyronine', '2.3-4.2', 'pg/mL', 200.00),
('Free T4', 'FT4', 'blood', 'Clinical Chemistry', 'Free thyroxine', '0.8-1.8', 'ng/dL', 200.00),

-- Cardiac Markers
('Troponin I', 'TROP', 'blood', 'Clinical Chemistry', 'Cardiac troponin for heart attack', '<0.04', 'ng/mL', 300.00),
('CK-MB', 'CKMB', 'blood', 'Clinical Chemistry', 'Creatine kinase MB fraction', '<5', 'ng/mL', 250.00),

-- Coagulation
('Prothrombin Time (PT)', 'PT', 'blood', 'Hematology', 'Blood clotting time', '11-13.5', 'seconds', 150.00),
('INR', 'INR', 'blood', 'Hematology', 'International normalized ratio', '0.8-1.2', '', 150.00),
('Activated Partial Thromboplastin Time (APTT)', 'APTT', 'blood', 'Hematology', 'Clotting time measurement', '25-35', 'seconds', 150.00);

