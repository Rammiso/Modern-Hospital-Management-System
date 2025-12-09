const Joi = require('joi');
const { transaction, query } = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');

class PatientModel {
  constructor() {
    this.tableName = 'patients';

    // instance schema
    this.validationSchema = Joi.object({
      patient_id: Joi.string().optional(),
      full_name: Joi.string().required().min(2).max(100),
      phone: Joi.string().pattern(/^[0-9]{10,20}$/).required(),
      email: Joi.string().email().allow(null, '').optional(),
      date_of_birth: Joi.date().iso().max('now').optional(),
      gender: Joi.string().valid('male', 'female', 'other').optional(),
      address: Joi.string().allow(null, '').optional(),
      emergency_contact: Joi.string().pattern(/^[0-9]{10,20}$/).allow(null, '').optional(),
      blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
      allergies: Joi.string().allow(null, '').optional(),
      created_by: Joi.string().optional()
    });
  }

  // static schema
  static validationSchema = Joi.object({
    patient_id: Joi.string().optional(),
    full_name: Joi.string().required().min(2).max(100),
    phone: Joi.string().pattern(/^[0-9]{10,20}$/).required(),
    email: Joi.string().email().allow(null, '').optional(),
    date_of_birth: Joi.date().iso().max('now').optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.string().allow(null, '').optional(),
    emergency_contact: Joi.string().pattern(/^[0-9]{10,20}$/).allow(null, '').optional(),
    blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
    allergies: Joi.string().allow(null, '').optional(),
    created_by: Joi.string().optional()
  });

  generatePatientId() {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `PT${year}${randomPart}`;
  }

  async create(patientData, userId) {
    const patientId = patientData.patient_id || this.generatePatientId();

    await transaction(
      `INSERT INTO ${this.tableName}
      (id, patient_id, full_name, phone, email, date_of_birth, gender, address,
      emergency_contact, blood_group, allergies, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        patientId,
        patientData.full_name,
        patientData.phone,
        patientData.email || null,
        patientData.date_of_birth || null,
        patientData.gender || null,
        patientData.address || null,
        patientData.emergency_contact || null,
        patientData.blood_group || null,
        patientData.allergies || null,
        userId || null
      ]
    );

    return { id: patientId, ...patientData };
  }
  //get all patinets

  async getAll(limit = 50, offset = 0) {
  const rows = await query(
    `SELECT 
      id,
      patient_id,
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
      address,
      emergency_contact,
      blood_group,
      allergies,
      created_by
     FROM ${this.tableName}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const count = await query(
    `SELECT COUNT(*) as total FROM ${this.tableName}`
  );

  return {
    patients: rows,
    total: count[0].total,
    limit,
    offset
  };
}


  async findById(identifier) {
    const rows = await query(
      `SELECT * FROM ${this.tableName} WHERE id = ? OR patient_id = ?`,
      [identifier, identifier]
    );
    return rows[0] || null;
  }

  async update(identifier, updateData) {
    const filtered = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    const keys = Object.keys(filtered);
    if (!keys.length) return false;

    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(filtered), identifier, identifier];

    const result = await query(
      `UPDATE ${this.tableName} SET ${fields} WHERE id = ? OR patient_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async delete(identifier) {
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE id = ? OR patient_id = ?`,
      [identifier, identifier]
    );
    return result.affectedRows > 0;
  }

  async search(text, limit = 20, offset = 0) {
    const q = `%${text}%`;

    const patients = await query(
      `SELECT id, patient_id, full_name, phone, email
       FROM ${this.tableName}
       WHERE full_name LIKE ? OR patient_id LIKE ? OR phone LIKE ?
       LIMIT ? OFFSET ?`,
      [q, q, q, limit, offset]
    );

    const count = await query(
      `SELECT COUNT(*) as total FROM ${this.tableName}
       WHERE full_name LIKE ? OR patient_id LIKE ? OR phone LIKE ?`,
      [q, q, q]
    );

    return {
      patients,
      total: count[0].total,
      limit,
      offset
    };
  }
}

module.exports = {
  PatientModel,
  patientModel: new PatientModel()
};
