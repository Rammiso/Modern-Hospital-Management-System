const express = require('express');
const router = express.Router();
const { PatientModel, patientModel } = require('../models/patient.model');
const validateMiddleware = require('../middleware/validate.middleware');
const PatientController = require('../controllers/patient.controller');

// Create patient
router.post(
  '/',
  validateMiddleware(PatientModel.validationSchema), // use the class here
  PatientController.createPatient
);


//get all patients


router.get('/', PatientController.getAllPatients);

// Update patient
router.put(
  '/:id',
  validateMiddleware(PatientModel.validationSchema), // use class or separate updateSchema if added
  PatientController.updatePatient
);

module.exports = router;


// Get patient
router.get(
  '/:id',
  PatientController.getPatient
);

// Delete patient
router.delete(
  '/:id',
  PatientController.deletePatient
);

// Search Patients (Requires Authentication)
router.get(
  '/search', 

  PatientController.searchPatients
);

module.exports = router;