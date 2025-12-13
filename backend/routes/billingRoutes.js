const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/billing
 * @desc    Create a new billing record
 * @access  Doctor, Receptionist
 */
router.post(
  '/',
  authorizeRoles('doctor', 'receptionist'),
  billingController.createBilling
);

/**
 * @route   GET /api/billing/:id
 * @desc    Get billing record by ID
 * @access  Doctor, Receptionist, Admin
 */
router.get(
  '/:id',
  authorizeRoles('doctor', 'receptionist', 'admin'),
  billingController.getBillingById
);

/**
 * @route   GET /api/billing/patient/:patientId
 * @desc    Get billing records by patient ID
 * @access  Doctor, Receptionist, Admin
 */
router.get(
  '/patient/:patientId',
  authorizeRoles('doctor', 'receptionist', 'admin'),
  billingController.getBillingByPatient
);

/**
 * @route   GET /api/billing/consultation/:consultationId
 * @desc    Get billing record by consultation ID
 * @access  Doctor, Receptionist, Admin
 */
router.get(
  '/consultation/:consultationId',
  authorizeRoles('doctor', 'receptionist', 'admin'),
  billingController.getBillingByConsultation
);

/**
 * @route   PUT /api/billing/:id/payment
 * @desc    Update billing payment status
 * @access  Receptionist
 */
router.put(
  '/:id/payment',
  authorizeRoles('receptionist'),
  billingController.updatePaymentStatus
);

/**
 * @route   GET /api/billing
 * @desc    Get all billing records with filters
 * @access  Receptionist, Admin
 */
router.get(
  '/',
  authorizeRoles('receptionist', 'admin'),
  billingController.getAllBilling
);

/**
 * @route   GET /api/billing/stats/summary
 * @desc    Get billing statistics
 * @access  Admin, Receptionist
 */
router.get(
  '/stats/summary',
  authorizeRoles('admin', 'receptionist'),
  billingController.getBillingStats
);

module.exports = router;
