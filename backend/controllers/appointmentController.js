const db = require("../config/db");

const createAppointment = async (req, res) => {
  const { patientId, doctorId, slotStart, slotEnd } = req.body;

  try {
    // Check for overlapping slots
    const [conflict] = await db.query(
      "SELECT * FROM appointments WHERE doctor_id = ? AND ((slot_start < ? AND slot_end > ?) OR (slot_start < ? AND slot_end > ?))",
      [doctorId, slotEnd, slotStart, slotStart, slotEnd]
    );

    if (conflict.length > 0)
      return res
        .status(400)
        .json({ message: "Doctor not available at this time" });

    await db.query(
      "INSERT INTO appointments (patient_id, doctor_id, slot_start, slot_end) VALUES (?, ?, ?, ?)",
      [patientId, doctorId, slotStart, slotEnd]
    );

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const listAppointments = async (req, res) => {
  const { doctorId, date } = req.query;
  try {
    let query = "SELECT * FROM appointments WHERE 1=1";
    const params = [];

    if (doctorId) {
      query += " AND doctor_id = ?";
      params.push(doctorId);
    }
    if (date) {
      query += " AND DATE(slot_start) = ?";
      params.push(date);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createAppointment, getAppointment, listAppointments };
