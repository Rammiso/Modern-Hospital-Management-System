import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = "",
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
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-cyan-500 focus:ring-cyan-100"
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
