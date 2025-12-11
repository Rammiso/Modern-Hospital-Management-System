const express = require('express');
const router = express.Router();
const ConsultationController = require('../controllers/consultation.controller');
const validateMiddleware = require('../middleware/validate.middleware');
const ConsultationModel = require('../models/consultation.model');
const authMiddleware = require('../middleware/authMiddleware.js');

// Protect all routes
// router.use(authMiddleware.protect);

// Create Consultation
router.post(
  '/',
  validateMiddleware(ConsultationModel.validationSchema),
  ConsultationController.createConsultation
);

// Get Consultation by ID
router.get(
  '/:id',
  ConsultationController.getConsultation
);

// Update Consultation (no fork – reuse base schema directly)
router.put(
  '/:id',
  validateMiddleware(ConsultationModel.validationSchema),
  ConsultationController.updateConsultation
);

// Delete Consultation
router.delete(
  '/:id',
  ConsultationController.deleteConsultation
);

// Search Consultations
router.get(
  '/search',
  
  ConsultationController.searchConsultations
);

// Get Consultations by Patient ID
router.get(
  '/patient/:patientId',
  
  ConsultationController.getPatientConsultations
);

// Get Consultations by Doctor ID
router.get(
  '/doctor/:doctorId',
  
  ConsultationController.getDoctorConsultations
);

// Create Follow-up Consultation
router.post(
  '/follow-up',
 
  validateMiddleware(ConsultationModel.validationSchema),
  ConsultationController.createFollowUpConsultation
);

// Get Consultation Statistics
router.get(
  '/stats',
  
  ConsultationController.getConsultationStatistics
);

// Export Medical Report
router.get(
  '/:id/report',
 
  ConsultationController.exportMedicalReport
);

module.exports = router;
