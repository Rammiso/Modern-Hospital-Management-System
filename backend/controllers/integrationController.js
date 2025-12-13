const integrationService = require('../services/integrationService');

/**
 * Process consultation completion with billing
 */
exports.processConsultationBilling = async (req, res) => {
  try {
    const { consultation_id, patient_id, consultation_fee, payment_status, payment_method } = req.body;

    // Validation
    if (!consultation_id || !patient_id || !consultation_fee) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: consultation_id, patient_id, consultation_fee'
      });
    }

    const result = await integrationService.processConsultationWithBilling({
      consultation_id,
      patient_id,
      consultation_fee,
      payment_status: payment_status || 'pending',
      payment_method: payment_method || null,
      created_by: req.user.user_id
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error processing consultation billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process consultation billing',
      error: error.message
    });
  }
};

/**
 * Process prescription dispensing with pharmacy billing
 */
exports.processPrescriptionBilling = async (req, res) => {
  try {
    const { prescription_id, patient_id, total_amount, payment_status, payment_method } = req.body;

    // Validation
    if (!prescription_id || !patient_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: prescription_id, patient_id, total_amount'
      });
    }

    const result = await integrationService.processPrescriptionWithBilling({
      prescription_id,
      patient_id,
      total_amount,
      payment_status: payment_status || 'pending',
      payment_method: payment_method || null,
      dispensed_by: req.user.user_id
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error processing prescription billing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process prescription billing',
      error: error.message
    });
  }
};

/**
 * Get complete patient billing history
 */
exports.getPatientBillingHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const history = await integrationService.getPatientBillingHistory(patientId);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching patient billing history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient billing history',
      error: error.message
    });
  }
};

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const stats = await integrationService.getDashboardStats({
      start_date,
      end_date
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Process payment for existing billing
 */
exports.processPayment = async (req, res) => {
  try {
    const { billing_type, billing_id, payment_method, transaction_id } = req.body;

    // Validation
    if (!billing_type || !billing_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: billing_type, billing_id, payment_method'
      });
    }

    if (!['consultation', 'pharmacy'].includes(billing_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billing_type. Must be "consultation" or "pharmacy"'
      });
    }

    const result = await integrationService.processPayment({
      billing_type,
      billing_id,
      payment_method,
      transaction_id
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};
