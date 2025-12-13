import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import AppointmentCard from "../components/appointments/AppointmentCard";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useAppointment } from "../context/AppointmentContext";
import { useAuth } from "../context/AuthContext";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, loading, error, fetchAppointments } = useAppointment();
  const [fetchError, setFetchError] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        await fetchAppointments();
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setFetchError(
          err.response?.data?.message || "Failed to load appointments"
        );
      }
    };

    loadAppointments();
  }, [fetchAppointments]);

  // Handle schedule appointment button click
  const handleScheduleClick = () => {
    navigate("/receptionist-booking");
  };

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="appointments-page p-6">
        <div className="page-header flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          {user?.role === "receptionist" && (
            <Button onClick={handleScheduleClick}>Schedule Appointment</Button>
          )}
        </div>

        {/* Error Message */}
        {(error || fetchError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error || fetchError}
          </div>
        )}

        {/* Appointments Grid */}
        {appointments && appointments.length > 0 ? (
          <div className="appointments-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
            <p className="text-gray-600 text-lg">No appointments found</p>
            {user?.role === "receptionist" && (
              <Button onClick={handleScheduleClick} className="mt-4">
                Schedule First Appointment
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
