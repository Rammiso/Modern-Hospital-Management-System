import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "medium",
  className = "",
  icon,
}) => {
  const variants = {
    primary: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-cyan-100 text-cyan-700",
    default: "bg-gray-100 text-gray-700",
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
