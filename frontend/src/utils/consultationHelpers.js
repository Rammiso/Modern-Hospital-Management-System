/**
 * Consultation Helper Utilities for MHMS
 */

import {
  validateRequired,
  validateBloodPressure,
  validatePulseRate,
  validateTemperature,
  validateSpO2,
  validateHeight,
  validateWeight,
} from './validators';

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / (height (m))²
 * @param {number} weight - Weight in kilograms
 * @param {number} height - Height in centimeters
 * @returns {number|null} - BMI rounded to 2 decimal places, or null if invalid inputs
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }

  const weightNum = Number(weight);
  const heightNum = Number(height);

  if (isNaN(weightNum) || isNaN(heightNum)) {
    return null;
  }

  // Convert height from cm to meters
  const heightInMeters = heightNum / 100;

  // Calculate BMI: weight / height²
  const bmi = weightNum / (heightInMeters * heightInMeters);

  // Round to 2 decimal places
  return Math.round(bmi * 100) / 100;
};

/**
 * Transform consultation form data to backend API payload
 * @param {Object} formData - Form data from ConsultationForm component
 * @returns {Object} - Structured payload for backend API
 */
export const transformConsultationPayload = (formData) => {
  const {
    appointment,
    patient,
    vitals,
    symptoms,
    diagnosis,
    icdCode,
    notes,
    prescriptions,
    labRequests,
    doctorId,
  } = formData;

  // Calculate BMI if not already calculated
  const bmi = vitals.bmi || calculateBMI(vitals.weight, vitals.height);

  return {
    // IDs
    appointment_id: appointment?.id || formData.appointmentId,
    patient_id: patient?.id || formData.patientId,
    doctor_id: doctorId,

    // Vitals
    blood_pressure_systolic: Number(vitals.blood_pressure_systolic),
    blood_pressure_diastolic: Number(vitals.blood_pressure_diastolic),
    temperature: Number(vitals.temperature),
    pulse_rate: Number(vitals.heart_rate || vitals.pulse_rate),
    respiratory_rate: vitals.respiratory_rate
      ? Number(vitals.respiratory_rate)
      : undefined,
    weight: Number(vitals.weight),
    height: Number(vitals.height),
    bmi: bmi,
    spo2: Number(vitals.spo2),

    // Clinical Notes
    symptoms: symptoms,
    diagnosis: diagnosis,
    icd_code: icdCode || undefined,
    notes: notes || undefined,
    follow_up_date: formData.followUpDate || undefined,
    follow_up_notes: formData.followUpNotes || undefined,

    // Related Data
    prescriptions: prescriptions
      .filter((p) => p.drug_name && p.dosage) // Only include prescriptions with required fields
      .map((p) => ({
        drug_name: p.drug_name,
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration,
        instructions: p.instructions || undefined,
      })),

    lab_requests: labRequests
      .filter((lr) => lr.test_name) // Only include lab requests with test name
      .map((lr) => ({
        test_name: lr.test_name,
        test_type: lr.test_type,
        instructions: lr.instructions || undefined,
      })),
  };
};

/**
 * Validate consultation form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Object with isValid boolean and errors object
 */
export const validateConsultationForm = (formData) => {
  const errors = {};

  // Validate required fields - symptoms and diagnosis
  const symptomsError = validateRequired(formData.symptoms, "Symptoms");
  if (symptomsError) {
    errors.symptoms = symptomsError;
  }

  const diagnosisError = validateRequired(formData.diagnosis, "Diagnosis");
  if (diagnosisError) {
    errors.diagnosis = diagnosisError;
  }

  // Validate vital signs
  const vitals = formData.vitals || {};

  // Blood Pressure validation
  const bpError = validateBloodPressure(
    vitals.blood_pressure_systolic,
    vitals.blood_pressure_diastolic
  );
  if (bpError) {
    // Set error on both systolic and diastolic fields for better UX
    errors.blood_pressure_systolic = bpError;
    errors.blood_pressure_diastolic = bpError;
  }

  // Heart Rate (Pulse Rate) validation
  const heartRateError = validatePulseRate(vitals.heart_rate);
  if (heartRateError) {
    errors.heart_rate = heartRateError;
  }

  // Temperature validation
  const temperatureError = validateTemperature(vitals.temperature);
  if (temperatureError) {
    errors.temperature = temperatureError;
  }

  // SpO2 validation
  const spo2Error = validateSpO2(vitals.spo2);
  if (spo2Error) {
    errors.spo2 = spo2Error;
  }

  // Height validation
  const heightError = validateHeight(vitals.height);
  if (heightError) {
    errors.height = heightError;
  }

  // Weight validation
  const weightError = validateWeight(vitals.weight);
  if (weightError) {
    errors.weight = weightError;
  }

  // Validate prescriptions - at least one with drug_name and dosage
  if (!formData.prescriptions || formData.prescriptions.length === 0) {
    errors.prescriptions = "At least one prescription is required";
  } else {
    const validPrescriptions = formData.prescriptions.filter(
      (p) => p.drug_name && p.drug_name.trim() !== "" && p.dosage && p.dosage.trim() !== ""
    );

    if (validPrescriptions.length === 0) {
      errors.prescriptions =
        "At least one prescription with drug name and dosage is required";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  calculateBMI,
  transformConsultationPayload,
  validateConsultationForm,
};
