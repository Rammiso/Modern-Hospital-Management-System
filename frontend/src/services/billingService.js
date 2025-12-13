/**
 * Billing Service for MHMS
 * Handles all billing-related API calls
 */

import api from "./api";

/**
 * Get all billing records with optional filters
 * @param {Object} filters - Filter options (payment_status, start_date, end_date)
 * @returns {Promise} - Promise resolving to billing records
 */
export const getAllBilling = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.payment_status) params.append('payment_status', filters.payment_status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/billing?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch billing records",
      status: error.response?.status,
    };
  }
};

/**
 * Get billing record by ID
 * @param {string} billingId - Billing ID
 * @returns {Promise} - Promise resolving to billing record
 */
export const getBillingById = async (billingId) => {
  try {
    const response = await api.get(`/billing/${billingId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch billing record",
      status: error.response?.status,
    };
  }
};

/**
 * Get billing records by patient ID
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient billing records
 */
export const getPatientBilling = async (patientId) => {
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
      error: error.response?.data?.message || "Failed to fetch patient billing",
      status: error.response?.status,
    };
  }
};

/**
 * Get billing record by consultation ID
 * @param {string} consultationId - Consultation ID
 * @returns {Promise} - Promise resolving to billing record
 */
export const getBillingByConsultation = async (consultationId) => {
  try {
    const response = await api.get(`/billing/consultation/${consultationId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch consultation billing",
      status: error.response?.status,
    };
  }
};

/**
 * Create billing record (via integration endpoint)
 * @param {Object} billingData - Billing information
 * @returns {Promise} - Promise resolving to created billing record
 */
export const createBilling = async (billingData) => {
  try {
    const response = await api.post('/integration/consultation-billing', billingData);
    return {
      success: true,
      data: response.data.data || response.data.billing,
      message: response.data.message || "Billing created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create billing",
      status: error.response?.status,
    };
  }
};

/**
 * Update billing payment status
 * @param {string} billingId - Billing ID
 * @param {Object} paymentData - Payment information
 * @returns {Promise} - Promise resolving to updated billing record
 */
export const updatePaymentStatus = async (billingId, paymentData) => {
  try {
    const response = await api.put(`/billing/${billingId}/payment`, paymentData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Payment status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update payment status",
      status: error.response?.status,
    };
  }
};

/**
 * Get billing statistics
 * @param {Object} filters - Filter options (start_date, end_date)
 * @returns {Promise} - Promise resolving to billing statistics
 */
export const getBillingStats = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/billing/stats/summary?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch billing statistics",
      status: error.response?.status,
    };
  }
};

export default {
  getAllBilling,
  getBillingById,
  getPatientBilling,
  getBillingByConsultation,
  createBilling,
  updatePaymentStatus,
  getBillingStats,
};
