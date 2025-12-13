import React, { useRef, useCallback } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

const ClinicalDetailsCard = ({
  symptoms,
  diagnosis,
  icdCode,
  notes,
  onChange,
  errors = {},
  disabled = false,
}) => {
  // Debounce timers for validation
  const debounceTimers = useRef({});

  // Handle change with debounced validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Immediately update the value
    onChange(name, value);
    
    // Clear existing timer for this field
    if (debounceTimers.current[name]) {
      clearTimeout(debounceTimers.current[name]);
    }
    
    // Set new debounced validation timer (300ms delay)
    debounceTimers.current[name] = setTimeout(() => {
      // Validation logic can be added here if needed
      // For now, we just ensure the onChange is called after debounce
      // The actual validation happens on form submission
    }, 300);
  }, [onChange]);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6 ${disabled ? 'opacity-60' : ''}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Clinical Details
      </h2>

      {disabled && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Diagnosis section is disabled while waiting for lab results
        </div>
      )}

      <Textarea
        label="Symptoms / Chief Complaint"
        name="symptoms"
        value={symptoms}
        onChange={handleChange}
        placeholder="Describe the patient's symptoms or chief complaint..."
        required={true}
        rows={4}
        disabled={disabled}
        error={errors.symptoms}
      />

      <Textarea
        label="Diagnosis"
        name="diagnosis"
        value={diagnosis}
        onChange={handleChange}
        placeholder="Enter the diagnosis..."
        required={true}
        rows={3}
        disabled={disabled}
        error={errors.diagnosis}
      />

      <Input
        label="ICD Code"
        name="icdCode"
        value={icdCode}
        onChange={handleChange}
        placeholder="Enter ICD code (optional)"
        required={false}
        disabled={disabled}
        error={errors.icdCode}
      />

      <Textarea
        label="Additional Notes"
        name="notes"
        value={notes}
        onChange={handleChange}
        placeholder="Enter any additional notes or observations..."
        required={false}
        rows={3}
        disabled={disabled}
        error={errors.notes}
      />
    </div>
  );
};

export default ClinicalDetailsCard;
