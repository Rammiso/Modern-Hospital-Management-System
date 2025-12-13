import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../services/api";

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider"
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch appointments with filters
  const fetchAppointments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/appointments?${params}`);
      setAppointments(response.data.appointments || response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch today's appointments
  const fetchTodayAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/appointments/today");
      setAppointments(response.data.appointments || response.data);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch today's appointments"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointment by ID
  const fetchAppointmentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/appointments/${id}`);
      setCurrentAppointment(response.data.appointment || response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get available time slots
  const getAvailableSlots = useCallback(async (doctorId, date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/appointments/available-slots?doctor_id=${doctorId}&date=${date}`
      );
      return response.data.slots || [];
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch available slots"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create appointment
  const createAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/appointments", appointmentData);
      const newAppointment = response.data.appointment || response.data;
      setAppointments((prev) => [newAppointment, ...prev]);
      setCurrentAppointment(newAppointment);
      return newAppointment;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update appointment
  const updateAppointment = useCallback(
    async (id, appointmentData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/appointments/${id}`, appointmentData);
        const updatedAppointment = response.data.appointment || response.data;
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? updatedAppointment : a))
        );
        if (currentAppointment?.id === id) {
          setCurrentAppointment(updatedAppointment);
        }
        return updatedAppointment;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update appointment");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentAppointment]
  );

  // Update appointment status
  const updateAppointmentStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/appointments/${id}/status`, {
          status,
        });
        const updatedAppointment = response.data.appointment || response.data;
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? updatedAppointment : a))
        );
        if (currentAppointment?.id === id) {
          setCurrentAppointment(updatedAppointment);
        }
        return updatedAppointment;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to update appointment status"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentAppointment]
  );

  // Cancel appointment
  const cancelAppointment = useCallback(
    async (id, reason) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/appointments/${id}/cancel`, {
          reason,
        });
        const updatedAppointment = response.data.appointment || response.data;
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? updatedAppointment : a))
        );
        if (currentAppointment?.id === id) {
          setCurrentAppointment(updatedAppointment);
        }
        return updatedAppointment;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to cancel appointment");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentAppointment]
  );

  // Clear current appointment
  const clearCurrentAppointment = useCallback(() => {
    setCurrentAppointment(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    appointments,
    currentAppointment,
    loading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    fetchAppointmentById,
    getAvailableSlots,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    setCurrentAppointment,
    clearCurrentAppointment,
    clearError,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContext;
