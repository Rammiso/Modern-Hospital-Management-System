const express = require('express');
const router = express.Router();
const PrescriptionController = require('../controllers/prescription.controller');
const validateMiddleware = require('../middleware/validate.middleware');
const PrescriptionModel = require('../models/prescription.model');
const authMiddleware = require('../middleware/authMiddleware');

// Create Prescription (Requires Authentication)
router.post(
  '/', 
  authMiddleware.protect,
  validateMiddleware(PrescriptionModel.validationSchema),
  PrescriptionController.createPrescription
);

// Get Prescription by ID (Requires Authentication)
router.get(
  '/:id', 
  authMiddleware.protect,
  PrescriptionController.getPrescription
);

// Update Prescription (Requires Authentication – NO fork)
router.put(
  '/:id', 
  authMiddleware.protect,
  validateMiddleware(PrescriptionModel.validationSchema),
  PrescriptionController.updatePrescription
);

// Dispense Prescription (Requires Authentication)
router.patch(
  '/:id/dispense', 
  authMiddleware.protect,
  PrescriptionController.dispensePrescription
);

// Cancel Prescription (Requires Authentication)
router.patch(
  '/:id/cancel', 
  authMiddleware.protect,
  PrescriptionController.cancelPrescription
);

// Search Prescriptions (Requires Authentication)
router.get(
  '/search', 
  authMiddleware.protect,
  PrescriptionController.searchPrescriptions
);

module.exports = router;
