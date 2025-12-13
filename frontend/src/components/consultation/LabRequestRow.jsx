import React from "react";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const LabRequestRow = React.memo(({
  labRequest,
  index,
  onChange,
  onRemove,
  availableTests = [],
  errors = {},
  disabled = false,
}) => {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    // If test_name is being changed, also set the test_type
    if (name === 'test_name' && value) {
      const selectedTest = availableTests.find(test => test.test_name === value);
      if (selectedTest) {
        onChange(index, 'test_type', selectedTest.test_type);
      }
    }
    
    onChange(index, name, value);
  };

  // Format available tests for Select component
  const testOptions = availableTests.map((test) => ({
    value: test.test_name,
    label: `${test.test_name} (${test.test_type || test.category || ""})`,
  }));

  // Urgency options
  const urgencyOptions = [
    { value: "normal", label: "Normal" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out relative ${disabled ? 'opacity-60' : 'hover:border-cyan-300'}`}>
      {/* Test Selection */}
      <Select
        label="Laboratory Test"
        name="test_name"
        value={labRequest.test_name || ""}
        onChange={handleFieldChange}
        options={testOptions}
        placeholder="Select a test"
        required
        disabled={disabled}
        error={errors[`labRequests.${index}.test_name`]}
        className="mb-0"
      />

      {/* Urgency */}
      <Select
        label="Urgency"
        name="urgency"
        value={labRequest.urgency || "normal"}
        onChange={handleFieldChange}
        options={urgencyOptions}
        disabled={disabled}
        error={errors[`labRequests.${index}.urgency`]}
        className="mb-0"
      />

      {/* Instructions */}
      <div className="relative">
        <Textarea
          label="Instructions (Optional)"
          name="instructions"
          value={labRequest.instructions || ""}
          onChange={handleFieldChange}
          placeholder="e.g., Fasting required"
          rows={3}
          disabled={disabled}
          error={errors[`labRequests.${index}.instructions`]}
          className="mb-0"
        />

        {/* Remove Button */}
        {!disabled && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            aria-label="Remove lab test"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

LabRequestRow.displayName = 'LabRequestRow';

export default LabRequestRow;
