import React from "react";
import { motion } from "framer-motion";

const LabResultsCard = ({ labResults, onViewLabResult }) => {
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
      case "PENDING":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/50",
          text: "text-yellow-300",
          icon: "⏳",
          glow: "shadow-yellow-500/20",
        };
      case "PROCESSING":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-300",
          icon: "🔄",
          glow: "shadow-blue-500/20",
        };
      case "COMPLETED":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-300",
          icon: "✓",
          glow: "shadow-green-500/20",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-300",
          icon: "•",
          glow: "shadow-gray-500/20",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🔬</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Lab Results History</h2>
            <p className="text-sm text-purple-300/70">
              {labResults.filter((l) => l.status === "PENDING").length} pending
              results
            </p>
          </div>
        </div>
      </div>

      {/* Lab Results List */}
      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
        {labResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔬</div>
            <p className="text-purple-300/60">No lab results recorded</p>
          </div>
        ) : (
          labResults.map((labResult, index) => {
            const statusConfig = getStatusConfig(labResult.status);

            return (
              <motion.div
                key={labResult.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`backdrop-blur-sm bg-white/5 rounded-xl border border-purple-500/20 
                         hover:border-purple-500/40 transition-all duration-300 p-4
                         ${
                           labResult.status === "PENDING"
                             ? "shadow-lg shadow-yellow-500/10"
                             : ""
                         }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-purple-400">
                        {labResult.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                  ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border shadow-lg ${statusConfig.glow}`}
                      >
                        <span>{statusConfig.icon}</span>
                        {labResult.status}
                      </span>
                    </div>
                  </div>

                  {labResult.status === "COMPLETED" && (
                    <button
                      onClick={() => onViewLabResult(labResult)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                               hover:from-purple-500/30 hover:to-pink-500/30 
                               border border-purple-500/30 hover:border-purple-400/50
                               text-purple-300 hover:text-purple-200 text-sm font-medium rounded-lg
                               transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20
                               whitespace-nowrap"
                    >
                      View Results
                    </button>
                  )}
                </div>

                {/* Tests List */}
                <div className="space-y-2 mb-3">
                  {labResult.tests.map((test, testIndex) => (
                    <div
                      key={testIndex}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <span className="text-sm text-white">{test.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          test.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-300"
                            : test.status === "PROCESSING"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {test.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-purple-500/10 space-y-1 text-xs text-purple-300/60">
                  <div className="flex items-center justify-between">
                    <span>Ordered by {labResult.orderedBy}</span>
                    <span>Requested: {formatDate(labResult.requestDate)}</span>
                  </div>
                  {labResult.completedDate && (
                    <div className="flex items-center justify-between">
                      <span>Technician: {labResult.technician}</span>
                      <span>Completed: {formatDate(labResult.completedDate)}</span>
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

export default LabResultsCard;
