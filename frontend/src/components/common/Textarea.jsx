import React from "react";

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  rows = 4,
  maxLength,
  disabled = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 resize-y ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-cyan-500 focus:ring-cyan-100"
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
      <div className="flex justify-between items-center mt-1">
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}
        {maxLength && (
          <span className="text-sm text-gray-500 ml-auto">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default Textarea;
