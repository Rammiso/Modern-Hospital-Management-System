/**
 * Error Handler Utility
 * Centralized error handling for API calls
 */

/**
 * Extract error message from error object
 * @param {Object} error - Error object from API call
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // If error is already a string
  if (typeof error === 'string') {
    return error;
  }

  // If error has a message property
  if (error?.message) {
    return error.message;
  }

  // If error has response data
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Check for message in various formats
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.msg) return data.msg;
  }

  // Network errors
  if (error?.request && !error?.response) {
    return "Network error. Please check your internet connection.";
  }

  // Default error message
  return "An unexpected error occurred. Please try again.";
};

/**
 * Handle API error and return formatted error object
 * @param {Object} error - Error object from API call
 * @param {string} defaultMessage - Default error message
 * @returns {Object} - Formatted error object
 */
export const handleApiError = (error, defaultMessage = "Operation failed") => {
  const message = getErrorMessage(error);
  const status = error?.response?.status || 500;

  // Log error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      message,
      status,
      error,
    });
  }

  return {
    success: false,
    error: message || defaultMessage,
    status,
  };
};

/**
 * Check if error is authentication error
 * @param {Object} error - Error object
 * @returns {boolean} - True if authentication error
 */
export const isAuthError = (error) => {
  const status = error?.response?.status || error?.status;
  return status === 401 || status === 403;
};

/**
 * Check if error is validation error
 * @param {Object} error - Error object
 * @returns {boolean} - True if validation error
 */
export const isValidationError = (error) => {
  const status = error?.response?.status || error?.status;
  return status === 400 || status === 422;
};

/**
 * Check if error is network error
 * @param {Object} error - Error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return error?.request && !error?.response;
};

/**
 * Get validation errors from error response
 * @param {Object} error - Error object
 * @returns {Object} - Validation errors object
 */
export const getValidationErrors = (error) => {
  const data = error?.response?.data;
  
  if (data?.errors) {
    return data.errors;
  }
  
  if (data?.details) {
    return data.details;
  }
  
  return {};
};

/**
 * Format error for display
 * @param {Object} error - Error object
 * @returns {Object} - Formatted error for display
 */
export const formatErrorForDisplay = (error) => {
  const message = getErrorMessage(error);
  const validationErrors = getValidationErrors(error);
  
  return {
    message,
    validationErrors,
    isAuth: isAuthError(error),
    isValidation: isValidationError(error),
    isNetwork: isNetworkError(error),
  };
};

export default {
  getErrorMessage,
  handleApiError,
  isAuthError,
  isValidationError,
  isNetworkError,
  getValidationErrors,
  formatErrorForDisplay,
};
