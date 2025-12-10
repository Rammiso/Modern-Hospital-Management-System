const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/db');

class ConsultationModel {
  constructor() {
    this.tableName = 'consultations';
  }

  // Comprehensive Validation Schema
  static validationSchema = Joi.object({
    appointment_id: Joi.string().required(),
    patient_id: Joi.string().required(),
    doctor_id: Joi.string().required(),
    
    // Vitals
    blood_pressure_systolic: Joi.number()
      .integer()
      .min(70)
      .max(250)
      .optional()
      .allow(null),
    blood_pressure_diastolic: Joi.number()
      .integer()
      .min(40)
      .max(150)
      .optional()
      .allow(null),
    temperature: Joi.number()
      .precision(2)
      .min(35)
      .max(42)
      .optional()
      .allow(null),
    pulse_rate: Joi.number()
      .integer()
      .min(40)
      .max(220)
      .optional()
      .allow(null),
    respiratory_rate: Joi.number()
      .integer()
      .min(10)
      .max(60)
      .optional()
      .allow(null),
    weight: Joi.number()
      .precision(2)
      .min(1)
      .max(500)
      .optional()
      .allow(null),
    height: Joi.number()
      .precision(2)
      .min(50)
      .max(250)
      .optional()
      .allow(null),
    bmi: Joi.number()
      .precision(2)
      .min(10)
      .max(70)
      .optional()
      .allow(null),
    spo2: Joi.number()
      .precision(2)
      .min(70)
      .max(100)
      .optional()
      .allow(null),
    
    // Clinical Information
    symptoms: Joi.string().optional().allow(null, ''),
    diagnosis: Joi.string().optional().allow(null, ''),
    notes: Joi.string().optional().allow(null, ''),
    
    // Follow-up
    follow_up_date: Joi.date().iso().optional().allow(null),
    follow_up_notes: Joi.string().optional().allow(null, '')
  });

  // Create Consultation
  async create(consultationData) {
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO ${this.tableName} (
          id, 
          appointment_id, 
          patient_id, 
          doctor_id, 
          blood_pressure_systolic,
          blood_pressure_diastolic,
          temperature,
          pulse_rate,
          respiratory_rate,
          weight,
          height,
          bmi,
          spo2,
          symptoms,
          diagnosis,
          notes,
          follow_up_date,
          follow_up_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          consultationData.appointment_id,
          consultationData.patient_id,
          consultationData.doctor_id,
          consultationData.blood_pressure_systolic || null,
          consultationData.blood_pressure_diastolic || null,
          consultationData.temperature || null,
          consultationData.pulse_rate || null,
          consultationData.respiratory_rate || null,
          consultationData.weight || null,
          consultationData.height || null,
          consultationData.bmi || null,
          consultationData.spo2 || null,
          consultationData.symptoms || null,
          consultationData.diagnosis || null,
          consultationData.notes || null,
          consultationData.follow_up_date || null,
          consultationData.follow_up_notes || null
        ]
      );

      await connection.commit();

      return {
        id: uuidv4(),
        ...consultationData
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Find Consultation by ID
  async findById(consultationId) {
    const connection = await database.getConnection();
    try {
      const [consultations] = await connection.execute(
        `SELECT c.*, 
                p.full_name as patient_name, 
                u.full_name as doctor_name,
                a.appointment_date
         FROM ${this.tableName} c
         LEFT JOIN patients p ON c.patient_id = p.id
         LEFT JOIN users u ON c.doctor_id = u.id
         LEFT JOIN appointments a ON c.appointment_id = a.id
         WHERE c.id = ?`,
        [consultationId]
      );

      return consultations[0] || null;
    } finally {
      connection.release();
    }
  }

  // Update Consultation
  async update(consultationId, updateData) {
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

      const updateValues = [
        ...Object.keys(updateData)
          .filter(key => updateData[key] !== undefined)
          .map(key => updateData[key]),
        consultationId
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

  // Search Consultations
  async search(filters = {}, limit = 20, offset = 0) {
    const connection = await database.getConnection();
    try {
      // Dynamic where clause based on filters
      const whereConditions = [];
      const queryParams = [];

      if (filters.patient_id) {
        whereConditions.push('c.patient_id = ?');
        queryParams.push(filters.patient_id);
      }

      if (filters.doctor_id) {
        whereConditions.push('c.doctor_id = ?');
        queryParams.push(filters.doctor_id);
      }

      if (filters.start_date && filters.end_date) {
        whereConditions.push('c.created_at BETWEEN ? AND ?');
        queryParams.push(filters.start_date, filters.end_date);
      }

      const whereClause = whereConditions.length 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Fetch consultations
      const [consultations] = await connection.execute(
        `SELECT c.id, 
                c.patient_id, 
                c.doctor_id, 
                c.created_at, 
                c.diagnosis,
                p.full_name as patient_name, 
                u.full_name as doctor_name
         FROM ${this.tableName} c
         LEFT JOIN patients p ON c.patient_id = p.id
         LEFT JOIN users u ON c.doctor_id = u.id
         ${whereClause}
         ORDER BY c.created_at DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      // Count total
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total 
         FROM ${this.tableName} c
         ${whereClause}`,
        queryParams
      );

      return {
        consultations,
        total: countResult[0].total,
        limit,
        offset
      };
    } finally {
      connection.release();
    }
  }

  // Calculate BMI
  calculateBMI(weight, height) {
    if (!weight || !height) return null;
    
    // Convert height to meters if in cm
    const heightInMeters = height > 3 ? height / 100 : height;
    
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  // Validate Vitals
  validateVitals(vitalData) {
    const errors = [];

    // Blood Pressure Validation
    if (vitalData.blood_pressure_systolic && vitalData.blood_pressure_diastolic) {
      if (vitalData.blood_pressure_systolic < vitalData.blood_pressure_diastolic) {
        errors.push('Systolic blood pressure must be higher than diastolic');
      }
    }

    // Temperature Validation
    if (vitalData.temperature && (vitalData.temperature < 35 || vitalData.temperature > 42)) {
      errors.push('Temperature must be between 35°C and 42°C');
    }

    // Pulse Rate Validation
    if (vitalData.pulse_rate && (vitalData.pulse_rate < 40 || vitalData.pulse_rate > 220)) {
      errors.push('Pulse rate must be between 40 and 220 bpm');
    }

    // SpO2 Validation
    if (vitalData.spo2 && (vitalData.spo2 < 70 || vitalData.spo2 > 100)) {
      errors.push('Oxygen saturation must be between 70% and 100%');
    }

    return errors;
  }
}

module.exports = new ConsultationModel();