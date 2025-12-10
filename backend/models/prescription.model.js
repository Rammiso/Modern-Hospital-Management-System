const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/db');

class PrescriptionModel {
  constructor() {
    this.tableName = 'prescriptions';
  }

  // Validation Schema
  static validationSchema = Joi.object({
    consultation_id: Joi.string().required(),
    drug_name: Joi.string()
      .max(200)
      .required()
      .trim(),
    dosage: Joi.string()
      .max(100)
      .required()
      .trim(),
    frequency: Joi.string()
      .max(100)
      .required()
      .trim(),
    duration: Joi.string()
      .max(100)
      .required()
      .trim(),
    instructions: Joi.string()
      .allow(null, '')
      .optional(),
    status: Joi.string()
      .valid('pending', 'dispensed', 'cancelled')
      .default('pending'),
    dispensed_by: Joi.string()
      .allow(null)
      .optional()
  });

  // Create Prescription
  async create(prescriptionData) {
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO ${this.tableName} (
          id, 
          consultation_id, 
          drug_name, 
          dosage, 
          frequency, 
          duration, 
          instructions, 
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          prescriptionData.consultation_id,
          prescriptionData.drug_name,
          prescriptionData.dosage,
          prescriptionData.frequency,
          prescriptionData.duration,
          prescriptionData.instructions || null,
          prescriptionData.status || 'pending'
        ]
      );

      await connection.commit();

      return {
        id: result.insertId,
        ...prescriptionData
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Find Prescription by ID
  async findById(prescriptionId) {
    const connection = await database.getConnection();
    try {
      const [prescriptions] = await connection.execute(
        `SELECT p.*, 
                c.patient_id,
                pat.full_name as patient_name,
                u.full_name as dispensed_by_name
         FROM ${this.tableName} p
         LEFT JOIN consultations c ON p.consultation_id = c.id
         LEFT JOIN patients pat ON c.patient_id = pat.id
         LEFT JOIN users u ON p.dispensed_by = u.id
         WHERE p.id = ?`,
        [prescriptionId]
      );

      return prescriptions[0] || null;
    } finally {
      connection.release();
    }
  }

  // Update Prescription
  async update(prescriptionId, updateData) {
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();

      // Prepare update fields
      const updateFields = Object.keys(updateData)
        .filter(key => updateData[key] !== undefined)
        .map(key => `${key} = ?`)
        .join(', ');

      if (!updateFields) {
        return false;
      }

      // Special handling for dispensing
      if (updateData.status === 'dispensed') {
        updateData.dispensed_at = new Date();
      }

      const updateValues = [
        ...Object.keys(updateData)
          .filter(key => updateData[key] !== undefined)
          .map(key => updateData[key]),
        prescriptionId
      ];

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET ${updateFields} 
         WHERE id = ?`,
        updateValues
      );

      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Dispense Prescription
  async dispense(prescriptionId, userId) {
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET 
           status = 'dispensed', 
           dispensed_at = NOW(), 
           dispensed_by = ? 
         WHERE id = ? AND status = 'pending'`,
        [userId, prescriptionId]
      );

      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cancel Prescription
  async cancel(prescriptionId) {
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET status = 'cancelled' 
         WHERE id = ? AND status = 'pending'`,
        [prescriptionId]
      );

      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Search Prescriptions
  async search(filters = {}, limit = 20, offset = 0) {
    const connection = await database.getConnection();
    try {
      // Dynamic where clause based on filters
      const whereConditions = [];
      const queryParams = [];

      if (filters.consultation_id) {
        whereConditions.push('p.consultation_id = ?');
        queryParams.push(filters.consultation_id);
      }

      if (filters.patient_id) {
        whereConditions.push('c.patient_id = ?');
        queryParams.push(filters.patient_id);
      }

      if (filters.status) {
        whereConditions.push('p.status = ?');
        queryParams.push(filters.status);
      }

      if (filters.drug_name) {
        whereConditions.push('p.drug_name LIKE ?');
        queryParams.push(`%${filters.drug_name}%`);
      }

      const whereClause = whereConditions.length 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Fetch prescriptions
      const [prescriptions] = await connection.execute(
        `SELECT p.id, 
                p.consultation_id, 
                p.drug_name, 
                p.dosage, 
                p.frequency, 
                p.status,
                p.created_at,
                c.patient_id,
                pat.full_name as patient_name
         FROM ${this.tableName} p
         LEFT JOIN consultations c ON p.consultation_id = c.id
         LEFT JOIN patients pat ON c.patient_id = pat.id
         ${whereClause}
         ORDER BY p.created_at DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      // Count total
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total 
         FROM ${this.tableName} p
         LEFT JOIN consultations c ON p.consultation_id = c.id
         ${whereClause}`,
        queryParams
      );

      return {
        prescriptions,
        total: countResult[0].total,
        limit,
        offset
      };
    } finally {
      connection.release();
    }
  }
}

module.exports = new PrescriptionModel();