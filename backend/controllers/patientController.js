const Patient = require("../models/patientModel");

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json({
      status: "success",
      results: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get All Patients Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      status: "success",
      patient,
    });
  } catch (error) {
    console.error("Get Patient Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching patient", error: error.message });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Please provide a search term (q)" });
    }

    const patients = await Patient.search(q);
    res.status(200).json({
      status: "success",
      results: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Search Patients Error:", error);
    res
      .status(500)
      .json({ message: "Error searching patients", error: error.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    // Generate unique patient ID if not provided (Format: P-YYYYMMDD-XXXX)
    // For simplicity, using a random string or time based in frontend or here if not provided.
    // Ideally user inputs it or system generates it. Let's assume frontend sends it or we generate simple one.
    if (!req.body.patient_id) {
      req.body.patient_id = "P" + Date.now().toString().slice(-6);
    }

    // Set creator from verified token
    req.body.created_by = req.user.id;

    const newPatient = await Patient.create(req.body);

    res.status(201).json({
      status: "success",
      patient: newPatient,
    });
  } catch (error) {
    console.error("Create Patient Error:", error);
    // Handle duplicate entry error (MySQL error code 1062)
    if (error.code === "ER_DUP_ENTRY") {
      // Extract which field is duplicate from error message
      let duplicateField = "ID, email or phone";
      if (error.sqlMessage) {
        if (error.sqlMessage.includes("email")) {
          duplicateField = "email address";
        } else if (error.sqlMessage.includes("phone")) {
          duplicateField = "phone number";
        } else if (error.sqlMessage.includes("patient_id")) {
          duplicateField = "patient ID";
        }
      }
      return res.status(400).json({
        message: `A patient with this ${duplicateField} already exists. Please use a different ${duplicateField}.`,
      });
    }
    res
      .status(500)
      .json({ message: "Error creating patient", error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.update(req.params.id, req.body);

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      status: "success",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Update Patient Error:", error);
    // Handle duplicate entry error (MySQL error code 1062)
    if (error.code === "ER_DUP_ENTRY") {
      // Extract which field is duplicate from error message
      let duplicateField = "email or phone";
      if (error.sqlMessage) {
        if (error.sqlMessage.includes("email")) {
          duplicateField = "email address";
        } else if (error.sqlMessage.includes("phone")) {
          duplicateField = "phone number";
        }
      }
      return res.status(400).json({
        message: `A patient with this ${duplicateField} already exists. Please use a different ${duplicateField}.`,
      });
    }
    res
      .status(500)
      .json({ message: "Error updating patient", error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const success = await Patient.delete(req.params.id);

    if (!success) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Delete Patient Error:", error);
    res
      .status(500)
      .json({ message: "Error deleting patient", error: error.message });
  }
};


/**
 * Get patient medical history
 * GET /api/patients/:id/medical-history
 */
exports.getPatientMedicalHistory = async (req, res) => {
  const { id } = req.params;
  const db = require("../config/db");

  try {
    // Get previous consultations
    const consultationsQuery = `
      SELECT 
        c.id,
        c.symptoms,
        c.diagnosis,
        c.icd_code,
        c.notes,
        c.created_at as date,
        u.full_name as doctor_name
      FROM consultations c
      LEFT JOIN users u ON c.doctor_id = u.id
      WHERE c.patient_id = ? AND c.status = 'COMPLETED'
      ORDER BY c.created_at DESC
      LIMIT 10
    `;
    const previousConsultations = await db.query(consultationsQuery, [id]);

    // Get diagnoses
    const diagnosesQuery = `
      SELECT DISTINCT
        diagnosis,
        icd_code,
        created_at as date
      FROM consultations
      WHERE patient_id = ? AND diagnosis IS NOT NULL AND diagnosis != ''
      ORDER BY created_at DESC
      LIMIT 10
    `;
    const diagnoses = await db.query(diagnosesQuery, [id]);

    // Get lab results
    const labResultsQuery = `
      SELECT 
        lr.id,
        lr.test_name,
        lr.test_type,
        lr.status,
        lr.result,
        lr.result_unit,
        lr.normal_range,
        lr.completed_at as date
      FROM lab_requests lr
      INNER JOIN consultations c ON lr.consultation_id = c.id
      WHERE c.patient_id = ? AND lr.status = 'completed'
      ORDER BY lr.completed_at DESC
      LIMIT 20
    `;
    const labResults = await db.query(labResultsQuery, [id]);

    // Get prescriptions
    const prescriptionsQuery = `
      SELECT 
        p.id,
        p.drug_name,
        p.dosage,
        p.frequency,
        p.duration,
        p.instructions,
        p.status,
        p.created_at as date
      FROM prescriptions p
      INNER JOIN consultations c ON p.consultation_id = c.id
      WHERE c.patient_id = ?
      ORDER BY p.created_at DESC
      LIMIT 20
    `;
    const prescriptions = await db.query(prescriptionsQuery, [id]);

    // Get billing history
    const billingQuery = `
      SELECT 
        b.id,
        b.bill_number,
        b.total_amount as amount,
        b.payment_status as status,
        b.created_at as date
      FROM bills b
      WHERE b.patient_id = ?
      ORDER BY b.created_at DESC
      LIMIT 10
    `;
    const billingHistory = await db.query(billingQuery, [id]);

    // Get previous visits
    const visitsQuery = `
      SELECT 
        a.id,
        a.appointment_date as date,
        a.appointment_time as time,
        a.type as visit_type,
        a.status,
        u.full_name as doctor_name,
        u.specialization as department
      FROM appointments a
      LEFT JOIN users u ON a.doctor_id = u.id
      WHERE a.patient_id = ? AND a.status IN ('completed', 'checked_in')
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
      LIMIT 15
    `;
    const previousVisits = await db.query(visitsQuery, [id]);

    res.status(200).json({
      success: true,
      data: {
        previousConsultations,
        diagnoses,
        labResults,
        prescriptions,
        billingHistory,
        previousVisits,
      },
    });
  } catch (error) {
    console.error('Get Patient Medical History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medical history',
      error: error.message,
    });
  }
};
