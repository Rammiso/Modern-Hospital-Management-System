const db = require('../config/db');

class BillingService {
  /**
   * Create a new billing record
   * @param {Object} billingData - Billing information
   * @returns {Promise<Object>} Created billing record
   */
  async createBilling(billingData) {
    const {
      patient_id,
      consultation_id,
      total_amount,
      payment_status = 'pending',
      payment_method = null,
      created_by
    } = billingData;

    const query = `
      INSERT INTO billing (
        patient_id, consultation_id, total_amount, 
        payment_status, payment_method, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      patient_id,
      consultation_id,
      total_amount,
      payment_status,
      payment_method,
      created_by
    ]);

    return {
      billing_id: result.insertId,
      patient_id,
      consultation_id,
      total_amount,
      payment_status,
      payment_method,
      created_by
    };
  }

  /**
   * Get billing record by ID
   * @param {number} billingId - Billing ID
   * @returns {Promise<Object|null>} Billing record
   */
  async getBillingById(billingId) {
    const query = `
      SELECT b.*, 
             p.first_name, p.last_name, p.phone,
             u.username as created_by_name
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.patient_id
      LEFT JOIN users u ON b.created_by = u.user_id
      WHERE b.billing_id = ?
    `;

    const [rows] = await db.execute(query, [billingId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get billing records by patient ID
   * @param {number} patientId - Patient ID
   * @returns {Promise<Array>} Array of billing records
   */
  async getBillingByPatient(patientId) {
    const query = `
      SELECT b.*, 
             u.username as created_by_name
      FROM billing b
      LEFT JOIN users u ON b.created_by = u.user_id
      WHERE b.patient_id = ?
      ORDER BY b.created_at DESC
    `;

    const [rows] = await db.execute(query, [patientId]);
    return rows;
  }

  /**
   * Get billing record by consultation ID
   * @param {number} consultationId - Consultation ID
   * @returns {Promise<Object|null>} Billing record
   */
  async getBillingByConsultation(consultationId) {
    const query = `
      SELECT b.*, 
             p.first_name, p.last_name, p.phone,
             u.username as created_by_name
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.patient_id
      LEFT JOIN users u ON b.created_by = u.user_id
      WHERE b.consultation_id = ?
    `;

    const [rows] = await db.execute(query, [consultationId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Update billing payment status
   * @param {number} billingId - Billing ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Updated billing record
   */
  async updatePaymentStatus(billingId, paymentData) {
    const { payment_status, payment_method, transaction_id } = paymentData;

    const query = `
      UPDATE billing 
      SET payment_status = ?,
          payment_method = ?,
          transaction_id = ?,
          paid_at = CASE WHEN ? = 'paid' THEN NOW() ELSE paid_at END
      WHERE billing_id = ?
    `;

    await db.execute(query, [
      payment_status,
      payment_method,
      transaction_id,
      payment_status,
      billingId
    ]);

    return this.getBillingById(billingId);
  }

  /**
   * Get all billing records with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of billing records
   */
  async getAllBilling(filters = {}) {
    let query = `
      SELECT b.*, 
             p.first_name, p.last_name, p.phone,
             u.username as created_by_name
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.patient_id
      LEFT JOIN users u ON b.created_by = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.payment_status) {
      query += ' AND b.payment_status = ?';
      params.push(filters.payment_status);
    }

    if (filters.start_date) {
      query += ' AND DATE(b.created_at) >= ?';
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND DATE(b.created_at) <= ?';
      params.push(filters.end_date);
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  /**
   * Get billing statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Billing statistics
   */
  async getBillingStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_bills,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_bills,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_bills,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as collected_revenue,
        SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as pending_revenue
      FROM billing
      WHERE 1=1
    `;

    const params = [];

    if (filters.start_date) {
      query += ' AND DATE(created_at) >= ?';
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND DATE(created_at) <= ?';
      params.push(filters.end_date);
    }

    const [rows] = await db.execute(query, params);
    return rows[0];
  }
}

module.exports = new BillingService();
