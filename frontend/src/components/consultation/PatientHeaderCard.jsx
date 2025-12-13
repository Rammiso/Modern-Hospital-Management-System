import React from 'react';
import Badge from '../common/Badge';
import Alert from '../common/Alert';
import { calculateAge, formatDate, formatTime } from '../../utils/helpers';

const PatientHeaderCard = ({ patient, appointment, hasOngoingLabTests = false }) => {
  if (!patient || !appointment) {
    return null;
  }

  const age = calculateAge(patient.date_of_birth);
  const hasAllergies = patient.allergies && patient.allergies.trim() !== '';

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      {/* Lab Test Alert */}
      {hasOngoingLabTests && (
        <div className="mb-4">
          <Alert 
            type="warning" 
            message="⚠️ Patient has ongoing lab tests. Consultation is paused until results are available."
          />
        </div>
      )}

      {/* Patient Name and ID */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg className="w-8 h-8 mr-3 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {patient.full_name}
        </h2>
        <p className="text-sm text-gray-600 ml-11">
          <span className="font-medium">MRN:</span> {patient.patient_id}
        </p>
      </div>

      {/* Patient Information Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Age */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Age</p>
          <p className="text-lg font-semibold text-gray-800">
            {age !== null ? `${age} years` : 'N/A'}
          </p>
        </div>

        {/* Gender */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gender</p>
          <p className="text-lg font-semibold text-gray-800 capitalize">
            {patient.gender || 'N/A'}
          </p>
        </div>

        {/* Appointment Date */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatDate(appointment.appointment_date)}
          </p>
        </div>

        {/* Appointment Time */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatTime(appointment.appointment_time)}
          </p>
        </div>
      </div>

      {/* Appointment Type and Allergies */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-200">
        {/* Appointment Type */}
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-600 mr-2">Appointment Type:</span>
          <Badge variant="info" size="medium">
            {appointment.type || 'General'}
          </Badge>
        </div>

        {/* Allergy Badge - Only show if patient has allergies */}
        {hasAllergies && (
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-gray-600 mr-2">Allergies:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
              ⚠️ {patient.allergies}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHeaderCard;
