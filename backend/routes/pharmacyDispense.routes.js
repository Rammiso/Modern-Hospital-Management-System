const express = require('express');
const router = express.Router();
const { 
  dispensePrescription, 
  getPendingPrescriptions,
  getDispensedPrescriptions,
  getPatientDispensationHistory
} = require('../controllers/pharmacyDispense');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get pending prescriptions
router.get(
  '/pending',
  protect,
  authorize('pharmacist', 'admin'),
  getPendingPrescriptions
);

// Get dispensed prescriptions history
router.get(
  '/dispensed',
  protect,
  authorize('pharmacist', 'admin'),
  getDispensedPrescriptions
);

// Get patient's dispensation history
router.get(
  '/patient/:patientId',
  protect,
  authorize('pharmacist', 'admin', 'doctor'),
  getPatientDispensationHistory
);

// Dispense prescription
router.post(
  '/dispense/:prescriptionId',
  protect,
  authorize('pharmacist', 'admin'),
  dispensePrescription
);

module.exports = router;
