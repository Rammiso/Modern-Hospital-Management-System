import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchPatients,
  getDoctors,
  getAvailableSlots,
  createAppointment,
} from "../../services/appointmentService";

const ReceptionistBooking = () => {
  const navigate = useNavigate();

  // Form State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Data State
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // UI State
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const data = await getDoctors();
        // Backend returns { status, results, doctors }
        setDoctors(data.doctors || data || []);
      } catch (err) {
        setError("Failed to load doctors. Please refresh the page.");
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Debounced patient search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const data = await searchPatients(searchQuery);
          // Backend returns { status, results, patients }
          setPatients(data.patients || data || []);
          setShowPatientDropdown(true);
        } catch (err) {
          setError("Failed to search patients.");
        } finally {
          setIsSearching(false);
        }
      } else {
        setPatients([]);
        setShowPatientDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDoctor && selectedDate) {
        setIsLoadingSlots(true);
        setSelectedSlot(null);
        try {
          const data = await getAvailableSlots(selectedDoctor, selectedDate);
          // Backend returns { status, results, slots }
          setAvailableSlots(data.slots || data || []);
        } catch (err) {
          console.error("Failed to load slots:", err);
          setError("Failed to load available slots.");
          setAvailableSlots([]);
        } finally {
          setIsLoadingSlots(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery(`${patient.full_name} - ${patient.phone || "N/A"}`);
    setShowPatientDropdown(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!selectedPatient) {
      setError("Please select a patient.");
      return;
    }
    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        patient_id: selectedPatient.id, // Use UUID id, not patient_id
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.time,
        source: "RECEPTION",
        status: "scheduled",
      };

      await createAppointment(appointmentData);
      setSuccess("Appointment booked successfully!");

      // Auto-reset form after 2 seconds
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSearchQuery("");
    setSelectedPatient(null);
    setSelectedDoctor("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/appointments")}
            className="mb-4 flex items-center gap-2 text-medical-600 hover:text-medical-700 font-medium transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Appointments
          </button>

          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-accent-cyan mb-2">
            Receptionist Appointment Booking
          </h1>
          <p className="text-slate-600">
            Book appointments for patients visiting the front desk
          </p>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Patient & Doctor Selection */}
            <div className="space-y-6">
              {/* Patient Search Card */}
              <div className="relative backdrop-blur-lg bg-white/70 rounded-2xl shadow-glass border border-medical-200/50 p-6 transition-all duration-300 hover:shadow-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-500 to-accent-cyan flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h2 className="text-xl font-semibold text-slate-800">
                    Patient Selection
                  </h2>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search Patient
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type patient name or contact..."
                      className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-medical-200 bg-white/50 backdrop-blur-sm focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/20 transition-all duration-300 outline-none placeholder:text-slate-400"
                    />
                    <svg
                      className="w-5 h-5 text-medical-400 absolute left-3 top-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {isSearching && (
                      <div className="absolute right-3 top-3.5">
                        <div className="w-5 h-5 border-2 border-medical-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Patient Dropdown */}
                  {showPatientDropdown && patients.length > 0 && (
                    <div className="absolute z-100 w-full mt-2 py-2 backdrop-blur-lg bg-white/90 rounded-xl shadow-glow-lg border border-medical-200/50 max-h-60 overflow-y-auto">
                      {patients.map((patient) => (
                        <button
                          key={patient.patient_id}
                          type="button"
                          onClick={() => handlePatientSelect(patient)}
                          className="w-full px-4 py-3 text-left hover:bg-medical-50 transition-colors duration-200 flex flex-col"
                        >
                          <span className="font-medium text-slate-800">
                            {patient.full_name}
                          </span>
                          <span className="text-sm text-slate-500">
                            {patient.phone || "No contact"} •{" "}
                            {patient.gender || "N/A"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Patient Display */}
                  {selectedPatient && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-medical-50 to-cyan-50 rounded-lg border border-medical-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {selectedPatient.full_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            ID: {selectedPatient.patient_id}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatient(null);
                            setSearchQuery("");
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Selection Card */}
              <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-glass border border-medical-200/50 p-6 transition-all duration-300 hover:shadow-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-medical-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Doctor & Date
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Doctor Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Doctor
                    </label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      disabled={isLoadingDoctors}
                      className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 bg-white/50 backdrop-blur-sm focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/20 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">-- Choose a doctor --</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.doctor_id} value={doctor.doctor_id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 bg-white/50 backdrop-blur-sm focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/20 transition-all duration-300 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Time Slots */}
            <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-glass border border-medical-200/50 p-6 transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-teal to-medical-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Available Time Slots
                </h2>
              </div>

              {/* Slots Container */}
              <div className="min-h-[400px]">
                {!selectedDoctor || !selectedDate ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>Select a doctor and date to view available slots</p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <div className="w-12 h-12 border-4 border-medical-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-600">Loading available slots...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="font-medium text-slate-700">Doctor Busy</p>
                    <p className="text-sm">No available slots for this date</p>
                  </div>
                ) : (
                  <div>
                    {/* Next Available Indicator */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-green-700">
                        Next Available: {availableSlots[0]?.time}
                      </span>
                    </div>

                    {/* Slot Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            selectedSlot?.time === slot.time
                              ? "bg-gradient-to-r from-medical-500 to-accent-cyan text-white shadow-glow scale-105 border-2 border-accent-neon"
                              : "bg-white/50 text-slate-700 border-2 border-medical-200 hover:border-medical-400 hover:bg-medical-50 hover:scale-105"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 animate-pulse">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 animate-pulse">
              <svg
                className="w-6 h-6 text-green-500"
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
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-medical-500 to-accent-cyan text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Booking...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Book Appointment
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-4 bg-white/70 backdrop-blur-sm text-slate-700 font-semibold rounded-xl border-2 border-medical-200 hover:border-medical-400 hover:bg-medical-50 transition-all duration-300"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceptionistBooking;
