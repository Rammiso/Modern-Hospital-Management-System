/**
 * Patient Service for MHMS
 * Handles all patient-related API calls
 */

import api from "./api";

/**
 * Get patient dashboard data (complete billing history)
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient dashboard data
 */
export const getPatientDashboard = async (patientId) => {
  try {
    const response = await api.get(`/integration/patient/${patientId}/billing-history`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient dashboard",
      status: error.response?.status,
    };
  }
};

/**
 * Get patient visits/consultations
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient visits
 */
export const getPatientVisits = async (patientId) => {
  try {
    const response = await api.get(`/consultations/patient/${patientId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient visits",
      status: error.response?.status,
    };
  }
};

/**
 * Get patient prescriptions
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient prescriptions
 */
export const getPatientPrescriptions = async (patientId) => {
  try {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient prescriptions",
      status: error.response?.status,
    };
  }
};

/**
 * Get patient lab results
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient lab results
 */
export const getPatientLabResults = async (patientId) => {
  try {
    const response = await api.get(`/lab-results/patient/${patientId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient lab results",
      status: error.response?.status,
    };
  }
};

/**
 * Get patient billing records
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient billing records
 */
export const getPatientBills = async (patientId) => {
  try {
    const response = await api.get(`/billing/patient/${patientId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient bills",
      status: error.response?.status,
    };
  }
};

/**
 * Get patient medical history
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to medical history
 */
export const getPatientMedicalHistory = async (patientId) => {
  try {
    const response = await api.get(`/patients/${patientId}/medical-history`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch medical history",
      status: error.response?.status,
    };
  }
};

/**
 * Get patient details
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient details
 */
export const getPatientDetails = async (patientId) => {
  try {
    const response = await api.get(`/patients/${patientId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient details",
      status: error.response?.status,
    };
  }
};

/**
 * Get all patients with optional filters
 * @param {Object} filters - Filter options (search, page, limit)
 * @returns {Promise} - Promise resolving to patients list
 */
export const getAllPatients = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/patients?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
      total: response.data.total || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patients",
      status: error.response?.status,
    };
  }
};

/**
 * Create new patient
 * @param {Object} patientData - Patient information
 * @returns {Promise} - Promise resolving to created patient
 */
export const createPatient = async (patientData) => {
  try {
    const response = await api.post('/patients', patientData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Patient created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create patient",
      status: error.response?.status,
    };
  }
};

/**
 * Update patient
 * @param {string} patientId - Patient ID
 * @param {Object} patientData - Updated patient information
 * @returns {Promise} - Promise resolving to updated patient
 */
export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await api.put(`/patients/${patientId}`, patientData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Patient updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update patient",
      status: error.response?.status,
    };
  }
};

export default {
  getPatientDashboard,
  getPatientVisits,
  getPatientPrescriptions,
  getPatientLabResults,
  getPatientBills,
  getPatientMedicalHistory,
  getPatientDetails,
  getAllPatients,
  createPatient,
  updatePatient,
};
