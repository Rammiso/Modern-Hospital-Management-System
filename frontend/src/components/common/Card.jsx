import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all ${
        hoverable ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
          {title && (
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
