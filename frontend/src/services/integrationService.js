/**
 * Integration Service for MHMS
 * Handles cross-module integration API calls
 */

import api from "./api";

/**
 * Get dashboard statistics (combined billing and pharmacy)
 * @param {Object} filters - Filter options (start_date, end_date)
 * @returns {Promise} - Promise resolving to dashboard statistics
 */
export const getDashboardStats = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/integration/dashboard-stats?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch dashboard statistics",
      status: error.response?.status,
    };
  }
};

/**
 * Get complete patient billing history (consultation + pharmacy)
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to complete billing history
 */
export const getPatientBillingHistory = async (patientId) => {
  try {
    const response = await api.get(`/integration/patient/${patientId}/billing-history`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient billing history",
      status: error.response?.status,
    };
  }
};

/**
 * Process consultation with billing
 * @param {Object} consultationData - Consultation and billing data
 * @returns {Promise} - Promise resolving to consultation and billing result
 */
export const processConsultationWithBilling = async (consultationData) => {
  try {
    const response = await api.post('/integration/consultation-billing', consultationData);
    return {
      success: true,
      data: response.data.data || response.data,
      billing: response.data.billing,
      message: response.data.message || "Consultation billing processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to process consultation billing",
      status: error.response?.status,
    };
  }
};

/**
 * Process prescription with pharmacy billing
 * @param {Object} prescriptionData - Prescription and billing data
 * @returns {Promise} - Promise resolving to prescription and billing result
 */
export const processPrescriptionWithBilling = async (prescriptionData) => {
  try {
    const response = await api.post('/integration/prescription-billing', prescriptionData);
    return {
      success: true,
      data: response.data.data || response.data,
      pharmacyBilling: response.data.pharmacyBilling,
      message: response.data.message || "Prescription billing processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to process prescription billing",
      status: error.response?.status,
    };
  }
};

/**
 * Process payment (consultation or pharmacy)
 * @param {Object} paymentData - Payment information
 * @returns {Promise} - Promise resolving to payment result
 */
export const processPayment = async (paymentData) => {
  try {
    const response = await api.post('/integration/process-payment', paymentData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Payment processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to process payment",
      status: error.response?.status,
    };
  }
};

export default {
  getDashboardStats,
  getPatientBillingHistory,
  processConsultationWithBilling,
  processPrescriptionWithBilling,
  processPayment,
};
