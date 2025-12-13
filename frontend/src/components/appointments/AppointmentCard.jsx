import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartConsultation = () => {
    navigate(`/consultation/${appointment.id}`);
  };

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    // If time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Determine if consultation can be started
  const canStartConsultation = () => {
    if (user?.role !== "doctor") return false;
    const validStatuses = ["scheduled", "confirmed", "in-progress"];
    return validStatuses.includes(appointment.status?.toLowerCase());
  };

  return (
    <div className="appointment-card bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="appointment-header flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            {appointment.patient_name ||
              appointment.patientName ||
              "Unknown Patient"}
          </h4>
          <p className="text-sm text-gray-600">
            ID: {appointment.patient_id || "N/A"}
          </p>
        </div>
        <span
          className={`status px-3 py-1 rounded-full text-xs font-semibold uppercase ${
            appointment.status === "scheduled" ||
            appointment.status === "confirmed"
              ? "bg-blue-100 text-blue-700"
              : appointment.status === "completed"
              ? "bg-green-100 text-green-700"
              : appointment.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : appointment.status === "in-progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="appointment-body space-y-2 mb-4">
        <div className="appointment-info flex justify-between">
          <span className="label text-sm text-gray-600">Date:</span>
          <span className="value text-sm font-medium text-gray-800">
            {formatDate(appointment.appointment_date || appointment.date)}
          </span>
        </div>
        <div className="appointment-info flex justify-between">
          <span className="label text-sm text-gray-600">Time:</span>
          <span className="value text-sm font-medium text-gray-800">
            {formatTime(appointment.appointment_time || appointment.time)}
          </span>
        </div>
        <div className="appointment-info flex justify-between">
          <span className="label text-sm text-gray-600">Doctor:</span>
          <span className="value text-sm font-medium text-gray-800">
            {appointment.doctor_name || appointment.doctor || "Not assigned"}
          </span>
        </div>
        {appointment.department && (
          <div className="appointment-info flex justify-between">
            <span className="label text-sm text-gray-600">Department:</span>
            <span className="value text-sm font-medium text-gray-800">
              {appointment.department}
            </span>
          </div>
        )}
        {appointment.reason && (
          <div className="appointment-info">
            <span className="label text-sm text-gray-600 block mb-1">
              Reason:
            </span>
            <span className="value text-sm text-gray-800">
              {appointment.reason}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {canStartConsultation() && (
        <div className="appointment-actions pt-4 border-t border-gray-200">
          <Button
            onClick={handleStartConsultation}
            variant="primary"
            className="w-full bg-gradient-to-r from-medical-500 to-accent-cyan hover:shadow-lg"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Start Consultation
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
