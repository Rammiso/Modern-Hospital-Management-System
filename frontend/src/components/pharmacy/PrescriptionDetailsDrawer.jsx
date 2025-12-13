import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const PrescriptionDetailsDrawer = ({
  isOpen,
  onClose,
  prescription,
  onDispense,
  onReject,
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!prescription) return null;

  const handleDispenseClick = () => {
    onDispense(prescription.id);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (rejectReason.trim()) {
      onReject(prescription.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Prescription Details
              </h2>
              <p className="text-cyan-300/70 text-sm mt-1">
                Prescription #{prescription.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300"
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

          {/* Patient Info Section */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-cyan-500/30 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-100">
                  {prescription.patientName}
                </h3>
                <p className="text-sm text-cyan-300/70">
                  {prescription.patientId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                <div className="text-xs text-cyan-400 mb-1">Age</div>
                <div className="text-lg font-semibold text-cyan-100">
                  {prescription.patientAge} years
                </div>
              </div>
              <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                <div className="text-xs text-cyan-400 mb-1">Sex</div>
                <div className="text-lg font-semibold text-cyan-100">
                  {prescription.patientSex}
                </div>
              </div>
            </div>

            {/* Allergies Alert */}
            {prescription.allergies && prescription.allergies !== "None" && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-red-300">
                    Allergy Alert
                  </div>
                  <div className="text-sm text-red-200">
                    {prescription.allergies}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <div className="text-xs text-cyan-400 mb-1">Prescribed By</div>
              <div className="text-sm font-semibold text-cyan-100">
                {prescription.doctorName}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-cyan-400 mb-1">Status</div>
              <StatusBadge status={prescription.status} />
            </div>
          </div>

          {/* Prescription Items Section */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-cyan-500/30 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Prescription Items
            </h3>

            <div className="space-y-3">
              {prescription.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-100">
                        {item.name}
                      </h4>
                      <p className="text-sm text-cyan-300/70">
                        {item.dosage}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        item.available >= item.quantity
                          ? "bg-green-500/20 text-green-300 border border-green-400/50"
                          : "bg-red-500/20 text-red-300 border border-red-400/50"
                      }`}
                    >
                      {item.available >= item.quantity
                        ? "In Stock"
                        : "Low Stock"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-cyan-400">Frequency:</span>
                      <span className="text-cyan-100 ml-2 font-semibold">
                        {item.frequency}
                      </span>
                    </div>
                    <div>
                      <span className="text-cyan-400">Duration:</span>
                      <span className="text-cyan-100 ml-2 font-semibold">
                        {item.duration}
                      </span>
                    </div>
                    <div>
                      <span className="text-cyan-400">Quantity:</span>
                      <span className="text-cyan-100 ml-2 font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-cyan-400">Available:</span>
                      <span className="text-cyan-100 ml-2 font-semibold">
                        {item.available}
                      </span>
                    </div>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.available >= item.quantity
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-red-500 to-orange-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (item.available / item.quantity) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-6 pb-2">
            <button
              onClick={handleDispenseClick}
              disabled={prescription.status === "DISPENSED"}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6 group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Dispense Prescription
              </span>
            </button>
            <button
              onClick={handleRejectClick}
              disabled={prescription.status === "DISPENSED"}
              className="px-6 py-4 bg-white/10 border-2 border-red-400/50 text-red-300 rounded-xl font-semibold text-lg hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6 group-hover:rotate-12 transition-transform"
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
                Reject
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-lg bg-slate-900/90 rounded-2xl border border-red-500/30 p-6 max-w-md w-full shadow-2xl shadow-red-500/20 animate-scale-in">
            <h3 className="text-xl font-bold text-red-300 mb-4">
              Reject Prescription
            </h3>
            <p className="text-cyan-200 mb-4">
              Please provide a reason for rejecting this prescription:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-xl text-cyan-100 placeholder-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 transition-all duration-300 backdrop-blur-sm resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-white/10 border border-cyan-500/30 text-cyan-100 rounded-lg font-semibold hover:bg-cyan-500/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrescriptionDetailsDrawer;
