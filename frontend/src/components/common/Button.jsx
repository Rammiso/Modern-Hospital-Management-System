import React from "react";

const Button = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-md",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
