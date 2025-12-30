const express = require('express');
const router = express.Router();
const ConsultationController = require('../controllers/consultation.js');
const validateMiddleware = require('../middleware/validate.middleware');
const ConsultationModel = require('../models/consultation.model');
const authMiddleware = require('../middleware/authMiddleware.js');

// Protect all routes
router.use(authMiddleware.protect);

// ===========================
// WORKFLOW ENDPOINTS (NEW)
// ===========================

// Get ongoing consultations for doctor
router.get(
  '/ongoing',
  authMiddleware.authorize('doctor', 'admin'),
  ConsultationController.getOngoingConsultations
);

// Save consultation as draft (doctors only)
router.post(
  '/save-draft',
  authMiddleware.authorize('doctor', 'admin'),
  ConsultationController.saveDraft
);

// Send lab request and pause consultation (doctors only)
router.post(
  '/send-lab-request',
  authMiddleware.authorize('doctor', 'admin'),
  ConsultationController.sendLabRequest
);

// Finish consultation (complete workflow) (doctors only)
router.post(
  '/finish',
  authMiddleware.authorize('doctor', 'admin'),
  ConsultationController.finishConsultation
);

// ===========================
// STANDARD CRUD ENDPOINTS
// ===========================

// Create Consultation (doctors only)
router.post(
  '/',
  authMiddleware.authorize('doctor', 'admin'),
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
