import React, { useState } from "react";

const SubmitResultModal = ({ isOpen, onClose, test, requestId, onSubmit }) => {
  const [resultValue, setResultValue] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen || !test) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!resultValue.trim()) {
      alert("Please enter a result value");
      return;
    }

    const resultData = {
      value: resultValue,
      referenceRange: referenceRange || undefined,
      notes: notes || undefined,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(requestId, test.code, resultData);
    
    // Reset form
    setResultValue("");
    setReferenceRange("");
    setNotes("");
  };

  const handleClose = () => {
    setResultValue("");
    setReferenceRange("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="backdrop-blur-lg bg-slate-900/90 rounded-2xl border border-purple-500/30 p-6 max-w-2xl w-full shadow-2xl shadow-purple-500/20 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-purple-500/30 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Submit Test Results
            </h3>
            <p className="text-purple-300/70 text-sm mt-1">
              {test.name} ({test.code})
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-all duration-300"
          >
            <svg
              className="w-6 h-6 text-purple-400"
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

        {/* Test Info */}
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-400">Panel:</span>
              <span className="text-purple-100 ml-2 font-semibold">
                {test.panel}
              </span>
            </div>
            <div>
              <span className="text-purple-400">Sample Type:</span>
              <span className="text-purple-100 ml-2 font-semibold">
                {test.sampleType}
              </span>
            </div>
            {test.urgency === "Urgent" && (
              <div className="col-span-2">
                <span className="px-3 py-1 bg-red-500/20 border border-red-400/50 rounded text-xs font-semibold text-red-300">
                  ⚠️ URGENT TEST
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Result Value */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Result Value <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              placeholder="Enter test result value (e.g., 120 mg/dL)"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
              required
            />
          </div>

          {/* Reference Range */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Reference Range (Optional)
            </label>
            <input
              type="text"
              value={referenceRange}
              onChange={(e) => setReferenceRange(e.target.value)}
              placeholder="e.g., 70-100 mg/dL"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          {/* Technician Notes */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Technician Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any observations or notes about the test..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Results
              </span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white/10 border border-purple-500/30 text-purple-100 rounded-xl font-semibold hover:bg-purple-500/20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg flex items-start gap-2">
          <svg
            className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-blue-200">
            Please ensure all values are accurate before submitting. Results will be sent to the requesting doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitResultModal;
