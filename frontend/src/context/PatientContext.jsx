import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../services/api";

const PatientContext = createContext();

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all patients with optional filters
  const fetchPatients = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/patients?${params}`);
      setPatients(response.data.patients || response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch patients");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single patient by ID
  const fetchPatientById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/patients/${id}`);
      setCurrentPatient(response.data.patient || response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch patient");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search patients
  const searchPatients = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/patients/search?q=${searchTerm}`);
      setPatients(response.data.patients || response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search patients");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new patient
  const createPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/patients", patientData);
      const newPatient = response.data.patient || response.data;
      setPatients((prev) => [newPatient, ...prev]);
      setCurrentPatient(newPatient);
      return newPatient;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create patient");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update patient
  const updatePatient = useCallback(
    async (id, patientData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/patients/${id}`, patientData);
        const updatedPatient = response.data.patient || response.data;
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? updatedPatient : p))
        );
        if (currentPatient?.id === id) {
          setCurrentPatient(updatedPatient);
        }
        return updatedPatient;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update patient");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPatient]
  );

  // Delete patient
  const deletePatient = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/patients/${id}`);
        setPatients((prev) => prev.filter((p) => p.id !== id));
        if (currentPatient?.id === id) {
          setCurrentPatient(null);
        }
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete patient");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPatient]
  );

  // Clear current patient
  const clearCurrentPatient = useCallback(() => {
    setCurrentPatient(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    patients,
    currentPatient,
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    searchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    setCurrentPatient,
    clearCurrentPatient,
    clearError,
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};

export default PatientContext;
