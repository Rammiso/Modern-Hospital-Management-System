import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const LabResultModal = ({ labResult, patientName, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="backdrop-blur-xl bg-slate-900/95 rounded-2xl border-2 border-purple-500/30 
                   shadow-2xl shadow-purple-500/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  🔬 Lab Results
                </h2>
                <p className="text-purple-300/70">{labResult.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-purple-300 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Lab Request Info */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Request Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-purple-300/50 mb-1">Patient</p>
                  <p className="text-white font-semibold">{patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-300/50 mb-1">
                    Ordered By
                  </p>
                  <p className="text-white">{labResult.orderedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-300/50 mb-1">
                    Request Date
                  </p>
                  <p className="text-white">
                    {formatDate(labResult.requestDate)}
                  </p>
                </div>
                {labResult.completedDate && (
                  <div>
                    <p className="text-xs text-purple-300/50 mb-1">
                      Completed Date
                    </p>
                    <p className="text-white">
                      {formatDate(labResult.completedDate)}
                    </p>
                  </div>
                )}
                {labResult.technician && (
                  <div className="col-span-2">
                    <p className="text-xs text-purple-300/50 mb-1">
                      Lab Technician
                    </p>
                    <p className="text-white">{labResult.technician}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Test Results</h3>
              {labResult.tests.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-sm bg-white/5 rounded-xl border border-purple-500/20 p-6"
                >
                  {/* Test Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">
                        {test.name}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          test.status === "COMPLETED"
                            ? "bg-green-500/20 border border-green-500/50 text-green-300"
                            : test.status === "PROCESSING"
                            ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                            : "bg-yellow-500/20 border border-yellow-500/50 text-yellow-300"
                        }`}
                      >
                        {test.status === "COMPLETED"
                          ? "✓"
                          : test.status === "PROCESSING"
                          ? "🔄"
                          : "⏳"}{" "}
                        {test.status}
                      </span>
                    </div>
                  </div>

                  {/* Test Details (if completed) */}
                  {test.status === "COMPLETED" && (
                    <div className="space-y-4">
                      {/* Result Value */}
                      <div className="bg-purple-500/10 rounded-lg p-4">
                        <p className="text-xs text-purple-300/50 mb-2">
                          Result
                        </p>
                        <p className="text-white font-bold text-xl font-mono">
                          {test.result}
                        </p>
                      </div>

                      {/* Reference Range */}
                      {test.referenceRange && (
                        <div className="bg-purple-500/10 rounded-lg p-4">
                          <p className="text-xs text-purple-300/50 mb-2">
                            Reference Range
                          </p>
                          <p className="text-purple-300 font-mono">
                            {test.referenceRange}
                          </p>
                        </div>
                      )}

                      {/* Interpretation/Notes */}
                      {test.notes && (
                        <div className="bg-purple-500/10 rounded-lg p-4">
                          <p className="text-xs text-purple-300/50 mb-2">
                            Notes
                          </p>
                          <p className="text-white">{test.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending Message */}
                  {test.status !== "COMPLETED" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">⏳</span>
                      </div>
                      <div>
                        <p className="text-yellow-300 font-semibold">
                          Result Pending
                        </p>
                        <p className="text-yellow-300/70 text-sm">
                          This test is currently being processed
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Overall Status */}
            <div
              className={`backdrop-blur-sm rounded-xl border p-6 ${
                labResult.status === "COMPLETED"
                  ? "bg-green-500/10 border-green-500/30"
                  : labResult.status === "PROCESSING"
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    labResult.status === "COMPLETED"
                      ? "bg-green-500/20"
                      : labResult.status === "PROCESSING"
                      ? "bg-blue-500/20"
                      : "bg-yellow-500/20"
                  }`}
                >
                  <span className="text-2xl">
                    {labResult.status === "COMPLETED"
                      ? "✓"
                      : labResult.status === "PROCESSING"
                      ? "🔄"
                      : "⏳"}
                  </span>
                </div>
                <div>
                  <p
                    className={`font-bold text-lg ${
                      labResult.status === "COMPLETED"
                        ? "text-green-300"
                        : labResult.status === "PROCESSING"
                        ? "text-blue-300"
                        : "text-yellow-300"
                    }`}
                  >
                    {labResult.status === "COMPLETED"
                      ? "All Tests Completed"
                      : labResult.status === "PROCESSING"
                      ? "Tests In Progress"
                      : "Tests Pending"}
                  </p>
                  <p
                    className={`text-sm ${
                      labResult.status === "COMPLETED"
                        ? "text-green-300/70"
                        : labResult.status === "PROCESSING"
                        ? "text-blue-300/70"
                        : "text-yellow-300/70"
                    }`}
                  >
                    {labResult.status === "COMPLETED"
                      ? "All results are available for review"
                      : labResult.status === "PROCESSING"
                      ? "Results will be available soon"
                      : "Waiting for sample processing"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-purple-500/20 p-6 bg-slate-900/95 backdrop-blur-xl flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 
                       border border-purple-500/30 hover:border-purple-500/50
                       text-purple-300 hover:text-purple-200 font-semibold rounded-xl
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Results
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                       hover:from-purple-600 hover:to-pink-600
                       text-white font-semibold rounded-xl
                       shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                       transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LabResultModal;
