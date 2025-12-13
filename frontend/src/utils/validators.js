/**
 * Form Validation Utilities for MHMS
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

// Phone validation (Ethiopian format)
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+251|0)?[79]\d{8}$/;
  if (!phone) return "Phone number is required";
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "Invalid phone number format";
  }
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
};

// Minimum length validation
export const validateMinLength = (
  value,
  minLength,
  fieldName = "This field"
) => {
  if (!value) return null;
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

// Maximum length validation
export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field"
) => {
  if (!value) return null;
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[a-zA-Z]/.test(password))
    return "Password must contain at least one letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  return null;
};

// Confirm password validation
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

// Date validation
export const validateDate = (date, fieldName = "Date") => {
  if (!date) return `${fieldName} is required`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
  return null;
};

// Future date validation
export const validateFutureDate = (date, fieldName = "Date") => {
  const error = validateDate(date, fieldName);
  if (error) return error;

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return `${fieldName} must be in the future`;
  }
  return null;
};

// Past date validation
export const validatePastDate = (date, fieldName = "Date") => {
  const error = validateDate(date, fieldName);
  if (error) return error;

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj > today) {
    return `${fieldName} must be in the past`;
  }
  return null;
};

// Age validation (date of birth)
export const validateAge = (dateOfBirth, minAge = 0, maxAge = 150) => {
  const error = validatePastDate(dateOfBirth, "Date of birth");
  if (error) return error;

  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < minAge) return `Age must be at least ${minAge} years`;
  if (age > maxAge) return `Age must not exceed ${maxAge} years`;
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = "This field") => {
  if (!value && value !== 0) return `${fieldName} is required`;
  if (isNaN(value)) return `${fieldName} must be a number`;
  return null;
};

// Positive number validation
export const validatePositiveNumber = (value, fieldName = "This field") => {
  const error = validateNumber(value, fieldName);
  if (error) return error;
  if (Number(value) <= 0) return `${fieldName} must be a positive number`;
  return null;
};

// Range validation
export const validateRange = (value, min, max, fieldName = "This field") => {
  const error = validateNumber(value, fieldName);
  if (error) return error;

  const num = Number(value);
  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

// Blood Pressure validation
export const validateBloodPressure = (systolic, diastolic) => {
  if (!systolic || !diastolic) return "Blood pressure is required";

  const systolicNum = Number(systolic);
  const diastolicNum = Number(diastolic);

  if (isNaN(systolicNum) || isNaN(diastolicNum)) {
    return "Blood pressure must be numeric";
  }

  if (systolicNum < 50 || systolicNum > 250) {
    return "Systolic pressure must be between 50-250 mmHg";
  }

  if (diastolicNum < 30 || diastolicNum > 150) {
    return "Diastolic pressure must be between 30-150 mmHg";
  }

  if (systolicNum <= diastolicNum) {
    return "Systolic must be greater than diastolic";
  }

  return null;
};

// Temperature validation (Celsius)
export const validateTemperature = (temp) => {
  const error = validateNumber(temp, "Temperature");
  if (error) return error;

  const tempNum = Number(temp);
  if (tempNum < 35 || tempNum > 42) {
    return "Temperature must be between 35-42°C";
  }
  return null;
};

// Pulse rate validation
export const validatePulseRate = (pulse) => {
  const error = validateNumber(pulse, "Pulse rate");
  if (error) return error;

  const pulseNum = Number(pulse);
  if (pulseNum < 30 || pulseNum > 220) {
    return "Pulse rate must be between 30-220 bpm";
  }
  return null;
};

// Weight validation (kg)
export const validateWeight = (weight) => {
  const error = validatePositiveNumber(weight, "Weight");
  if (error) return error;

  const weightNum = Number(weight);
  if (weightNum < 0.5 || weightNum > 500) {
    return "Weight must be between 0.5-500 kg";
  }
  return null;
};

// Height validation (cm)
export const validateHeight = (height) => {
  const error = validatePositiveNumber(height, "Height");
  if (error) return error;

  const heightNum = Number(height);
  if (heightNum < 30 || heightNum > 300) {
    return "Height must be between 30-300 cm";
  }
  return null;
};

// SpO2 validation (%)
export const validateSpO2 = (spo2) => {
  const error = validateNumber(spo2, "SpO2");
  if (error) return error;

  const spo2Num = Number(spo2);
  if (spo2Num < 70 || spo2Num > 100) {
    return "SpO2 must be between 70-100%";
  }
  return null;
};

// Generic form validator
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePassword,
  validatePasswordMatch,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateAge,
  validateNumber,
  validatePositiveNumber,
  validateRange,
  validateBloodPressure,
  validateTemperature,
  validatePulseRate,
  validateWeight,
  validateHeight,
  validateSpO2,
  validateForm,
};
