const LabRequest = require("../models/labRequestModel");

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
  const { status, result, resultUnit, normalRange, completedAt, completedBy } = req.body;

  try {
    await LabRequest.update(id, { status, result, resultUnit, normalRange, completedAt, completedBy });
    res.json({ message: "Lab request updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single lab request
const getLabRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await LabRequest.getById(id);
    if (rows.length === 0) return res.status(404).json({ message: "Lab request not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
