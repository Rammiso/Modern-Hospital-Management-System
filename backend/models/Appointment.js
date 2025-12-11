// models/Appointment.js
const { v4: uuidv4 } = require('uuid');
const db = require("../config/db");
const Joi = require('joi');

const Appointment = {
  // Validation Schema
  validationSchema: Joi.object({
    patient_id: Joi.string().required(),
    doctor_id: Joi.string().required(),
    appointment_date: Joi.date().iso().required(),
    appointment_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    status: Joi.string()
      .valid('scheduled', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show')
      .default('scheduled'),
    type: Joi.string()
      .valid('new', 'follow_up', 'emergency')
      .default('new'),
    reason: Joi.string().optional().allow(null, ''),
    created_by: Joi.string().optional()
  }),

  // CREATE appointment
  create: async (data) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, status, type, reason, created_by } = data;

    try {
      const appointmentId = uuidv4();

      await db.query(
        `INSERT INTO appointments 
         (id, patient_id, doctor_id, appointment_date, appointment_time, status, type, reason, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [appointmentId, patient_id, doctor_id, appointment_date, appointment_time, status || 'scheduled', type || 'new', reason || null, created_by || null]
      );

      return Appointment.getById(appointmentId);
    } catch (error) {
      throw error;
    }
  },

  // CHECK CONFLICT (doctor availability)
  checkConflict: async (doctorId, appointmentDate, appointmentTime, excludeId = null) => {
    try {
      let query = `SELECT * FROM appointments
                   WHERE doctor_id = ?
                   AND appointment_date = ?
                   AND appointment_time = ?
                   AND status NOT IN ('cancelled', 'no_show')`;
      const params = [doctorId, appointmentDate, appointmentTime];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const result = await db.query(query, params);
      return result && result.length > 0;
    } catch (error) {
      throw error;
    }
  },

  // GET ONE appointment with patient and doctor details
  getById: async (id) => {
    try {
      const result = await db.query(
        `SELECT a.*, 
                p.full_name as patient_name, 
                p.phone as patient_phone,
                u.full_name as doctor_name, 
                u.specialization
         FROM appointments a
         LEFT JOIN patients p ON a.patient_id = p.id
         LEFT JOIN users u ON a.doctor_id = u.id
         WHERE a.id = ?`,
        [id]
      );
      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // LIST appointments (with filters and pagination)
  list: async (filters = {}, limit = 20, offset = 0) => {
    try {
      let query = `SELECT a.*, 
                          p.full_name as patient_name, 
                          u.full_name as doctor_name
                   FROM appointments a
                   LEFT JOIN patients p ON a.patient_id = p.id
                   LEFT JOIN users u ON a.doctor_id = u.id
                   WHERE 1=1`;
      const params = [];

      if (filters.doctor_id) {
        query += " AND a.doctor_id = ?";
        params.push(filters.doctor_id);
      }

      if (filters.patient_id) {
        query += " AND a.patient_id = ?";
        params.push(filters.patient_id);
      }

      if (filters.appointment_date) {
        query += " AND DATE(a.appointment_date) = ?";
        params.push(filters.appointment_date);
      }

      if (filters.status) {
        query += " AND a.status = ?";
        params.push(filters.status);
      }

      if (filters.type) {
        query += " AND a.type = ?";
        params.push(filters.type);
      }

      // Count total
      const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
      const countResult = await db.query(countQuery, params);
      const total = countResult[0].total;

      // Add pagination
      query += " ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      const appointments = await db.query(query, params);

      return {
        appointments,
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  },

  // GET appointments for a specific date range
  getByDateRange: async (doctorId, startDate, endDate) => {
    try {
      const result = await db.query(
        `SELECT a.*, 
                p.full_name as patient_name
         FROM appointments a
         LEFT JOIN patients p ON a.patient_id = p.id
         WHERE a.doctor_id = ?
         AND a.appointment_date BETWEEN ? AND ?
         AND a.status NOT IN ('cancelled', 'no_show')
         ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
        [doctorId, startDate, endDate]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // UPDATE appointment
  update: async (id, data) => {
    try {
      const { patient_id, doctor_id, appointment_date, appointment_time, status, type, reason } = data;

      await db.query(
        `UPDATE appointments
         SET patient_id = COALESCE(?, patient_id),
             doctor_id = COALESCE(?, doctor_id),
             appointment_date = COALESCE(?, appointment_date),
             appointment_time = COALESCE(?, appointment_time),
             status = COALESCE(?, status),
             type = COALESCE(?, type),
             reason = COALESCE(?, reason),
             updated_at = NOW()
         WHERE id = ?`,
        [patient_id, doctor_id, appointment_date, appointment_time, status, type, reason, id]
      );

      return Appointment.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // UPDATE appointment status
  updateStatus: async (id, status) => {
    try {
      await db.query(
        `UPDATE appointments
         SET status = ?, updated_at = NOW()
         WHERE id = ?`,
        [status, id]
      );

      return Appointment.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // DELETE appointment (soft delete or hard delete)
  delete: async (id) => {
    try {
      const result = await db.query(
        `DELETE FROM appointments WHERE id = ?`,
        [id]
      );
      return result && result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // CANCEL appointment
  cancel: async (id, reason = null) => {
    try {
      await db.query(
        `UPDATE appointments
         SET status = 'cancelled', reason = COALESCE(?, reason), updated_at = NOW()
         WHERE id = ?`,
        [reason, id]
      );

      return Appointment.getById(id);
    } catch (error) {
      throw error;
    }
  },

  // GET available slots for a doctor on a specific date
  getAvailableSlots: async (doctorId, appointmentDate, slotDuration = 30) => {
    try {
      // Get all booked appointments for the day
      const bookedSlots = await db.query(
        `SELECT appointment_time FROM appointments
         WHERE doctor_id = ?
         AND appointment_date = ?
         AND status NOT IN ('cancelled', 'no_show')
         ORDER BY appointment_time ASC`,
        [doctorId, appointmentDate]
      );

      // Generate available slots (assuming 9 AM to 5 PM)
      const availableSlots = [];
      const startHour = 9;
      const endHour = 17;
      const bookedTimes = bookedSlots.map(slot => slot.appointment_time);

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          if (!bookedTimes.includes(time)) {
            availableSlots.push(time);
          }
        }
      }

      return availableSlots;
    } catch (error) {
      throw error;
    }
  },

  // GET appointment statistics
  getStats: async (doctorId, startDate, endDate) => {
    try {
      const result = await db.query(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
           SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
           SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_show,
           SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled
         FROM appointments
         WHERE doctor_id = ?
         AND appointment_date BETWEEN ? AND ?`,
        [doctorId, startDate, endDate]
      );

      return result[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Appointment;