/**
 * Payment Service for MHMS
 * Handles all payment-related API calls
 */

import api from "./api";

/**
 * Process payment for billing (consultation or pharmacy)
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

/**
 * Get payment history for a billing record
 * @param {string} billingId - Billing ID
 * @param {string} billingType - Type of billing ('consultation' or 'pharmacy')
 * @returns {Promise} - Promise resolving to payment history
 */
export const getPaymentHistory = async (billingId, billingType = 'consultation') => {
  try {
    const endpoint = billingType === 'pharmacy' 
      ? `/pharmacy/billing/${billingId}`
      : `/billing/${billingId}`;
    
    const response = await api.get(endpoint);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch payment history",
      status: error.response?.status,
    };
  }
};

/**
 * Process consultation billing payment
 * @param {string} billingId - Billing ID
 * @param {Object} paymentData - Payment information
 * @returns {Promise} - Promise resolving to payment result
 */
export const processConsultationPayment = async (billingId, paymentData) => {
  try {
    const response = await api.post('/integration/process-payment', {
      billing_type: 'consultation',
      billing_id: billingId,
      ...paymentData,
    });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Payment processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to process consultation payment",
      status: error.response?.status,
    };
  }
};

/**
 * Process pharmacy billing payment
 * @param {string} pharmacyBillingId - Pharmacy billing ID
 * @param {Object} paymentData - Payment information
 * @returns {Promise} - Promise resolving to payment result
 */
export const processPharmacyPayment = async (pharmacyBillingId, paymentData) => {
  try {
    const response = await api.post('/integration/process-payment', {
      billing_type: 'pharmacy',
      billing_id: pharmacyBillingId,
      ...paymentData,
    });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Payment processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to process pharmacy payment",
      status: error.response?.status,
    };
  }
};

/**
 * Validate payment amount
 * @param {number} amount - Payment amount
 * @param {number} totalAmount - Total billing amount
 * @param {number} paidAmount - Already paid amount
 * @returns {Object} - Validation result
 */
export const validatePaymentAmount = (amount, totalAmount, paidAmount = 0) => {
  const remainingAmount = totalAmount - paidAmount;
  
  if (amount <= 0) {
    return {
      valid: false,
      error: "Payment amount must be greater than zero",
    };
  }
  
  if (amount > remainingAmount) {
    return {
      valid: false,
      error: `Payment amount cannot exceed remaining balance of ${remainingAmount}`,
    };
  }
  
  return {
    valid: true,
    remainingAmount,
  };
};

export default {
  processPayment,
  getPaymentHistory,
  processConsultationPayment,
  processPharmacyPayment,
  validatePaymentAmount,
};
