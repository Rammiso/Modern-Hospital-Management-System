/**
 * Tests for Consultation Helper Utilities
 */

import { describe, it, expect } from 'vitest';
import { validateConsultationForm, calculateBMI } from './consultationHelpers';

describe('validateConsultationForm', () => {
  it('should return errors when required fields are missing', () => {
    const formData = {
      symptoms: '',
      diagnosis: '',
      vitals: {},
      prescriptions: [],
    };

    const result = validateConsultationForm(formData);

    expect(result.isValid).toBe(false);
    expect(result.errors.symptoms).toBeDefined();
    expect(result.errors.diagnosis).toBeDefined();
    expect(result.errors.prescriptions).toBeDefined();
  });

  it('should return errors when vital signs are invalid', () => {
    const formData = {
      symptoms: 'Fever and headache',
      diagnosis: 'Viral infection',
      vitals: {
        blood_pressure_systolic: 300, // Invalid - too high
        blood_pressure_diastolic: 80,
        heart_rate: 250, // Invalid - too high
        temperature: 50, // Invalid - too high
        spo2: 150, // Invalid - too high
        height: 500, // Invalid - too high
        weight: 600, // Invalid - too high
      },
      prescriptions: [{ drug_name: 'Paracetamol', dosage: '500mg' }],
    };

    const result = validateConsultationForm(formData);

    expect(result.isValid).toBe(false);
    expect(result.errors.blood_pressure_systolic).toBeDefined();
    expect(result.errors.heart_rate).toBeDefined();
    expect(result.errors.temperature).toBeDefined();
    expect(result.errors.spo2).toBeDefined();
    expect(result.errors.height).toBeDefined();
    expect(result.errors.weight).toBeDefined();
  });

  it('should return errors when prescriptions are incomplete', () => {
    const formData = {
      symptoms: 'Fever',
      diagnosis: 'Viral infection',
      vitals: {
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 75,
        temperature: 37.5,
        spo2: 98,
        height: 170,
        weight: 70,
      },
      prescriptions: [
        { drug_name: '', dosage: '' }, // Empty prescription
      ],
    };

    const result = validateConsultationForm(formData);

    expect(result.isValid).toBe(false);
    expect(result.errors.prescriptions).toBeDefined();
  });

  it('should pass validation with valid data', () => {
    const formData = {
      symptoms: 'Fever and headache',
      diagnosis: 'Viral infection',
      vitals: {
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 75,
        temperature: 37.5,
        spo2: 98,
        height: 170,
        weight: 70,
      },
      prescriptions: [
        { drug_name: 'Paracetamol', dosage: '500mg', frequency: 'TID', duration: '5 days' },
      ],
    };

    const result = validateConsultationForm(formData);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should validate blood pressure ranges correctly', () => {
    const formData = {
      symptoms: 'Chest pain',
      diagnosis: 'Hypertension',
      vitals: {
        blood_pressure_systolic: 50, // Minimum valid
        blood_pressure_diastolic: 30, // Minimum valid
        heart_rate: 75,
        temperature: 37.0,
        spo2: 98,
        height: 170,
        weight: 70,
      },
      prescriptions: [{ drug_name: 'Medication', dosage: '10mg' }],
    };

    const result = validateConsultationForm(formData);
    expect(result.isValid).toBe(true);

    // Test maximum valid values
    formData.vitals.blood_pressure_systolic = 250;
    formData.vitals.blood_pressure_diastolic = 150;
    const result2 = validateConsultationForm(formData);
    expect(result2.isValid).toBe(true);

    // Test invalid values
    formData.vitals.blood_pressure_systolic = 251;
    const result3 = validateConsultationForm(formData);
    expect(result3.isValid).toBe(false);
  });

  it('should validate heart rate ranges correctly', () => {
    const formData = {
      symptoms: 'Palpitations',
      diagnosis: 'Tachycardia',
      vitals: {
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 30, // Minimum valid
        temperature: 37.0,
        spo2: 98,
        height: 170,
        weight: 70,
      },
      prescriptions: [{ drug_name: 'Medication', dosage: '10mg' }],
    };

    const result = validateConsultationForm(formData);
    expect(result.isValid).toBe(true);

    // Test maximum valid
    formData.vitals.heart_rate = 220;
    const result2 = validateConsultationForm(formData);
    expect(result2.isValid).toBe(true);

    // Test invalid
    formData.vitals.heart_rate = 221;
    const result3 = validateConsultationForm(formData);
    expect(result3.isValid).toBe(false);
  });

  it('should validate temperature ranges correctly', () => {
    const formData = {
      symptoms: 'Fever',
      diagnosis: 'Infection',
      vitals: {
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 75,
        temperature: 35.0, // Minimum valid
        spo2: 98,
        height: 170,
        weight: 70,
      },
      prescriptions: [{ drug_name: 'Medication', dosage: '10mg' }],
    };

    const result = validateConsultationForm(formData);
    expect(result.isValid).toBe(true);

    // Test maximum valid
    formData.vitals.temperature = 42.0;
    const result2 = validateConsultationForm(formData);
    expect(result2.isValid).toBe(true);

    // Test invalid
    formData.vitals.temperature = 42.1;
    const result3 = validateConsultationForm(formData);
    expect(result3.isValid).toBe(false);
  });

  it('should validate SpO2 ranges correctly', () => {
    const formData = {
      symptoms: 'Shortness of breath',
      diagnosis: 'Hypoxia',
      vitals: {
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 75,
        temperature: 37.0,
        spo2: 70, // Minimum valid
        height: 170,
        weight: 70,
      },
      prescriptions: [{ drug_name: 'Medication', dosage: '10mg' }],
    };

    const result = validateConsultationForm(formData);
    expect(result.isValid).toBe(true);

    // Test maximum valid
    formData.vitals.spo2 = 100;
    const result2 = validateConsultationForm(formData);
    expect(result2.isValid).toBe(true);

    // Test invalid
    formData.vitals.spo2 = 101;
    const result3 = validateConsultationForm(formData);
    expect(result3.isValid).toBe(false);
  });
});

describe('calculateBMI', () => {
  it('should calculate BMI correctly', () => {
    const bmi = calculateBMI(70, 170);
    expect(bmi).toBe(24.22);
  });

  it('should return null for invalid inputs', () => {
    expect(calculateBMI(0, 170)).toBeNull();
    expect(calculateBMI(70, 0)).toBeNull();
    expect(calculateBMI(null, 170)).toBeNull();
    expect(calculateBMI(70, null)).toBeNull();
  });
});
