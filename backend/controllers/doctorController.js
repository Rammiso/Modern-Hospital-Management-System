const db = require("../config/db");

// Get all doctors (users with role 'doctor')
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await db.query(
      `
      SELECT u.id as doctor_id, u.full_name as name, u.specialization, u.phone, u.email
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE LOWER(r.role_name) = 'doctor'
      AND u.is_active = 1
      ORDER BY u.full_name
      `
    );

    res.status(200).json({
      status: "success",
      results: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctors = await db.query(
      `
      SELECT u.id as doctor_id, u.full_name as name, u.specialization, u.phone, u.email
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE LOWER(r.role_name) = 'doctor'
      AND u.id = ?
      `,
      [req.params.id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      status: "success",
      doctor: doctors[0],
    });
  } catch (error) {
    console.error("Get Doctor Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctor", error: error.message });
  }
};
