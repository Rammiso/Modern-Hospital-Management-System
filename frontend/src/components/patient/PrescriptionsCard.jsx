import React from "react";
import { motion } from "framer-motion";

const PrescriptionsCard = ({ prescriptions }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-300",
          icon: "✓",
          glow: "shadow-green-500/20",
        };
      case "COMPLETED":
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-300",
          icon: "✓",
          glow: "shadow-gray-500/20",
        };
      case "EXPIRED":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-300",
          icon: "⚠",
          glow: "shadow-red-500/20",
        };
      default:
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-300",
          icon: "•",
          glow: "shadow-blue-500/20",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-teal-500/20 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/10 to-green-500/10 border-b border-teal-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Prescriptions History
            </h2>
            <p className="text-sm text-teal-300/70">
              {prescriptions.filter((p) => p.status === "ACTIVE").length} active
              prescriptions
            </p>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💊</div>
            <p className="text-teal-300/60">No prescriptions recorded</p>
          </div>
        ) : (
          prescriptions.map((prescription, index) => {
            const statusConfig = getStatusConfig(prescription.status);

            return (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`backdrop-blur-sm bg-white/5 rounded-xl border border-teal-500/20 
                         hover:border-teal-500/40 transition-all duration-300 p-4
                         ${
                           prescription.status === "ACTIVE"
                             ? "shadow-lg shadow-teal-500/10"
                             : ""
                         }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-teal-400">
                        {prescription.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                  ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border shadow-lg ${statusConfig.glow}`}
                      >
                        <span>{statusConfig.icon}</span>
                        {prescription.status}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {prescription.medicine}
                    </h3>
                  </div>
                </div>

                {/* Prescription Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-teal-300/50 mb-1">Dosage</p>
                    <p className="text-sm text-white font-medium">
                      {prescription.dosage}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-300/50 mb-1">Frequency</p>
                    <p className="text-sm text-white font-medium">
                      {prescription.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-300/50 mb-1">Duration</p>
                    <p className="text-sm text-white font-medium">
                      {prescription.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-300/50 mb-1">
                      Refills Remaining
                    </p>
                    <p className="text-sm text-white font-medium">
                      {prescription.refillsRemaining}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-teal-500/10 flex items-center justify-between text-xs text-teal-300/60">
                  <span>Prescribed by {prescription.prescribedBy}</span>
                  <span>{formatDate(prescription.prescribedDate)}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default PrescriptionsCard;
