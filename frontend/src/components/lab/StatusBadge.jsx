import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-400/50",
          text: "text-yellow-300",
          glow: "shadow-yellow-500/50",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case "PROCESSING":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-400/50",
          text: "text-blue-300",
          glow: "shadow-blue-500/50",
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
        };
      case "COMPLETED":
        return {
          bg: "bg-green-500/20",
          border: "border-green-400/50",
          text: "text-green-300",
          glow: "shadow-green-500/50",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-400/50",
          text: "text-gray-300",
          glow: "shadow-gray-500/50",
          icon: null,
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${styles.bg} ${styles.border} ${styles.text} border backdrop-blur-sm shadow-lg ${styles.glow} transition-all duration-300`}
    >
      {styles.icon}
      <span className="text-xs font-semibold uppercase tracking-wide">
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;
