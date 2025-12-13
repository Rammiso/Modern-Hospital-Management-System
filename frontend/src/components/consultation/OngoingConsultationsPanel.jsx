import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { formatTime } from "../../utils/helpers";

/**
 * OngoingConsultationsPanel - Right panel showing doctor's ongoing consultations
 * Allows switching between consultations
 */
const OngoingConsultationsPanel = ({ consultations, currentConsultationId, loading }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status) {
      case "DRAFT":
        return "warning";
      case "WAITING_FOR_LAB_RESULTS":
        return "info";
      case "READY_FOR_REVIEW":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRAFT":
        return "Draft";
      case "WAITING_FOR_LAB_RESULTS":
        return "Waiting for Lab";
      case "READY_FOR_REVIEW":
        return "Ready for Review";
      default:
        return status;
    }
  };

  const handleConsultationClick = (consultationId) => {
    navigate(`/consultation/${consultationId}`);
  };

  if (loading) {
    return (
      <div className="h-full bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Ongoing Consultations
        </h2>
        {consultations && consultations.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">{consultations.length} active</p>
        )}
      </div>

      {/* Scrollable Consultation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {consultations && consultations.length > 0 ? (
          consultations.map((consultation) => {
            const isActive = consultation.id === currentConsultationId;
            return (
              <div
                key={consultation.id}
                onClick={() => handleConsultationClick(consultation.id)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                  ${isActive 
                    ? 'border-cyan-500 bg-cyan-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-cyan-300 hover:shadow-md'
                  }
                `}
              >
                {/* Patient Name */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {consultation.patient_name}
                  </h3>
                  {isActive && (
                    <span className="text-xs text-cyan-600 font-medium">Current</span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-2">
                  <Badge variant={getStatusVariant(consultation.status)} size="sm">
                    {getStatusLabel(consultation.status)}
                  </Badge>
                </div>

                {/* Timestamp */}
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(consultation.timestamp || consultation.created_at)}
                </div>

                {/* Lab Status Alert */}
                {consultation.status === "WAITING_FOR_LAB_RESULTS" && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Awaiting lab results
                  </div>
                )}

                {/* Ready for Review Alert */}
                {consultation.status === "READY_FOR_REVIEW" && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lab results received
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">No ongoing consultations</p>
          </div>
        )}
      </div>

      {/* Footer with New Consultation Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => navigate("/appointments")}
          className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-300 text-sm font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start New Consultation
        </button>
      </div>
    </div>
  );
};

export default OngoingConsultationsPanel;
