const db = require("../config/db");

const LabRequest = {
  // Create a new lab request
  create: async ({ consultationId, testName, testType, instructions }) => {
    return db.query(
      `INSERT INTO lab_requests (consultation_id, test_name, test_type, instructions)
       VALUES (?, ?, ?, ?)`,
      [consultationId, testName, testType || "blood", instructions || null]
    );
  },

  // Get all lab requests for a consultation
  getByConsultation: async (consultationId) => {
    return db.query(
      `SELECT * FROM lab_requests WHERE consultation_id = ? ORDER BY created_at DESC`,
      [consultationId]
    );
  },

  // Update lab request (status, result, completed_by, etc.)
  update: async (id, { status, result, resultUnit, normalRange, completedAt, completedBy }) => {
    return db.query(
      `UPDATE lab_requests
       SET status = ?, result = ?, result_unit = ?, normal_range = ?, completed_at = ?, completed_by = ?
       WHERE id = ?`,
      [status, result, resultUnit, normalRange, completedAt, completedBy, id]
    );
  },

  // Get a single lab request by id
  getById: async (id) => {
    return db.query(`SELECT * FROM lab_requests WHERE id = ?`, [id]);
  },

  // Delete a lab request
  delete: async (id) => {
    return db.query(`DELETE FROM lab_requests WHERE id = ?`, [id]);
  },
};

module.exports = LabRequest;
