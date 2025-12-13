import React, { useMemo } from "react";
import VitalInput from "./VitalInput";
import { calculateBMI } from "../../utils/consultationHelpers";
import {
  validateBloodPressure,
  validatePulseRate,
  validateTemperature,
  validateSpO2,
  validateHeight,
  validateWeight,
} from "../../utils/validators";

const VitalsCard = ({ vitals, onChange, errors = {} }) => {
  // Calculate BMI in real-time using useMemo for performance
  const bmi = useMemo(() => {
    const calculatedBMI = calculateBMI(vitals.weight, vitals.height);
    return calculatedBMI !== null ? calculatedBMI.toFixed(2) : "--";
  }, [vitals.weight, vitals.height]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // Handle onBlur validation for each vital sign
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case "blood_pressure_systolic":
      case "blood_pressure_diastolic":
        error = validateBloodPressure(
          vitals.blood_pressure_systolic,
          vitals.blood_pressure_diastolic
        );
        break;
      case "heart_rate":
        error = validatePulseRate(value);
        break;
      case "temperature":
        error = validateTemperature(value);
        break;
      case "spo2":
        error = validateSpO2(value);
        break;
      case "height":
        error = validateHeight(value);
        break;
      case "weight":
        error = validateWeight(value);
        break;
      default:
        break;
    }

    // Trigger error update through parent component if needed
    if (error && onChange.onError) {
      onChange.onError(name, error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vital Signs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Blood Pressure - Systolic */}
        <VitalInput
          label="Systolic BP"
          name="blood_pressure_systolic"
          value={vitals.blood_pressure_systolic || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="mmHg"
          error={errors.blood_pressure_systolic}
          required
          type="number"
          step="1"
        />

        {/* Blood Pressure - Diastolic */}
        <VitalInput
          label="Diastolic BP"
          name="blood_pressure_diastolic"
          value={vitals.blood_pressure_diastolic || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="mmHg"
          error={errors.blood_pressure_diastolic}
          required
          type="number"
          step="1"
        />

        {/* Heart Rate (Pulse Rate) */}
        <VitalInput
          label="Heart Rate"
          name="heart_rate"
          value={vitals.heart_rate || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="bpm"
          error={errors.heart_rate}
          required
          type="number"
          step="1"
        />

        {/* Temperature */}
        <VitalInput
          label="Temperature"
          name="temperature"
          value={vitals.temperature || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="°C"
          error={errors.temperature}
          required
          type="number"
          step="0.1"
        />

        {/* Height */}
        <VitalInput
          label="Height"
          name="height"
          value={vitals.height || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="cm"
          error={errors.height}
          required
          type="number"
          step="0.1"
        />

        {/* Weight */}
        <VitalInput
          label="Weight"
          name="weight"
          value={vitals.weight || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="kg"
          error={errors.weight}
          required
          type="number"
          step="0.1"
        />

        {/* SpO2 */}
        <VitalInput
          label="SpO2"
          name="spo2"
          value={vitals.spo2 || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          unit="%"
          error={errors.spo2}
          required
          type="number"
          step="1"
        />

        {/* BMI Display (Calculated, Read-only) */}
        <div className="relative mb-4">
          <div className="relative">
            <input
              id="bmi"
              name="bmi"
              type="text"
              value={bmi}
              readOnly
              disabled
              className="w-full px-4 py-2.5 pr-16 border-2 rounded-lg transition-all duration-300 ease-in-out bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700 font-medium"
            />

            {/* Label */}
            <label
              htmlFor="bmi"
              className="absolute left-4 top-1 text-xs text-gray-500 pointer-events-none"
            >
              BMI (Calculated)
            </label>

            {/* Unit Display */}
            <span className="absolute right-4 top-3 text-sm text-gray-500 font-medium">
              kg/m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsCard;
