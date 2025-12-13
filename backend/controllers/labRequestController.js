const LabRequest = require("../models/labRequestModel");

// Get all lab requests with filters
const getAllLabRequests = async (req, res) => {
  try {
    const { status, test_type, start_date, end_date, limit, offset } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (test_type) filters.test_type = test_type;
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    // Parse limit and offset with defaults
    const parsedLimit = limit ? parseInt(limit) : 50;
    const parsedOffset = offset ? parseInt(offset) : 0;

    const result = await LabRequest.search(filters, parsedLimit, parsedOffset);
    
    res.json({
      success: true,
      data: result.labRequests,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      pages: result.pages
    });
  } catch (err) {
    console.error("Get all lab requests error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Create a new lab request
const createLabRequest = async (req, res) => {
  const { consultationId, testName, testType, instructions } = req.body;

  try {
    await LabRequest.create({ consultationId, testName, testType, instructions });
    res.status(201).json({ message: "Lab request created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all lab requests for a consultation
const getLabRequestsByConsultation = async (req, res) => {
  const { consultationId } = req.params;

  try {
    const [rows] = await LabRequest.getByConsultation(consultationId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update lab request (status, result, completed_by, etc.)
const updateLabRequest = async (req, res) => {
  const { id } = req.params;
  const { status, result, result_unit, normal_range, completed_by } = req.body;

  try {
    console.log("📝 Updating lab request:", id);
    console.log("📊 Update data:", { status, result, result_unit, normal_range, completed_by });
    
    const updateData = {
      status,
      result,
      result_unit,
      normal_range,
      completed_by
    };
    
    const updatedRequest = await LabRequest.update(id, updateData);
    console.log("✅ Lab request updated successfully");
    
    res.json({ 
      success: true,
      message: "Lab request updated successfully",
      data: updatedRequest
    });
  } catch (err) {
    console.error("❌ Update lab request error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Get a single lab request
const getLabRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const labRequest = await LabRequest.getById(id);
    if (!labRequest) {
      return res.status(404).json({ 
        success: false,
        message: "Lab request not found" 
      });
    }

    res.json({
      success: true,
      data: labRequest
    });
  } catch (err) {
    console.error("Get lab request error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Delete a lab request
const deleteLabRequest = async (req, res) => {
  const { id } = req.params;

  try {
    await LabRequest.delete(id);
    res.json({ message: "Lab request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createLabRequest,
  getLabRequestsByConsultation,
  updateLabRequest,
  getLabRequest,
  deleteLabRequest,
};


/**
 * Get lab request status (for polling)
 * GET /api/lab-requests/:id/status
 */
const getLabRequestStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const labRequest = await LabRequest.getById(id);
    if (!labRequest) {
      return res.status(404).json({ 
        success: false,
        message: "Lab request not found" 
      });
    }

    // If lab request is completed, update consultation status
    if (labRequest.status === 'completed') {
      const db = require("../config/db");
      await db.query(
        `UPDATE consultations SET 
          status = 'READY_FOR_REVIEW',
          updated_at = NOW()
         WHERE id = ?`,
        [labRequest.consultation_id]
      );
    }

    res.json({
      success: true,
      data: {
        id: labRequest.id,
        status: labRequest.status,
        result: labRequest.result,
        result_unit: labRequest.result_unit,
        normal_range: labRequest.normal_range,
        completed_at: labRequest.completed_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

module.exports = {
  getAllLabRequests,
  createLabRequest,
  getLabRequestsByConsultation,
  updateLabRequest,
  getLabRequest,
  deleteLabRequest,
  getLabRequestStatus,
};
