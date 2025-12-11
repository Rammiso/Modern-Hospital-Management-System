// models/Appointment.js
const db = require("../config/db");

const Appointment = {
  // CREATE
  create: async (data) => {
    const { patientId, doctorId, slotStart, slotEnd } = data;

    return db.query(
      `INSERT INTO appointments 
       (patient_id, doctor_id, slot_start, slot_end)
       VALUES (?, ?, ?, ?)`,
      [patientId, doctorId, slotStart, slotEnd]
    );
  },

  // CHECK CONFLICT (doctor availability)
  checkConflict: async (doctorId, slotStart, slotEnd) => {
    return db.query(
      `SELECT * FROM appointments
       WHERE doctor_id = ?
       AND (
          (slot_start < ? AND slot_end > ?) OR
          (slot_start < ? AND slot_end > ?)
       )`,
      [doctorId, slotEnd, slotStart, slotStart, slotEnd]
    );
  },

  // GET ONE
  getById: async (id) => {
    return db.query(
      `SELECT * FROM appointments WHERE id = ?`,
      [id]
    );
  },

  // LIST (with filters)
  list: async (filters) => {
    let query = "SELECT * FROM appointments WHERE 1=1";
    const params = [];

    if (filters.doctorId) {
      query += " AND doctor_id = ?";
      params.push(filters.doctorId);
    }

    if (filters.date) {
      query += " AND DATE(slot_start) = ?";
      params.push(filters.date);
    }

    return db.query(query, params);
  },

  // UPDATE
  update: async (id, data) => {
    const { patientId, doctorId, slotStart, slotEnd, status } = data;

    return db.query(
      `UPDATE appointments
       SET patient_id = ?, doctor_id = ?, slot_start = ?, slot_end = ?, status = ?
       WHERE id = ?`,
      [patientId, doctorId, slotStart, slotEnd, status, id]
    );
  },

  // DELETE
  delete: async (id) => {
    return db.query(
      `DELETE FROM appointments WHERE id = ?`,
      [id]
    );
  },
};

module.exports = Appointment;