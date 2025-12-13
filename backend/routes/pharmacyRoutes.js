const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/pharmacy/billing
 * @desc    Create pharmacy billing record
 * @access  Pharmacist
 */
router.post(
  '/billing',
  authorizeRoles('pharmacist'),
  pharmacyController.createPharmacyBilling
);

/**
 * @route   GET /api/pharmacy/billing/:id
 * @desc    Get pharmacy billing by ID
 * @access  Pharmacist, Receptionist, Admin
 */
router.get(
  '/billing/:id',
  authorizeRoles('pharmacist', 'receptionist', 'admin'),
  pharmacyController.getPharmacyBillingById
);

/**
 * @route   GET /api/pharmacy/billing/prescription/:prescriptionId
 * @desc    Get pharmacy billing by prescription ID
 * @access  Pharmacist, Receptionist, Admin
 */
router.get(
  '/billing/prescription/:prescriptionId',
  authorizeRoles('pharmacist', 'receptionist', 'admin'),
  pharmacyController.getPharmacyBillingByPrescription
);

/**
 * @route   GET /api/pharmacy/billing/patient/:patientId
 * @desc    Get pharmacy billing by patient ID
 * @access  Pharmacist, Receptionist, Admin
 */
router.get(
  '/billing/patient/:patientId',
  authorizeRoles('pharmacist', 'receptionist', 'admin'),
  pharmacyController.getPharmacyBillingByPatient
);

/**
 * @route   PUT /api/pharmacy/billing/:id/payment
 * @desc    Update pharmacy payment status
 * @access  Pharmacist
 */
router.put(
  '/billing/:id/payment',
  authorizeRoles('pharmacist'),
  pharmacyController.updatePharmacyPaymentStatus
);

/**
 * @route   GET /api/pharmacy/billing
 * @desc    Get all pharmacy billing records with filters
 * @access  Pharmacist, Admin
 */
router.get(
  '/billing',
  authorizeRoles('pharmacist', 'admin'),
  pharmacyController.getAllPharmacyBilling
);

/**
 * @route   GET /api/pharmacy/stats/summary
 * @desc    Get pharmacy billing statistics
 * @access  Pharmacist, Admin
 */
router.get(
  '/stats/summary',
  authorizeRoles('pharmacist', 'admin'),
  pharmacyController.getPharmacyStats
);

module.exports = router;
