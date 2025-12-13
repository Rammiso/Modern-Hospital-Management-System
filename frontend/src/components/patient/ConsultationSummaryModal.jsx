import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConsultationSummaryModal = ({ visit, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          className="backdrop-blur-xl bg-slate-900/95 rounded-2xl border-2 border-blue-500/30 
                   shadow-2xl shadow-blue-500/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-blue-500/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  🏥 Consultation Summary
                </h2>
                <p className="text-blue-300/70">{visit.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-blue-300 hover:text-white"
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
            {/* Visit Info */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Visit Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-300/50 mb-1">Date & Time</p>
                  <p className="text-white">{formatDate(visit.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300/50 mb-1">Doctor</p>
                  <p className="text-white">{visit.doctor}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300/50 mb-1">Department</p>
                  <p className="text-white">{visit.department}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300/50 mb-1">Status</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 border border-green-500/50 text-green-300">
                    ✓ {visit.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Diagnosis</h3>
              <p className="text-white text-lg">{visit.diagnosis}</p>
            </div>

            {/* Symptoms */}
            {visit.symptoms && visit.symptoms.length > 0 && (
              <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {visit.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vitals */}
            {visit.vitals && (
              <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Vital Signs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-300/50 mb-1">
                      Blood Pressure
                    </p>
                    <p className="text-white font-bold font-mono text-lg">
                      {visit.vitals.bloodPressure}
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-300/50 mb-1">Heart Rate</p>
                    <p className="text-white font-bold font-mono text-lg">
                      {visit.vitals.heartRate} bpm
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-300/50 mb-1">Temperature</p>
                    <p className="text-white font-bold font-mono text-lg">
                      {visit.vitals.temperature}°C
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-300/50 mb-1">Weight</p>
                    <p className="text-white font-bold font-mono text-lg">
                      {visit.vitals.weight} kg
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-300/50 mb-1">Height</p>
                    <p className="text-white font-bold font-mono text-lg">
                      {visit.vitals.height} cm
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-300/50 mb-1">SpO2</p>
                    <p className="text-white font-bold font-mono text-lg">
                      {visit.vitals.spo2}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prescriptions */}
            {visit.prescriptions && visit.prescriptions.length > 0 && (
              <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Prescriptions
                </h3>
                <div className="space-y-3">
                  {visit.prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-bold">
                          💊 {prescription.medicine}
                        </h4>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-teal-300/50 text-xs mb-1">
                            Dosage
                          </p>
                          <p className="text-white">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-teal-300/50 text-xs mb-1">
                            Frequency
                          </p>
                          <p className="text-white">{prescription.frequency}</p>
                        </div>
                        <div>
                          <p className="text-teal-300/50 text-xs mb-1">
                            Duration
                          </p>
                          <p className="text-white">{prescription.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tests Ordered */}
            {visit.testsOrdered && visit.testsOrdered.length > 0 && (
              <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Tests Ordered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {visit.testsOrdered.map((test, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm"
                    >
                      🔬 {test}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {visit.notes && (
              <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Doctor's Notes
                </h3>
                <p className="text-white leading-relaxed">{visit.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-blue-500/20 p-6 bg-slate-900/95 backdrop-blur-xl">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                       hover:from-blue-600 hover:to-cyan-600
                       text-white font-semibold rounded-xl
                       shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
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

export default ConsultationSummaryModal;
