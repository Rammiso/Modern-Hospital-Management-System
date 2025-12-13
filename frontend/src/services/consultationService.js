/**
 * Consultation Service for MHMS
 * Handles API calls related to consultations
 */

import api from "./api";

/**
 * Fetch appointment data by ID
 * @param {string} appointmentId - The appointment ID
 * @returns {Promise} - Promise resolving to appointment data with patient info
 */
export const getAppointment = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to fetch appointment",
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Fetch available laboratory tests
 * @returns {Promise} - Promise resolving to array of available lab tests
 */
export const getLabTests = async () => {
  try {
    const response = await api.get("/lab/tests");
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to fetch lab tests",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Submit consultation data
 * @param {Object} consultationData - The consultation payload
 * @returns {Promise} - Promise resolving to consultation response
 */
export const submitConsultation = async (consultationData) => {
  try {
    const response = await api.post("/consultations", consultationData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Consultation saved successfully",
    };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to submit consultation",
        details: error.response.data.details || {},
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Save consultation as draft
 * @param {Object} consultationData - The consultation payload
 * @returns {Promise} - Promise resolving to draft save response
 */
export const saveDraft = async (consultationData) => {
  try {
    const response = await api.post("/consultations/save-draft", consultationData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Draft saved successfully",
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to save draft",
        details: error.response.data.details || {},
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Finish consultation (mark as completed)
 * @param {Object} consultationData - The consultation payload with consultation_id
 * @returns {Promise} - Promise resolving to finish response
 */
export const finishConsultation = async (consultationData) => {
  try {
    const response = await api.post("/consultations/finish", consultationData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Consultation completed successfully",
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to finish consultation",
        details: error.response.data.details || {},
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Send lab request and pause consultation
 * @param {Object} labRequestData - Lab request payload with consultation ID
 * @returns {Promise} - Promise resolving to lab request response
 */
export const sendLabRequest = async (labRequestData) => {
  try {
    const response = await api.post("/consultations/send-lab-request", labRequestData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Lab request sent successfully",
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to send lab request",
        details: error.response.data.details || {},
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Get lab request status
 * @param {string} labRequestId - Lab request ID
 * @returns {Promise} - Promise resolving to lab request status
 */
export const getLabRequestStatus = async (labRequestId) => {
  try {
    const response = await api.get(`/lab-requests/${labRequestId}/status`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to fetch lab status",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
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
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to fetch medical history",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Get ongoing consultations for current doctor
 * @returns {Promise} - Promise resolving to list of ongoing consultations
 */
export const getOngoingConsultations = async () => {
  try {
    const response = await api.get("/consultations/ongoing");
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to fetch ongoing consultations",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

/**
 * Get or create consultation for appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise} - Promise resolving to consultation data
 */
export const getOrCreateConsultation = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}/consultation-or-create`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || "Failed to get consultation",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

export default {
  getAppointment,
  getLabTests,
  submitConsultation,
  saveDraft,
  sendLabRequest,
  getLabRequestStatus,
  getPatientMedicalHistory,
  getOngoingConsultations,
  getOrCreateConsultation,
};
