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
      return res
        .status(400)
        .json({
          message: "Patient with this ID, email or phone already exists",
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
