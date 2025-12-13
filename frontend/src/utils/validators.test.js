/**
 * Property-Based Tests for Vital Signs Validation
 * Feature: doctor-consultation-ui
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateBloodPressure,
  validatePulseRate,
  validateTemperature,
  validateSpO2,
} from './validators';

describe('Vital Signs Validation - Property-Based Tests', () => {
  /**
   * Property 2: Vital Signs Validation - Blood Pressure
   * For any blood pressure input, the validation function should accept systolic values 
   * between 50-250 mmHg and diastolic values between 30-150 mmHg, and reject all values 
   * outside these ranges.
   * Validates: Requirements 2.2
   */
  describe('Property 2: Blood Pressure Validation', () => {
    it('should accept valid blood pressure values within range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 250 }), // systolic
          fc.integer({ min: 30, max: 150 }), // diastolic
          (systolic, diastolic) => {
            // Ensure systolic > diastolic for valid BP
            if (systolic <= diastolic) {
              return true; // Skip this case as it's invalid by medical definition
            }
            
            const result = validateBloodPressure(systolic, diastolic);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject systolic values below 50 mmHg', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 49 }), // systolic below range (exclude 0 to avoid "required" error)
          fc.integer({ min: 30, max: 150 }), // valid diastolic
          (systolic, diastolic) => {
            const result = validateBloodPressure(systolic, diastolic);
            expect(result).not.toBeNull();
            expect(result).toContain('50-250');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject systolic values above 250 mmHg', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 251, max: 500 }), // systolic above range
          fc.integer({ min: 30, max: 150 }), // valid diastolic
          (systolic, diastolic) => {
            const result = validateBloodPressure(systolic, diastolic);
            expect(result).not.toBeNull();
            expect(result).toContain('50-250');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject diastolic values below 30 mmHg', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 250 }), // valid systolic
          fc.integer({ min: 1, max: 29 }), // diastolic below range (exclude 0 to avoid "required" error)
          (systolic, diastolic) => {
            const result = validateBloodPressure(systolic, diastolic);
            expect(result).not.toBeNull();
            expect(result).toContain('30-150');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject diastolic values above 150 mmHg', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 200, max: 250 }), // valid systolic
          fc.integer({ min: 151, max: 300 }), // diastolic above range
          (systolic, diastolic) => {
            const result = validateBloodPressure(systolic, diastolic);
            expect(result).not.toBeNull();
            expect(result).toContain('30-150');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Vital Signs Validation - Heart Rate
   * For any heart rate input, the validation function should accept values between 
   * 30-220 bpm and reject all values outside this range.
   * Validates: Requirements 2.3
   */
  describe('Property 3: Heart Rate Validation', () => {
    it('should accept valid heart rate values within range (30-220 bpm)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 30, max: 220 }),
          (heartRate) => {
            const result = validatePulseRate(heartRate);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject heart rate values below 30 bpm', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -50, max: 29 }),
          (heartRate) => {
            const result = validatePulseRate(heartRate);
            expect(result).not.toBeNull();
            expect(result).toContain('30-220');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject heart rate values above 220 bpm', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 221, max: 500 }),
          (heartRate) => {
            const result = validatePulseRate(heartRate);
            expect(result).not.toBeNull();
            expect(result).toContain('30-220');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Vital Signs Validation - Temperature
   * For any temperature input, the validation function should accept values between 
   * 35.0-42.0°C and reject all values outside this range.
   * Validates: Requirements 2.4
   */
  describe('Property 4: Temperature Validation', () => {
    it('should accept valid temperature values within range (35.0-42.0°C)', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 35.0, max: 42.0, noNaN: true }),
          (temperature) => {
            const result = validateTemperature(temperature);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject temperature values below 35.0°C', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0), max: Math.fround(34.99), noNaN: true }),
          (temperature) => {
            const result = validateTemperature(temperature);
            expect(result).not.toBeNull();
            expect(result).toContain('35-42');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject temperature values above 42.0°C', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(42.01), max: Math.fround(50), noNaN: true }),
          (temperature) => {
            const result = validateTemperature(temperature);
            expect(result).not.toBeNull();
            expect(result).toContain('35-42');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Vital Signs Validation - SpO2
   * For any SpO2 input, the validation function should accept values between 
   * 70-100% and reject all values outside this range.
   * Validates: Requirements 2.5
   */
  describe('Property 5: SpO2 Validation', () => {
    it('should accept valid SpO2 values within range (70-100%)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 70, max: 100 }),
          (spo2) => {
            const result = validateSpO2(spo2);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject SpO2 values below 70%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 69 }),
          (spo2) => {
            const result = validateSpO2(spo2);
            expect(result).not.toBeNull();
            expect(result).toContain('70-100');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject SpO2 values above 100%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 101, max: 200 }),
          (spo2) => {
            const result = validateSpO2(spo2);
            expect(result).not.toBeNull();
            expect(result).toContain('70-100');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
