import React, { useState } from "react";
import { updateLabRequestStatus } from "../../services/labService";
import { useAuth } from "../../context/AuthContext";

const SubmitResultModal = ({ isOpen, onClose, labRequest, onSubmit }) => {
  const { user } = useAuth();
  const [resultValue, setResultValue] = useState("");
  const [resultUnit, setResultUnit] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !labRequest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resultValue.trim()) {
      alert("Please enter a result value");
      return;
    }

    setSubmitting(true);

    try {
      const resultData = {
        status: "completed",
        result: resultValue,
        result_unit: resultUnit || null,
        normal_range: normalRange || null,
        completed_by: user?.id,
      };

      const response = await updateLabRequestStatus(labRequest.id, resultData);
      
      if (response.success) {
        alert("Results submitted successfully!");
        onSubmit();
        handleClose();
      } else {
        alert("Failed to submit results: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting results:", error);
      alert("An error occurred while submitting results");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setResultValue("");
    setResultUnit("");
    setNormalRange("");
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
              {labRequest.test_name}
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
              <span className="text-purple-400">Patient:</span>
              <span className="text-purple-100 ml-2 font-semibold">
                {labRequest.patient_name || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-purple-400">Test Type:</span>
              <span className="text-purple-100 ml-2 font-semibold">
                {labRequest.test_type}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-purple-400">Request ID:</span>
              <span className="text-purple-100 ml-2 font-mono text-xs">
                {labRequest.id}
              </span>
            </div>
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

          {/* Result Unit */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Unit (Optional)
            </label>
            <input
              type="text"
              value={resultUnit}
              onChange={(e) => setResultUnit(e.target.value)}
              placeholder="e.g., mg/dL, mmol/L, cells/μL"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          {/* Normal Range */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Normal Range (Optional)
            </label>
            <input
              type="text"
              value={normalRange}
              onChange={(e) => setNormalRange(e.target.value)}
              placeholder="e.g., 70-100 mg/dL"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-6 py-3 bg-white/10 border border-purple-500/30 text-purple-100 rounded-xl font-semibold hover:bg-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
