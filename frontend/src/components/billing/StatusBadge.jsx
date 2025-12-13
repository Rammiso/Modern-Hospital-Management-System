import React from "react";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "UNPAID":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-300",
          glow: "shadow-red-500/20",
          icon: "⚠️",
        };
      case "PARTIAL":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-300",
          glow: "shadow-blue-500/20",
          icon: "⏳",
        };
      case "PAID":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-300",
          glow: "shadow-green-500/20",
          icon: "✓",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-300",
          glow: "shadow-gray-500/20",
          icon: "•",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  ${config.bg} ${config.border} ${config.text} border backdrop-blur-sm
                  shadow-lg ${config.glow} transition-all duration-300`}
    >
      <span className="text-sm">{config.icon}</span>
      {status}
    </motion.span>
  );
};

export default StatusBadge;
