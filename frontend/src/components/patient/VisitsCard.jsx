import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VisitsCard = ({ visits, onViewConsultation }) => {
  const [expandedVisit, setExpandedVisit] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-300",
          icon: "✓",
        };
      case "SCHEDULED":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-300",
          icon: "📅",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-300",
          icon: "✕",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-300",
          icon: "•",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-blue-500/20 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-blue-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Visits History</h2>
            <p className="text-sm text-blue-300/70">
              {visits.length} total visits
            </p>
          </div>
        </div>
      </div>

      {/* Visits List */}
      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
        {visits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-blue-300/60">No visits recorded</p>
          </div>
        ) : (
          visits.map((visit, index) => {
            const statusConfig = getStatusConfig(visit.status);
            const isExpanded = expandedVisit === visit.id;

            return (
              <motion.div
                key={visit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 
                         hover:border-blue-500/40 transition-all duration-300 overflow-hidden"
              >
                {/* Visit Summary */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-blue-400">
                          {visit.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                    ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}
                        >
                          <span>{statusConfig.icon}</span>
                          {visit.status}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-1">
                        {visit.doctor}
                      </p>
                      <p className="text-sm text-blue-300/70">
                        {visit.department}
                      </p>
                      <p className="text-xs text-blue-300/50 mt-1">
                        {formatDate(visit.date)}
                      </p>
                    </div>

                    <button
                      onClick={() => onViewConsultation(visit)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 
                               hover:from-blue-500/30 hover:to-cyan-500/30 
                               border border-blue-500/30 hover:border-blue-400/50
                               text-blue-300 hover:text-blue-200 text-sm font-medium rounded-lg
                               transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20
                               whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Quick Info */}
                  {visit.diagnosis && (
                    <div className="mt-3 pt-3 border-t border-blue-500/10">
                      <p className="text-xs text-blue-300/50 mb-1">Diagnosis</p>
                      <p className="text-sm text-white">{visit.diagnosis}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default VisitsCard;
