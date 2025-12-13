const db = require("../config/db");

const createAppointment = async (req, res) => {
  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    source,
    status,
  } = req.body;

  try {
    // Validate required fields
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        message:
          "Missing required fields: patient_id, doctor_id, appointment_date, appointment_time",
      });
    }

    // Check for overlapping appointments
    const conflict = await db.query(
      `SELECT * FROM appointments 
       WHERE doctor_id = ? 
       AND appointment_date = ? 
       AND appointment_time = ?
       AND status NOT IN ('cancelled', 'completed')`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (conflict.length > 0) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    // Insert appointment
    const result = await db.query(
      `INSERT INTO appointments 
       (patient_id, doctor_id, appointment_date, appointment_time, status, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status || "scheduled",
      ]
    );

    res.status(201).json({
      status: "success",
      message: "Appointment booked successfully",
      appointment: {
        id: result.insertId,
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: status || "CONFIRMED",
      },
    });
  } catch (err) {
    console.error("Create Appointment Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        a.*,
        p.full_name AS patient_name,
        d.full_name AS doctor_name,
        p.date_of_birth,
        p.gender,
        p.phone,
        p.email AS patient_email
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `;

    const rows = await db.query(query, [id]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Appointment not found" });

    // Structure the response to include patient data separately for consultation form
    const appointment = rows[0];
    const response = {
      ...appointment,
      patient: {
        id: appointment.patient_id,
        full_name: appointment.patient_name,
        date_of_birth: appointment.date_of_birth,
        gender: appointment.gender,
        phone: appointment.phone,
        email: appointment.patient_email,
      },
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const listAppointments = async (req, res) => {
  const { doctorId, date } = req.query;
  try {
    let query = `
      SELECT 
        a.*,
        p.full_name AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (doctorId) {
      query += " AND a.doctor_id = ?";
      params.push(doctorId);
    }
    if (date) {
      query += " AND DATE(a.appointment_date) = ?";
      params.push(date);
    }

    query += " ORDER BY a.appointment_date DESC, a.appointment_time DESC";

    const rows = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get available time slots for a doctor on a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({
        message: "doctor_id and date are required query parameters",
      });
    }

    // Get all booked appointments for this doctor on this date
    const bookedSlots = await db.query(
      `
      SELECT appointment_time 
      FROM appointments 
      WHERE doctor_id = ? 
      AND appointment_date = ?
      AND status NOT IN ('cancelled', 'completed')
      `,
      [doctor_id, date]
    );

    // Generate time slots from 9 AM to 5 PM (30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00`;
        allSlots.push({ time });
      }
    }

    // Filter out booked slots
    const bookedTimes = bookedSlots.map((slot) => slot.appointment_time);
    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot.time)
    );

    res.status(200).json({
      status: "success",
      results: availableSlots.length,
      slots: availableSlots,
    });
  } catch (error) {
    console.error("Get Available Slots Error:", error);
    res.status(500).json({
      message: "Error fetching available slots",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointment,
  listAppointments,
  getAvailableSlots,
};


/**
 * Get or create consultation for appointment
 * GET /api/appointments/:id/consultation-or-create
 */
const getOrCreateConsultation = async (req, res) => {
  const { id } = req.params;
  
  try {
    // First, get the appointment with patient data
    const appointmentQuery = `
      SELECT 
        a.*,
        p.id as patient_id,
        p.patient_id as patient_mrn,
        p.full_name as patient_name,
        p.date_of_birth,
        p.gender,
        p.phone,
        p.email as patient_email,
        p.allergies,
        d.full_name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `;

    const appointments = await db.query(appointmentQuery, [id]);

    if (appointments.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      });
    }

    const appointment = appointments[0];

    // Check if consultation already exists
    const consultationQuery = `
      SELECT c.*
      FROM consultations c
      WHERE c.appointment_id = ?
    `;

    const consultations = await db.query(consultationQuery, [id]);

    let consultation;
    if (consultations.length > 0) {
      // Consultation exists, get prescriptions and lab requests separately
      consultation = consultations[0];
      
      // Get prescriptions
      const prescriptions = await db.query(
        'SELECT * FROM prescriptions WHERE consultation_id = ?',
        [consultation.id]
      );
      consultation.prescriptions = prescriptions || [];
      
      // Get lab requests
      const labRequests = await db.query(
        'SELECT * FROM lab_requests WHERE consultation_id = ?',
        [consultation.id]
      );
      consultation.lab_requests = labRequests || [];
    } else {
      // Create new consultation with DRAFT status
      const createResult = await db.query(
        `INSERT INTO consultations (
          id, appointment_id, patient_id, doctor_id, status, created_at, updated_at
        ) VALUES (UUID(), ?, ?, ?, 'DRAFT', NOW(), NOW())`,
        [id, appointment.patient_id, appointment.doctor_id]
      );

      // Get the created consultation
      const newConsultations = await db.query(
        'SELECT * FROM consultations WHERE appointment_id = ? ORDER BY created_at DESC LIMIT 1',
        [id]
      );
      
      consultation = newConsultations[0];
      consultation.prescriptions = [];
      consultation.lab_requests = [];
    }

    // Structure the response
    const response = {
      success: true,
      data: {
        ...consultation,
        appointment: {
          id: appointment.id,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          type: appointment.type,
          status: appointment.status,
        },
        patient: {
          id: appointment.patient_id,
          patient_id: appointment.patient_mrn,
          full_name: appointment.patient_name,
          date_of_birth: appointment.date_of_birth,
          gender: appointment.gender,
          phone: appointment.phone,
          email: appointment.patient_email,
          allergies: appointment.allergies,
        },
        vitals: {
          blood_pressure_systolic: consultation.blood_pressure_systolic,
          blood_pressure_diastolic: consultation.blood_pressure_diastolic,
          heart_rate: consultation.pulse_rate,
          temperature: consultation.temperature,
          height: consultation.height,
          weight: consultation.weight,
          spo2: consultation.spo2,
          bmi: consultation.bmi,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get or Create Consultation Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

module.exports = {
  createAppointment,
  getAppointment,
  listAppointments,
  getAvailableSlots,
  getOrCreateConsultation,
};
