/**
 * useApi Hook
 * Custom hook for handling API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/errorHandler';
import { showError, showSuccess } from '../utils/toast';

/**
 * Custom hook for API calls with automatic state management
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} - Hook state and methods
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation successful',
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute the API call
   * @param {...any} args - Arguments to pass to the API function
   * @returns {Promise} - Promise resolving to API result
   */
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);

      if (result.success) {
        setData(result.data);
        
        if (showSuccessToast) {
          showSuccess(result.message || successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result.data);
        }
        
        return result;
      } else {
        const errorMessage = result.error || 'Operation failed';
        setError(errorMessage);
        
        if (showErrorToast) {
          showError(errorMessage);
        }
        
        if (onError) {
          onError(errorMessage);
        }
        
        return result;
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (showErrorToast) {
        showError(errorMessage);
      }
      
      if (onError) {
        onError(errorMessage);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage]);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
