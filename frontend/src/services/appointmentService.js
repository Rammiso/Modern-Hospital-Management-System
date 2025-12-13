import api from "./api";

/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

// Fetch all appointments
export const getAppointments = async () => {
  const response = await api.get("/appointments");
  return response.data;
};

// Fetch appointment by ID
export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

// Create new appointment
export const createAppointment = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

// Update appointment
export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

// Delete appointment
export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};

// Search patients by query
export const searchPatients = async (searchQuery) => {
  const response = await api.get(
    `/patients/search?q=${encodeURIComponent(searchQuery)}`
  );
  return response.data;
};

// Fetch all doctors
export const getDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

// Fetch available slots for a doctor on a specific date
export const getAvailableSlots = async (doctorId, date) => {
  const response = await api.get(
    `/appointments/available-slots?doctor_id=${doctorId}&date=${date}`
  );
  return response.data;
};
