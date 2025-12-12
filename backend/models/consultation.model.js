const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const {pool} = require('../config/db');

class ConsultationModel {
  constructor() {
    this.tableName = 'consultations';

    // Instance-level validation schema (so controller can access it)
    this.validationSchema = Joi.object({
      appointment_id: Joi.string().required(),
      patient_id: Joi.string().required(),
      doctor_id: Joi.string().required(),

      blood_pressure_systolic: Joi.number().integer().min(75).max(250).optional().allow(null),
      blood_pressure_diastolic: Joi.number().integer().min(30).max(150).optional().allow(null),
      temperature: Joi.number().precision(2).min(35).max(42).optional().allow(null),
      pulse_rate: Joi.number().integer().min(40).max(220).optional().allow(null),
      respiratory_rate: Joi.number().integer().min(10).max(60).optional().allow(null),
      weight: Joi.number().precision(2).min(1).max(500).optional().allow(null),
      height: Joi.number().precision(2).min(0).max(250).optional().allow(null),
      bmi: Joi.number().precision(2).min(10).max(70).optional().allow(null),
      spo2: Joi.number().precision(2).min(70).max(100).optional().allow(null),

      symptoms: Joi.string().optional().allow(null, ''),
      diagnosis: Joi.string().optional().allow(null, ''),
      notes: Joi.string().optional().allow(null, ''),

      follow_up_date: Joi.date().iso().optional().allow(null),
      follow_up_notes: Joi.string().optional().allow(null, '')
    });
  }

  // Create Consultation
  async create(data) {
    const connection = await pool.getConnection();

    const newId = uuidv4(); // ← One UUID used everywhere

    try {
      await connection.beginTransaction();

      await connection.execute(
        `INSERT INTO ${this.tableName} (
          id, appointment_id, patient_id, doctor_id,
          blood_pressure_systolic, blood_pressure_diastolic,
          temperature, pulse_rate, respiratory_rate,
          weight, height, bmi, spo2,
          symptoms, diagnosis, notes,
          follow_up_date, follow_up_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId,
          data.appointment_id,
          data.patient_id,
          data.doctor_id,
          data.blood_pressure_systolic || null,
          data.blood_pressure_diastolic || null,
          data.temperature || null,
          data.pulse_rate || null,
          data.respiratory_rate || null,
          data.weight || null,
          data.height || null,
          data.bmi || null,
          data.spo2 || null,
          data.symptoms || null,
          data.diagnosis || null,
          data.notes || null,
          data.follow_up_date || null,
          data.follow_up_notes || null
        ]
      );

      await connection.commit();

      return {
        id: newId,
        ...data
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Find by ID
  async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT c.*, 
                p.full_name AS patient_name,
                u.full_name AS doctor_name,
                a.appointment_date
         FROM ${this.tableName} c
         LEFT JOIN patients p ON c.patient_id = p.id
         LEFT JOIN users u ON c.doctor_id = u.id
         LEFT JOIN appointments a ON c.appointment_id = a.id
         WHERE c.id = ?`,
        [id]
      );

      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Update
  async update(id, updateData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const keys = Object.keys(updateData).filter(k => updateData[k] !== undefined);

      if (keys.length === 0) return false;

      const updateFields = keys.map(k => `${k} = ?`).join(', ');
      const updateValues = keys.map(k => updateData[k]);

      updateValues.push(id);

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} SET ${updateFields} WHERE id = ?`,
        updateValues
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Search
  async search(filters = {}, limit = 20, offset = 0) {
    const connection = await pool.getConnection();
    try {
      const where = [];
      const params = [];

      if (filters.patient_id) {
        where.push('c.patient_id = ?');
        params.push(filters.patient_id);
      }

      if (filters.doctor_id) {
        where.push('c.doctor_id = ?');
        params.push(filters.doctor_id);
      }

      if (filters.start_date && filters.end_date) {
        where.push('c.created_at BETWEEN ? AND ?');
        params.push(filters.start_date, filters.end_date);
      }

      const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const [consultations] = await connection.execute(
        `SELECT c.id, c.patient_id, c.doctor_id, c.created_at, c.diagnosis,
                p.full_name AS patient_name,
                u.full_name AS doctor_name
         FROM ${this.tableName} c
         LEFT JOIN patients p ON c.patient_id = p.id
         LEFT JOIN users u ON c.doctor_id = u.id
         ${whereClause}
         ORDER BY c.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      const [countRows] = await connection.execute(
        `SELECT COUNT(*) AS total
         FROM ${this.tableName} c
         ${whereClause}`,
        params
      );

      return {
        consultations,
        total: countRows[0].total,
        limit,
        offset
      };
    } finally {
      connection.release();
    }
  }

  // BMI
  calculateBMI(weight, height) {
    if (!weight || !height) return null;
    const h = height > 3 ? height / 100 : height;
    return Number((weight / (h * h)).toFixed(2));
  }

  // Vitals Validation
  validateVitals(v) {
    const errors = [];

    if (v.blood_pressure_systolic && v.blood_pressure_diastolic) {
      if (v.blood_pressure_systolic < v.blood_pressure_diastolic) {
        errors.push('Systolic blood pressure must be higher than diastolic');
      }
    }

    if (v.temperature && (v.temperature < 35 || v.temperature > 42)) {
      errors.push('Temperature must be between 35°C and 42°C');
    }

    if (v.pulse_rate && (v.pulse_rate < 40 || v.pulse_rate > 220)) {
      errors.push('Pulse rate must be between 40 and 220 bpm');
    }

    if (v.spo2 && (v.spo2 < 60 || v.spo2 > 100)) {
      errors.push('Oxygen saturation must be between 70% and 100%');
    }

    return errors;
  }
}

module.exports =new ConsultationModel();
