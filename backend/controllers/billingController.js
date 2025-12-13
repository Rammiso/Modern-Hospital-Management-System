const billingService = require('../services/billingService');

/**
 * Create a new billing record
 */
exports.createBilling = async (req, res) => {
  try {
    const { patient_id, consultation_id, total_amount, payment_status, payment_method } = req.body;

    // Validation
    if (!patient_id || !consultation_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patient_id, consultation_id, total_amount'
      });
    }

    const billing = await billingService.createBilling({
      patient_id,
      consultation_id,
      total_amount,
      payment_status: payment_status || 'pending',
      payment_method: payment_method || null,
      created_by: req.user.user_id
    });

    res.status(201).json({
      success: true,
      message: 'Billing record created successfully',
      data: billing
    });
  } catch (error) {
    console.error('Error creating billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create billing record',
      error: error.message
    });
  }
};

/**
 * Get billing record by ID
 */
exports.getBillingById = async (req, res) => {
  try {
    const { id } = req.params;

    const billing = await billingService.getBillingById(id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    console.error('Error fetching billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch billing record',
      error: error.message
    });
  }
};

/**
 * Get billing records by patient ID
 */
exports.getBillingByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const billings = await billingService.getBillingByPatient(patientId);

    res.json({
      success: true,
      count: billings.length,
      data: billings
    });
  } catch (error) {
    console.error('Error fetching patient billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient billing records',
      error: error.message
    });
  }
};

/**
 * Get billing record by consultation ID
 */
exports.getBillingByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const billing = await billingService.getBillingByConsultation(consultationId);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found for this consultation'
      });
    }

    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    console.error('Error fetching consultation billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation billing',
      error: error.message
    });
  }
};

/**
 * Update billing payment status
 */
exports.updatePaymentStatus = async (req, res) => {
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

    const billing = await billingService.updatePaymentStatus(id, {
      payment_status,
      payment_method,
      transaction_id
    });

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: billing
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

/**
 * Get all billing records with filters
 */
exports.getAllBilling = async (req, res) => {
  try {
    const { payment_status, start_date, end_date } = req.query;

    const billings = await billingService.getAllBilling({
      payment_status,
      start_date,
      end_date
    });

    res.json({
      success: true,
      count: billings.length,
      data: billings
    });
  } catch (error) {
    console.error('Error fetching all billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch billing records',
      error: error.message
    });
  }
};

/**
 * Get billing statistics
 */
exports.getBillingStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const stats = await billingService.getBillingStats({
      start_date,
      end_date
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch billing statistics',
      error: error.message
    });
  }
};
