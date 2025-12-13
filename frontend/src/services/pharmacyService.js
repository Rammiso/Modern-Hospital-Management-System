/**
 * Pharmacy Service for MHMS
 * Handles all pharmacy-related API calls
 */

import api from "./api";

/**
 * Get pending prescriptions for pharmacy
 * @param {Object} filters - Filter options (payment_status)
 * @returns {Promise} - Promise resolving to pending prescriptions
 */
export const getPendingPrescriptions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('payment_status', filters.payment_status || 'pending');

    const response = await api.get(`/pharmacy/billing?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch pending prescriptions",
      status: error.response?.status,
    };
  }
};

/**
 * Get pharmacy billing by ID
 * @param {string} pharmacyBillingId - Pharmacy billing ID
 * @returns {Promise} - Promise resolving to pharmacy billing record
 */
export const getPharmacyBillingById = async (pharmacyBillingId) => {
  try {
    const response = await api.get(`/pharmacy/billing/${pharmacyBillingId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch pharmacy billing",
      status: error.response?.status,
    };
  }
};

/**
 * Get pharmacy billing by prescription ID
 * @param {string} prescriptionId - Prescription ID
 * @returns {Promise} - Promise resolving to pharmacy billing record
 */
export const getPrescriptionDetails = async (prescriptionId) => {
  try {
    const response = await api.get(`/pharmacy/billing/prescription/${prescriptionId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch prescription details",
      status: error.response?.status,
    };
  }
};

/**
 * Get pharmacy billing by patient ID
 * @param {string} patientId - Patient ID
 * @returns {Promise} - Promise resolving to patient pharmacy billing records
 */
export const getPatientPharmacyBilling = async (patientId) => {
  try {
    const response = await api.get(`/pharmacy/billing/patient/${patientId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch patient pharmacy billing",
      status: error.response?.status,
    };
  }
};

/**
 * Dispense prescription and create pharmacy billing
 * @param {Object} dispensingData - Dispensing information
 * @returns {Promise} - Promise resolving to pharmacy billing record
 */
export const dispensePrescription = async (dispensingData) => {
  try {
    const response = await api.post('/integration/prescription-billing', dispensingData);
    return {
      success: true,
      data: response.data.data || response.data.pharmacyBilling,
      message: response.data.message || "Prescription dispensed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to dispense prescription",
      status: error.response?.status,
    };
  }
};

/**
 * Update pharmacy payment status
 * @param {string} pharmacyBillingId - Pharmacy billing ID
 * @param {Object} paymentData - Payment information
 * @returns {Promise} - Promise resolving to updated pharmacy billing record
 */
export const updatePharmacyPaymentStatus = async (pharmacyBillingId, paymentData) => {
  try {
    const response = await api.put(`/pharmacy/billing/${pharmacyBillingId}/payment`, paymentData);
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
 * Get all pharmacy billing records with filters
 * @param {Object} filters - Filter options (payment_status, start_date, end_date)
 * @returns {Promise} - Promise resolving to pharmacy billing records
 */
export const getAllPharmacyBilling = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.payment_status) params.append('payment_status', filters.payment_status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/pharmacy/billing?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch pharmacy billing records",
      status: error.response?.status,
    };
  }
};

/**
 * Get pharmacy statistics
 * @param {Object} filters - Filter options (start_date, end_date)
 * @returns {Promise} - Promise resolving to pharmacy statistics
 */
export const getPharmacyStats = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/pharmacy/stats/summary?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch pharmacy statistics",
      status: error.response?.status,
    };
  }
};

/**
 * Get pharmacy inventory (if needed)
 * @param {Object} filters - Filter options
 * @returns {Promise} - Promise resolving to inventory items
 */
export const getInventory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.low_stock) params.append('low_stock', filters.low_stock);

    const response = await api.get(`/pharmacy-inventory?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch inventory",
      status: error.response?.status,
    };
  }
};

export default {
  getPendingPrescriptions,
  getPharmacyBillingById,
  getPrescriptionDetails,
  getPatientPharmacyBilling,
  dispensePrescription,
  updatePharmacyPaymentStatus,
  getAllPharmacyBilling,
  getPharmacyStats,
  getInventory,
};
