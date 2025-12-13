import React from "react";
import StatusBadge from "./StatusBadge";

const LabRequestDrawer = ({
  isOpen,
  onClose,
  request,
  onStartProcessing,
  onSubmitResults,
}) => {
  if (!request) return null;

  const handleStartProcessing = () => {
    onStartProcessing(request.id);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        className={`fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Lab Request Details
              </h2>
              <p className="text-purple-300/70 text-sm mt-1">
                Request ID: LAB-{request.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-all duration-300 group"
            >
              <svg
                className="w-6 h-6 text-purple-400 group-hover:text-purple-300"
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
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-purple-500/30 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
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
                <h3 className="text-xl font-semibold text-purple-100">
                  {request.patientName}
                </h3>
                <p className="text-sm text-purple-300/70">
                  {request.patientId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="text-xs text-purple-400 mb-1">Age</div>
                <div className="text-lg font-semibold text-purple-100">
                  {request.patientAge} years
                </div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="text-xs text-purple-400 mb-1">Sex</div>
                <div className="text-lg font-semibold text-purple-100">
                  {request.patientSex}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <div className="text-xs text-purple-400 mb-1">Requested By</div>
              <div className="text-sm font-semibold text-purple-100">
                {request.doctorName}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-purple-400 mb-1">Appointment ID</div>
              <div className="text-sm font-mono text-purple-200">
                {request.appointmentId}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-purple-400 mb-1">Requested Time</div>
              <div className="text-sm text-purple-200">
                {formatDateTime(request.requestedAt)}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-purple-400 mb-1">Status</div>
              <StatusBadge status={request.status} />
            </div>

            {request.notes && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <div className="text-xs text-blue-400 mb-1">Notes</div>
                <div className="text-sm text-blue-200">{request.notes}</div>
              </div>
            )}

            {/* Urgent Flag */}
            {request.tests.some(t => t.urgency === "Urgent") && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse"
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
                    Urgent Request
                  </div>
                  <div className="text-sm text-red-200">
                    This request contains urgent tests. Please prioritize.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tests Section */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-purple-500/30 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Ordered Tests ({request.tests.length})
            </h3>

            <div className="space-y-3">
              {request.tests.map((test, index) => (
                <div
                  key={index}
                  className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-purple-100">
                          {test.name}
                        </h4>
                        {test.urgency === "Urgent" && (
                          <span className="px-2 py-0.5 bg-red-500/20 border border-red-400/50 rounded text-xs font-semibold text-red-300">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-purple-300/70">
                        Code: {test.code}
                      </p>
                    </div>
                    {test.completed && (
                      <div className="px-3 py-1 bg-green-500/20 border border-green-400/50 rounded-lg text-xs font-semibold text-green-300">
                        ✓ Completed
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-purple-400">Panel:</span>
                      <span className="text-purple-100 ml-2 font-semibold">
                        {test.panel}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-400">Sample:</span>
                      <span className="text-purple-100 ml-2 font-semibold">
                        {test.sampleType}
                      </span>
                    </div>
                  </div>

                  {/* Submit Results Button */}
                  {request.status !== "PENDING" && !test.completed && (
                    <button
                      onClick={() => onSubmitResults(test)}
                      className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                    >
                      Submit Results
                    </button>
                  )}

                  {/* Show Results if Completed */}
                  {test.completed && test.result && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                      <div className="text-xs text-green-400 mb-2">Results</div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-green-300">Value:</span>
                          <span className="text-green-100 ml-2 font-semibold">
                            {test.result.value}
                          </span>
                        </div>
                        {test.result.referenceRange && (
                          <div>
                            <span className="text-green-300">Reference:</span>
                            <span className="text-green-100 ml-2">
                              {test.result.referenceRange}
                            </span>
                          </div>
                        )}
                        {test.result.notes && (
                          <div>
                            <span className="text-green-300">Notes:</span>
                            <span className="text-green-100 ml-2">
                              {test.result.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-6 pb-2">
            {request.status === "PENDING" && (
              <button
                onClick={handleStartProcessing}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start Processing
                </span>
              </button>
            )}
            {request.status === "PROCESSING" && (
              <div className="flex-1 px-6 py-4 bg-blue-500/20 border-2 border-blue-400/50 text-blue-300 rounded-xl font-semibold text-lg text-center">
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Processing...
                </span>
              </div>
            )}
            {request.status === "COMPLETED" && (
              <div className="flex-1 px-6 py-4 bg-green-500/20 border-2 border-green-400/50 text-green-300 rounded-xl font-semibold text-lg text-center">
                <span className="flex items-center justify-center gap-2">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Completed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LabRequestDrawer;
