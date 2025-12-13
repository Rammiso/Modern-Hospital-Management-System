/**
 * useToast Hook
 * Custom hook for toast notifications
 */

import { useCallback } from 'react';
import {
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from '../utils/toast';

/**
 * Custom hook for toast notifications
 * @returns {Object} - Toast notification methods
 */
export const useToast = () => {
  const toast = useCallback((message, type = 'info', duration = 3000) => {
    showToast(message, type, duration);
  }, []);

  const success = useCallback((message, duration = 3000) => {
    showSuccess(message, duration);
  }, []);

  const error = useCallback((message, duration = 4000) => {
    showError(message, duration);
  }, []);

  const warning = useCallback((message, duration = 3500) => {
    showWarning(message, duration);
  }, []);

  const info = useCallback((message, duration = 3000) => {
    showInfo(message, duration);
  }, []);

  return {
    toast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
