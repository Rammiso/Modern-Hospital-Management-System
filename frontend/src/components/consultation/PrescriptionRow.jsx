import React from "react";
import Input from "../common/Input";

const PrescriptionRow = React.memo(({
  prescription,
  index,
  onChange,
  onRemove,
  errors = {},
  showRemove = true,
  disabled = false,
}) => {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    onChange(index, name, value);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out ${disabled ? 'opacity-60' : 'hover:border-cyan-300'}`}>
      {/* Drug Name */}
      <Input
        label="Medicine Name"
        name="drug_name"
        value={prescription.drug_name || ""}
        onChange={handleFieldChange}
        placeholder="e.g., Paracetamol"
        required
        disabled={disabled}
        error={errors[`prescriptions.${index}.drug_name`]}
        className="mb-0"
      />

      {/* Dosage */}
      <Input
        label="Dosage"
        name="dosage"
        value={prescription.dosage || ""}
        onChange={handleFieldChange}
        placeholder="e.g., 500mg"
        required
        disabled={disabled}
        error={errors[`prescriptions.${index}.dosage`]}
        className="mb-0"
      />

      {/* Frequency */}
      <Input
        label="Frequency"
        name="frequency"
        value={prescription.frequency || ""}
        onChange={handleFieldChange}
        placeholder="e.g., 3x daily"
        required
        disabled={disabled}
        error={errors[`prescriptions.${index}.frequency`]}
        className="mb-0"
      />

      {/* Duration */}
      <Input
        label="Duration"
        name="duration"
        value={prescription.duration || ""}
        onChange={handleFieldChange}
        placeholder="e.g., 5 days"
        required
        disabled={disabled}
        error={errors[`prescriptions.${index}.duration`]}
        className="mb-0"
      />

      {/* Instructions (Optional) */}
      <div className="relative">
        <Input
          label="Instructions"
          name="instructions"
          value={prescription.instructions || ""}
          onChange={handleFieldChange}
          placeholder="e.g., After meals"
          disabled={disabled}
          error={errors[`prescriptions.${index}.instructions`]}
          className="mb-0"
        />

        {/* Remove Button */}
        {showRemove && !disabled && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            aria-label="Remove prescription"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

PrescriptionRow.displayName = 'PrescriptionRow';

export default PrescriptionRow;
