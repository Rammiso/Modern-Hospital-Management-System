const db = require('../config/db');

class PharmacyService {
  /**
   * Create pharmacy billing record
   * @param {Object} pharmacyData - Pharmacy billing information
   * @returns {Promise<Object>} Created pharmacy billing record
   */
  async createPharmacyBilling(pharmacyData) {
    const {
      prescription_id,
      patient_id,
      total_amount,
      payment_status = 'pending',
      payment_method = null,
      dispensed_by
    } = pharmacyData;

    const query = `
      INSERT INTO pharmacy_billing (
        prescription_id, patient_id, total_amount,
        payment_status, payment_method, dispensed_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      prescription_id,
      patient_id,
      total_amount,
      payment_status,
      payment_method,
      dispensed_by
    ]);

    return {
      pharmacy_billing_id: result.insertId,
      prescription_id,
      patient_id,
      total_amount,
      payment_status,
      payment_method,
      dispensed_by
    };
  }

  /**
   * Get pharmacy billing by ID
   * @param {number} pharmacyBillingId - Pharmacy billing ID
   * @returns {Promise<Object|null>} Pharmacy billing record
   */
  async getPharmacyBillingById(pharmacyBillingId) {
    const query = `
      SELECT pb.*,
             p.first_name, p.last_name, p.phone,
             pr.prescription_date,
             u.username as dispensed_by_name
      FROM pharmacy_billing pb
      LEFT JOIN patients p ON pb.patient_id = p.patient_id
      LEFT JOIN prescriptions pr ON pb.prescription_id = pr.prescription_id
      LEFT JOIN users u ON pb.dispensed_by = u.user_id
      WHERE pb.pharmacy_billing_id = ?
    `;

    const [rows] = await db.execute(query, [pharmacyBillingId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get pharmacy billing by prescription ID
   * @param {number} prescriptionId - Prescription ID
   * @returns {Promise<Object|null>} Pharmacy billing record
   */
  async getPharmacyBillingByPrescription(prescriptionId) {
    const query = `
      SELECT pb.*,
             p.first_name, p.last_name, p.phone,
             u.username as dispensed_by_name
      FROM pharmacy_billing pb
      LEFT JOIN patients p ON pb.patient_id = p.patient_id
      LEFT JOIN users u ON pb.dispensed_by = u.user_id
      WHERE pb.prescription_id = ?
    `;

    const [rows] = await db.execute(query, [prescriptionId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get pharmacy billing records by patient ID
   * @param {number} patientId - Patient ID
   * @returns {Promise<Array>} Array of pharmacy billing records
   */
  async getPharmacyBillingByPatient(patientId) {
    const query = `
      SELECT pb.*,
             pr.prescription_date,
             u.username as dispensed_by_name
      FROM pharmacy_billing pb
      LEFT JOIN prescriptions pr ON pb.prescription_id = pr.prescription_id
      LEFT JOIN users u ON pb.dispensed_by = u.user_id
      WHERE pb.patient_id = ?
      ORDER BY pb.created_at DESC
    `;

    const [rows] = await db.execute(query, [patientId]);
    return rows;
  }

  /**
   * Update pharmacy payment status
   * @param {number} pharmacyBillingId - Pharmacy billing ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Updated pharmacy billing record
   */
  async updatePharmacyPaymentStatus(pharmacyBillingId, paymentData) {
    const { payment_status, payment_method, transaction_id } = paymentData;

    const query = `
      UPDATE pharmacy_billing
      SET payment_status = ?,
          payment_method = ?,
          transaction_id = ?,
          paid_at = CASE WHEN ? = 'paid' THEN NOW() ELSE paid_at END
      WHERE pharmacy_billing_id = ?
    `;

    await db.execute(query, [
      payment_status,
      payment_method,
      transaction_id,
      payment_status,
      pharmacyBillingId
    ]);

    return this.getPharmacyBillingById(pharmacyBillingId);
  }

  /**
   * Get all pharmacy billing records with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of pharmacy billing records
   */
  async getAllPharmacyBilling(filters = {}) {
    let query = `
      SELECT pb.*,
             p.first_name, p.last_name, p.phone,
             pr.prescription_date,
             u.username as dispensed_by_name
      FROM pharmacy_billing pb
      LEFT JOIN patients p ON pb.patient_id = p.patient_id
      LEFT JOIN prescriptions pr ON pb.prescription_id = pr.prescription_id
      LEFT JOIN users u ON pb.dispensed_by = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.payment_status) {
      query += ' AND pb.payment_status = ?';
      params.push(filters.payment_status);
    }

    if (filters.start_date) {
      query += ' AND DATE(pb.created_at) >= ?';
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND DATE(pb.created_at) <= ?';
      params.push(filters.end_date);
    }

    query += ' ORDER BY pb.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  /**
   * Get pharmacy billing statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Pharmacy billing statistics
   */
  async getPharmacyStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_bills,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_bills,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_bills,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as collected_revenue,
        SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as pending_revenue
      FROM pharmacy_billing
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

  /**
   * Update prescription dispensed status
   * @param {number} prescriptionId - Prescription ID
   * @param {string} status - Dispensed status
   * @returns {Promise<void>}
   */
  async updatePrescriptionStatus(prescriptionId, status) {
    const query = `
      UPDATE prescriptions
      SET dispensed_status = ?
      WHERE prescription_id = ?
    `;

    await db.execute(query, [status, prescriptionId]);
  }
}

module.exports = new PharmacyService();
