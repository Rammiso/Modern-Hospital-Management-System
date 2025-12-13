const pharmacyService = require('../services/pharmacyService');

/**
 * Create pharmacy billing record
 */
exports.createPharmacyBilling = async (req, res) => {
  try {
    const { prescription_id, patient_id, total_amount, payment_status, payment_method } = req.body;

    // Validation
    if (!prescription_id || !patient_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: prescription_id, patient_id, total_amount'
      });
    }

    const pharmacyBilling = await pharmacyService.createPharmacyBilling({
      prescription_id,
      patient_id,
      total_amount,
      payment_status: payment_status || 'pending',
      payment_method: payment_method || null,
      dispensed_by: req.user.user_id
    });

    res.status(201).json({
      success: true,
      message: 'Pharmacy billing created successfully',
      data: pharmacyBilling
    });
  } catch (error) {
    console.error('Error creating pharmacy billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pharmacy billing',
      error: error.message
    });
  }
};

/**
 * Get pharmacy billing by ID
 */
exports.getPharmacyBillingById = async (req, res) => {
  try {
    const { id } = req.params;

    const pharmacyBilling = await pharmacyService.getPharmacyBillingById(id);

    if (!pharmacyBilling) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy billing not found'
      });
    }

    res.json({
      success: true,
      data: pharmacyBilling
    });
  } catch (error) {
    console.error('Error fetching pharmacy billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacy billing',
      error: error.message
    });
  }
};

/**
 * Get pharmacy billing by prescription ID
 */
exports.getPharmacyBillingByPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const pharmacyBilling = await pharmacyService.getPharmacyBillingByPrescription(prescriptionId);

    if (!pharmacyBilling) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy billing not found for this prescription'
      });
    }

    res.json({
      success: true,
      data: pharmacyBilling
    });
  } catch (error) {
    console.error('Error fetching pharmacy billing by prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacy billing',
      error: error.message
    });
  }
};

/**
 * Get pharmacy billing by patient ID
 */
exports.getPharmacyBillingByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const pharmacyBillings = await pharmacyService.getPharmacyBillingByPatient(patientId);

    res.json({
      success: true,
      count: pharmacyBillings.length,
      data: pharmacyBillings
    });
  } catch (error) {
    console.error('Error fetching pharmacy billing by patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacy billing records',
      error: error.message
    });
  }
};

/**
 * Update pharmacy payment status
 */
exports.updatePharmacyPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method, transaction_id } = req.body;

    // Validation
    if (!payment_status || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: payment_status, payment_method'
      });
    }

    const pharmacyBilling = await pharmacyService.updatePharmacyPaymentStatus(id, {
      payment_status,
      payment_method,
      transaction_id
    });

    // Update prescription status if payment is completed
    if (payment_status === 'paid' && pharmacyBilling) {
      await pharmacyService.updatePrescriptionStatus(
        pharmacyBilling.prescription_id,
        'dispensed'
      );
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: pharmacyBilling
    });
  } catch (error) {
    console.error('Error updating pharmacy payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

/**
 * Get all pharmacy billing records with filters
 */
exports.getAllPharmacyBilling = async (req, res) => {
  try {
    const { payment_status, start_date, end_date } = req.query;

    const pharmacyBillings = await pharmacyService.getAllPharmacyBilling({
      payment_status,
      start_date,
      end_date
    });

    res.json({
      success: true,
      count: pharmacyBillings.length,
      data: pharmacyBillings
    });
  } catch (error) {
    console.error('Error fetching all pharmacy billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacy billing records',
      error: error.message
    });
  }
};

/**
 * Get pharmacy billing statistics
 */
exports.getPharmacyStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const stats = await pharmacyService.getPharmacyStats({
      start_date,
      end_date
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching pharmacy stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacy statistics',
      error: error.message
    });
  }
};
