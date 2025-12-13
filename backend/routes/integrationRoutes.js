const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/integration/consultation-billing
 * @desc    Process consultation completion with billing
 * @access  Doctor, Receptionist
 */
router.post(
  '/consultation-billing',
  authorizeRoles('doctor', 'receptionist'),
  integrationController.processConsultationBilling
);

/**
 * @route   POST /api/integration/prescription-billing
 * @desc    Process prescription dispensing with pharmacy billing
 * @access  Pharmacist
 */
router.post(
  '/prescription-billing',
  authorizeRoles('pharmacist'),
  integrationController.processPrescriptionBilling
);

/**
 * @route   GET /api/integration/patient/:patientId/billing-history
 * @desc    Get complete patient billing history (consultation + pharmacy)
 * @access  Doctor, Receptionist, Pharmacist
 */
router.get(
  '/patient/:patientId/billing-history',
  authorizeRoles('doctor', 'receptionist', 'pharmacist'),
  integrationController.getPatientBillingHistory
);

/**
 * @route   GET /api/integration/dashboard-stats
 * @desc    Get dashboard statistics for billing and pharmacy
 * @access  Admin, Receptionist
 */
router.get(
  '/dashboard-stats',
  authorizeRoles('admin', 'receptionist'),
  integrationController.getDashboardStats
);

/**
 * @route   POST /api/integration/process-payment
 * @desc    Process payment for existing billing record
 * @access  Receptionist, Pharmacist
 */
router.post(
  '/process-payment',
  authorizeRoles('receptionist', 'pharmacist'),
  integrationController.processPayment
);

module.exports = router;
