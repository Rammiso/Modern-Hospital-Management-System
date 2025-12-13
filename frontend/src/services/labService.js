/**
 * Lab Service for MHMS
 * Handles all laboratory-related API calls
 */

import api from "./api";

/**
 * Get all lab requests with optional filters
 * @param {Object} filters - Filter options (status, start_date, end_date)
 * @returns {Promise} - Promise resolving to lab requests
 */
export const getLabRequests = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/lab-requests?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch lab requests",
      status: error.response?.status,
    };
  }
};

/**
 * Get lab request details by ID
 * @param {string} requestId - Lab request ID
 * @returns {Promise} - Promise resolving to lab request details
 */
export const getLabRequestDetails = async (requestId) => {
  try {
    const response = await api.get(`/lab-requests/${requestId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch lab request details",
      status: error.response?.status,
    };
  }
};

/**
 * Get lab request status
 * @param {string} requestId - Lab request ID
 * @returns {Promise} - Promise resolving to lab request status
 */
export const getLabRequestStatus = async (requestId) => {
  try {
    const response = await api.get(`/lab-requests/${requestId}/status`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch lab request status",
      status: error.response?.status,
    };
  }
};

/**
 * Update lab request status
 * @param {string} requestId - Lab request ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - Promise resolving to updated lab request
 */
export const updateLabRequestStatus = async (requestId, statusData) => {
  try {
    const response = await api.put(`/lab-requests/${requestId}`, statusData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Lab request updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update lab request",
      status: error.response?.status,
    };
  }
};

/**
 * Submit lab results
 * @param {Object} resultsData - Lab results data
 * @returns {Promise} - Promise resolving to submitted results
 */
export const submitLabResults = async (resultsData) => {
  try {
    const response = await api.post('/lab-results', resultsData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Lab results submitted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to submit lab results",
      status: error.response?.status,
    };
  }
};

/**
 * Get lab results by request ID
 * @param {string} requestId - Lab request ID
 * @returns {Promise} - Promise resolving to lab results
 */
export const getLabResults = async (requestId) => {
  try {
    const response = await api.get(`/lab-results/${requestId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch lab results",
      status: error.response?.status,
    };
  }
};

/**
 * Get lab results by consultation ID
 * @param {string} consultationId - Consultation ID
 * @returns {Promise} - Promise resolving to lab results
 */
export const getLabResultsByConsultation = async (consultationId) => {
  try {
    const response = await api.get(`/lab-results/consultation/${consultationId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch lab results",
      status: error.response?.status,
    };
  }
};

/**
 * Get lab results by patient ID
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
 * Get available lab tests
 * @returns {Promise} - Promise resolving to available lab tests
 */
export const getLabTests = async () => {
  try {
    const response = await api.get('/lab/tests');
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch lab tests",
      status: error.response?.status,
    };
  }
};

export default {
  getLabRequests,
  getLabRequestDetails,
  getLabRequestStatus,
  updateLabRequestStatus,
  submitLabResults,
  getLabResults,
  getLabResultsByConsultation,
  getPatientLabResults,
  getLabTests,
};
