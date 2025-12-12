const LabRequest = require("../models/labRequestModel");

// ========================
// CREATE Lab Request
// ========================
const createLabRequest = async (req, res) => {
  try {
    const { consultation_id, test_name, test_type, instructions } = req.body;

    // Validate required fields
    if (!consultation_id || !test_name) {
      return res.status(400).json({
        message: "Validation error",
        details: "consultation_id and test_name are required"
      });
    }

    const labRequest = await LabRequest.create({
      consultation_id,
      test_name,
      test_type: test_type || "blood",
      instructions: instructions || null
    });

    res.status(201).json({
      status: "success",
      message: "Lab request created successfully",
      data: labRequest
    });
  } catch (err) {
    console.error("Create Lab Request Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to create lab request",
      error: err.message
    });
  }
};

// ========================
// GET Lab Request by ID
// ========================
const getLabRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const labRequest = await LabRequest.getById(id);

    if (!labRequest) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.json({
      status: "success",
      data: labRequest
    });
  } catch (err) {
    console.error("Get Lab Request Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch lab request",
      error: err.message
    });
  }
};

// ========================
// GET Lab Requests by Consultation
// ========================
const getLabRequestsByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const labRequests = await LabRequest.getByConsultation(consultationId);

    res.json({
      status: "success",
      data: labRequests,
      total: labRequests.length
    });
  } catch (err) {
    console.error("Get Lab Requests by Consultation Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch lab requests",
      error: err.message
    });
  }
};

// ========================
// GET Lab Requests by Patient
// ========================
const getPatientLabHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const labRequests = await LabRequest.getByPatient(patientId);

    res.json({
      status: "success",
      data: labRequests,
      total: labRequests.length
    });
  } catch (err) {
    console.error("Get Patient Lab History Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch patient lab history",
      error: err.message
    });
  }
};

// ========================
// GET Pending Lab Requests
// ========================
const getPendingLabRequests = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const pending = await LabRequest.getPending(parseInt(limit));

    res.json({
      status: "success",
      message: "Pending lab requests",
      data: pending,
      total: pending.length
    });
  } catch (err) {
    console.error("Get Pending Lab Requests Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch pending requests",
      error: err.message
    });
  }
};

// ========================
// SEARCH Lab Requests
// ========================
const searchLabRequests = async (req, res) => {
  try {
    const {
      consultation_id,
      patient_id,
      test_type,
      status,
      test_name,
      start_date,
      end_date,
      page = 1,
      limit = 20
    } = req.query;

    const filters = {};
    if (consultation_id) filters.consultation_id = consultation_id;
    if (patient_id) filters.patient_id = patient_id;
    if (test_type) filters.test_type = test_type;
    if (status) filters.status = status;
    if (test_name) filters.test_name = test_name;
    if (start_date && end_date) {
      filters.start_date = start_date;
      filters.end_date = end_date;
    }

    const offset = (page - 1) * limit;

    const result = await LabRequest.search(filters, parseInt(limit), parseInt(offset));

    res.json({
      status: "success",
      data: result.labRequests,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: result.pages
      }
    });
  } catch (err) {
    console.error("Search Lab Requests Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to search lab requests",
      error: err.message
    });
  }
};

// ========================
// GET Lab Statistics
// ========================
const getLabStatistics = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        status: "error",
        message: "start_date and end_date are required"
      });
    }

    const stats = await LabRequest.getStats(start_date, end_date);

    const completionRate = stats.total > 0
      ? ((stats.completed / stats.total) * 100).toFixed(2)
      : 0;

    res.json({
      status: "success",
      period: { start_date, end_date },
      statistics: {
        total_requests: stats.total,
        completed: stats.completed,
        cancelled: stats.cancelled,
        processing: stats.processing,
        requested: stats.requested,
        completion_rate: `${completionRate}%`
      }
    });
  } catch (err) {
    console.error("Get Lab Statistics Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch statistics",
      error: err.message
    });
  }
};

// ========================
// MARK Sample Collected
// ========================
const markSampleCollected = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await LabRequest.markSampleCollected(id);

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.json({
      status: "success",
      message: "Sample marked as collected",
      data: updated
    });
  } catch (err) {
    console.error("Mark Sample Collected Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to mark sample as collected",
      error: err.message
    });
  }
};

// ========================
// MARK Processing
// ========================
const markProcessing = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await LabRequest.markProcessing(id);

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.json({
      status: "success",
      message: "Lab request marked as processing",
      data: updated
    });
  } catch (err) {
    console.error("Mark Processing Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to mark as processing",
      error: err.message
    });
  }
};

// ========================
// COMPLETE Lab Request
// ========================
const completeLabRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, result_unit, normal_range } = req.body;

    // Validate required fields
    if (!result || !result_unit) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        details: "result and result_unit are required"
      });
    }

    const completed = await LabRequest.completeWithResults(id, {
      result,
      result_unit,
      normal_range: normal_range || null,
      completed_by: req.user.id
    });

    if (!completed) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.json({
      status: "success",
      message: "Lab request completed with results",
      data: completed
    });
  } catch (err) {
    console.error("Complete Lab Request Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to complete lab request",
      error: err.message
    });
  }
};

// ========================
// UPDATE Lab Request
// ========================
const updateLabRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, result, result_unit, normal_range } = req.body;

    const updated = await LabRequest.update(id, {
      status,
      result,
      result_unit,
      normal_range
    });

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.json({
      status: "success",
      message: "Lab request updated successfully",
      data: updated
    });
  } catch (err) {
    console.error("Update Lab Request Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to update lab request",
      error: err.message
    });
  }
};

// ========================
// CANCEL Lab Request
// ========================
const cancelLabRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const cancelled = await LabRequest.cancel(id);

    if (!cancelled) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.json({
      status: "success",
      message: "Lab request cancelled successfully",
      data: cancelled
    });
  } catch (err) {
    console.error("Cancel Lab Request Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to cancel lab request",
      error: err.message
    });
  }
};

// ========================
// DELETE Lab Request
// ========================
const deleteLabRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LabRequest.delete(id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Lab request not found"
      });
    }

    res.status(204).json({
      status: "success",
      message: "Lab request deleted successfully"
    });
  } catch (err) {
    console.error("Delete Lab Request Error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete lab request",
      error: err.message
    });
  }
};

module.exports = {
  createLabRequest,
  getLabRequest,
  getLabRequestsByConsultation,
  getPatientLabHistory,
  getPendingLabRequests,
  searchLabRequests,
  getLabStatistics,
  markSampleCollected,
  markProcessing,
  completeLabRequest,
  updateLabRequest,
  cancelLabRequest,
  deleteLabRequest
};
