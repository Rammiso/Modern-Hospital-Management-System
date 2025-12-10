const { pool } = require("../config/db");

const Patient = {
  // Find all patients
  findAll: async () => {
    // Adding limit for now, ideally pagination should be used
    const [rows] = await pool.execute(
      "SELECT * FROM patients ORDER BY created_at DESC LIMIT 100"
    );
    return rows;
  },

  // Find patient by ID
  findById: async (id) => {
    const [rows] = await pool.execute("SELECT * FROM patients WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  // Search patients
  search: async (term) => {
    const searchTerm = `%${term}%`;
    const [rows] = await pool.execute(
      `SELECT * FROM patients WHERE 
       full_name LIKE ? OR 
       phone LIKE ? OR 
       email LIKE ? OR 
       patient_id LIKE ? 
       LIMIT 20`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );
    return rows;
  },

  // Create new patient
  create: async (patientData) => {
    const {
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
      created_by,
    } = patientData;

    const [result] = await pool.execute(
      `INSERT INTO patients (
        patient_id, full_name, phone, email, date_of_birth, 
        gender, address, emergency_contact, blood_group, allergies, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        created_by,
      ]
    );

    // Fetch created patient to return
    const [rows] = await pool.execute(
      "SELECT * FROM patients WHERE patient_id = ?",
      [patient_id]
    );
    return rows[0];
  },

  // Update patient
  update: async (id, patientData) => {
    const {
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
      address,
      emergency_contact,
      blood_group,
      allergies,
    } = patientData;

    await pool.execute(
      `UPDATE patients SET 
       full_name = ?, phone = ?, email = ?, date_of_birth = ?, 
       gender = ?, address = ?, emergency_contact = ?, blood_group = ?, allergies = ?
       WHERE id = ?`,
      [
        full_name,
        phone,
        email,
        date_of_birth,
        gender,
        address,
        emergency_contact,
        blood_group,
        allergies,
        id,
      ]
    );

    return Patient.findById(id);
  },

  // Delete patient
  delete: async (id) => {
    const [result] = await pool.execute("DELETE FROM patients WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = Patient;
