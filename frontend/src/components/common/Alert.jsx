import React from "react";

const Alert = ({
  children,
  message,
  type = "info",
  title,
  onClose,
  className = "",
  icon,
}) => {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const types = {
    success: "bg-green-50 text-green-700 border-green-500",
    error: "bg-red-50 text-red-700 border-red-500",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-500",
    info: "bg-blue-50 text-blue-700 border-blue-500",
  };

  return (
    <div
      className={`px-6 py-4 rounded-lg border-l-4 flex items-start gap-3 ${types[type]} ${className} animate-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <span className="text-xl flex-shrink-0">{icon || icons[type]}</span>
      <div className="flex-1">
        {title && <div className="font-bold mb-1">{title}</div>}
        <div className="text-sm">{message || children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label="Close"
        >
          <span className="text-lg">✕</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
