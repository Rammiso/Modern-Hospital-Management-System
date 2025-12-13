const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const db = require("../config/db");

const LabRequest = {
  // Validation Schema
  validationSchema: Joi.object({
    consultation_id: Joi.string().required(),
    test_name: Joi.string().max(200).required().trim(),
    test_type: Joi.string()
      .valid('blood', 'urine', 'imaging', 'other')
      .default('blood'),
    instructions: Joi.string().optional().allow(null, ''),
    status: Joi.string()
      .valid('requested', 'sample_collected', 'processing', 'completed', 'cancelled')
      .default('requested'),
    result: Joi.string().optional().allow(null, ''),
    result_unit: Joi.string().optional().allow(null, ''),
    normal_range: Joi.string().optional().allow(null, ''),
    completed_by: Joi.string().optional().allow(null)
  }),

  // Create a new lab request
  create: async (data) => {
    try {
      const { consultation_id, test_name, test_type, instructions } = data;
      const labRequestId = uuidv4();

      await db.query(
        `INSERT INTO lab_requests (id, consultation_id, test_name, test_type, instructions, status)
         VALUES (?, ?, ?, ?, ?, 'requested')`,
        [labRequestId, consultation_id, test_name, test_type || 'blood', instructions || null]
      );

      return LabRequest.getById(labRequestId);
    } catch (error) {
      throw error;
    }
  },

  // Get a single lab request by id with related data
  getById: async (id) => {
    try {
      const result = await db.query(
        `SELECT lr.*, 
                c.patient_id,
                p.full_name as patient_name,
                u.full_name as completed_by_name
         FROM lab_requests lr
         LEFT JOIN consultations c ON lr.consultation_id = c.id
         LEFT JOIN patients p ON c.patient_id = p.id
         LEFT JOIN users u ON lr.completed_by = u.id
         WHERE lr.id = ?`,
        [id]
      );

      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // Get all lab requests for a consultation
  getByConsultation: async (consultationId) => {
    try {
      const result = await db.query(
        `SELECT lr.*, 
                u.full_name as completed_by_name
         FROM lab_requests lr
         LEFT JOIN users u ON lr.completed_by = u.id
         WHERE lr.consultation_id = ?
         ORDER BY lr.created_at DESC`,
        [consultationId]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get all lab requests for a patient
  getByPatient: async (patientId) => {
    try {
      const result = await db.query(
        `SELECT lr.*, 
                c.patient_id,
                u.full_name as completed_by_name
         FROM lab_requests lr
         LEFT JOIN consultations c ON lr.consultation_id = c.id
         LEFT JOIN users u ON lr.completed_by = u.id
         WHERE c.patient_id = ?
         ORDER BY lr.created_at DESC`,
        [patientId]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update lab request (status, result, completed_by, etc.)
  update: async (id, data) => {
    try {
      const { status, result, result_unit, normal_range, completed_by } = data;

      await db.query(
        `UPDATE lab_requests
         SET status = COALESCE(?, status),
             result = COALESCE(?, result),
             result_unit = COALESCE(?, result_unit),
             normal_range = COALESCE(?, normal_range),
             completed_by = COALESCE(?, completed_by),
             completed_at = CASE WHEN ? = 'completed' THEN NOW() ELSE completed_at END,
             updated_at = NOW()
         WHERE id = ?`,
        [status, result, result_unit, normal_range, completed_by, status, id]
      );

      return LabRequest.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // Update lab request status
  updateStatus: async (id, status) => {
    try {
      const completedAt = status === 'completed' ? new Date() : null;

      await db.query(
        `UPDATE lab_requests
         SET status = ?, 
             completed_at = CASE WHEN ? = 'completed' THEN NOW() ELSE completed_at END,
             updated_at = NOW()
         WHERE id = ?`,
        [status, status, id]
      );

      return LabRequest.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // Mark lab request as sample collected
  markSampleCollected: async (id) => {
    try {
      await db.query(
        `UPDATE lab_requests
         SET status = 'sample_collected', updated_at = NOW()
         WHERE id = ? AND status = 'requested'`,
        [id]
      );

      return LabRequest.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // Mark lab request as processing
  markProcessing: async (id) => {
    try {
      await db.query(
        `UPDATE lab_requests
         SET status = 'processing', updated_at = NOW()
         WHERE id = ? AND status = 'sample_collected'`,
        [id]
      );

      return LabRequest.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // Complete lab request with results
  completeWithResults: async (id, data) => {
    try {
      const { result, result_unit, normal_range, completed_by } = data;

      await db.query(
        `UPDATE lab_requests
         SET status = 'completed',
             result = ?,
             result_unit = ?,
             normal_range = ?,
             completed_by = ?,
             completed_at = NOW(),
             updated_at = NOW()
         WHERE id = ?`,
        [result, result_unit, normal_range, completed_by, id]
      );

      return LabRequest.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // Search lab requests with filters
  search: async (filters = {}, limit = 20, offset = 0) => {
    try {
      // Ensure limit and offset are integers
      limit = parseInt(limit) || 20;
      offset = parseInt(offset) || 0;

      let query = `SELECT lr.*, 
                          c.patient_id,
                          p.full_name as patient_name,
                          u.full_name as completed_by_name
                   FROM lab_requests lr
                   LEFT JOIN consultations c ON lr.consultation_id = c.id
                   LEFT JOIN patients p ON c.patient_id = p.id
                   LEFT JOIN users u ON lr.completed_by = u.id
                   WHERE 1=1`;
      const params = [];

      if (filters.consultation_id) {
        query += " AND lr.consultation_id = ?";
        params.push(filters.consultation_id);
      }

      if (filters.patient_id) {
        query += " AND c.patient_id = ?";
        params.push(filters.patient_id);
      }

      if (filters.test_type) {
        query += " AND lr.test_type = ?";
        params.push(filters.test_type);
      }

      if (filters.status) {
        query += " AND lr.status = ?";
        params.push(filters.status);
      }

      if (filters.test_name) {
        query += " AND lr.test_name LIKE ?";
        params.push(`%${filters.test_name}%`);
      }

      if (filters.start_date && filters.end_date) {
        query += " AND DATE(lr.created_at) BETWEEN ? AND ?";
        params.push(filters.start_date, filters.end_date);
      }

      // Count total
      const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
      const countResult = await db.query(countQuery, params);
      const total = countResult[0].total;

      // Add pagination and ordering
      // Use string interpolation for LIMIT and OFFSET since they're already validated integers
      // This avoids prepared statement issues with numeric parameters
      query += ` ORDER BY lr.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

      const labRequests = await db.query(query, params);

      return {
        labRequests,
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  },

  // Get pending lab requests
  getPending: async (limit = 50) => {
    try {
      const result = await db.query(
        `SELECT lr.*, 
                c.patient_id,
                p.full_name as patient_name
         FROM lab_requests lr
         LEFT JOIN consultations c ON lr.consultation_id = c.id
         LEFT JOIN patients p ON c.patient_id = p.id
         WHERE lr.status IN ('requested', 'sample_collected', 'processing')
         ORDER BY lr.created_at ASC
         LIMIT ?`,
        [limit]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get lab statistics
  getStats: async (startDate, endDate) => {
    try {
      const result = await db.query(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
           SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
           SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
           SUM(CASE WHEN status = 'requested' THEN 1 ELSE 0 END) as requested
         FROM lab_requests
         WHERE DATE(created_at) BETWEEN ? AND ?`,
        [startDate, endDate]
      );

      return result[0];
    } catch (error) {
      throw error;
    }
  },

  // Cancel lab request
  cancel: async (id) => {
    try {
      await db.query(
        `UPDATE lab_requests
         SET status = 'cancelled', updated_at = NOW()
         WHERE id = ? AND status != 'completed'`,
        [id]
      );

      return LabRequest.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete a lab request
  delete: async (id) => {
    try {
      const result = await db.query(
        `DELETE FROM lab_requests WHERE id = ?`,
        [id]
      );

      return result && result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = LabRequest;
