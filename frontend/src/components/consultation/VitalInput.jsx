import React from "react";

const VitalInput = ({
  label,
  name,
  value,
  onChange,
  unit,
  error,
  required = false,
  type = "number",
  step = "0.1",
  disabled = false,
  placeholder = "",
}) => {
  return (
    <div className="relative mb-4">
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || " "}
          required={required}
          disabled={disabled}
          step={step}
          className={`w-full px-4 py-2.5 pr-16 border-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 peer ${
            error
              ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-cyan-500 focus:ring-cyan-100"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        
        {/* Floating Label */}
        <label
          htmlFor={name}
          className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none ${
            error ? "text-red-500" : "text-gray-500 peer-focus:text-cyan-500"
          } ${
            value || placeholder
              ? "top-1 text-xs"
              : "top-3 text-base peer-focus:top-1 peer-focus:text-xs"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Unit Display */}
        {unit && (
          <span className="absolute right-4 top-3 text-sm text-gray-500 font-medium">
            {unit}
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 transition-all duration-300 ease-in-out">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default VitalInput;
