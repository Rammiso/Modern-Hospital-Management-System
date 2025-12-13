-- Check lab requests with patient information
SELECT 
    lr.id as lab_request_id,
    lr.test_name,
    lr.test_type,
    lr.status,
    lr.consultation_id,
    c.patient_id,
    p.full_name as patient_name,
    p.id as patient_table_id
FROM lab_requests lr
LEFT JOIN consultations c ON lr.consultation_id = c.id
LEFT JOIN patients p ON c.patient_id = p.id
LIMIT 5;

-- Check if consultations have patient_id
SELECT 
    id,
    patient_id,
    doctor_id,
    status
FROM consultations
LIMIT 5;

-- Check patients table
SELECT 
    id,
    full_name,
    phone
FROM patients
LIMIT 5;
