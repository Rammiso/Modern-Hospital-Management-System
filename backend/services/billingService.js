const db = require('../config/db');

class BillingService {
  /**
   * Get all billing records with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of billing records
   */
  async getAllBilling(filters = {}) {
    let sql = `
      SELECT b.*, 
             p.full_name AS patient_name, p.patient_id AS patient_display_id,
             u.full_name AS created_by_name,
             d.full_name AS doctor_name
      FROM bills b
      LEFT JOIN patients p ON b.patient_id = p.id
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN consultations c ON b.consultation_id = c.id
      LEFT JOIN users d ON c.doctor_id = d.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.payment_status && filters.payment_status !== 'ALL') {
      sql += ' AND b.payment_status = ?';
      params.push(filters.payment_status.toLowerCase());
    }

    if (filters.start_date) {
      sql += ' AND DATE(b.created_at) >= ?';
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      sql += ' AND DATE(b.created_at) <= ?';
      params.push(filters.end_date);
    }

    sql += ' ORDER BY b.created_at DESC';

    return await db.query(sql, params);
  }

  /**
   * Get billing record by ID including items
   * @param {string} billingId - Billing ID (UUID)
   * @returns {Promise<Object|null>} Billing record with items
   */
  async getBillingById(billingId) {
    const billSql = `
      SELECT b.*, 
             p.full_name AS patient_name, p.patient_id AS patient_display_id,
             p.date_of_birth, p.gender,
             u.full_name AS created_by_name,
             c.doctor_id, d.full_name AS doctor_name,
             dept_role.role_name as department
      FROM bills b
      LEFT JOIN patients p ON b.patient_id = p.id
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN consultations c ON b.consultation_id = c.id
      LEFT JOIN users d ON c.doctor_id = d.id
      LEFT JOIN roles dept_role ON d.role_id = dept_role.role_id
      WHERE b.id = ?
    `;

    const bills = await db.query(billSql, [billingId]);
    if (bills.length === 0) return null;

    const bill = bills[0];

    // Fetch items
    const itemsSql = `
      SELECT * FROM bill_items WHERE bill_id = ? ORDER BY created_at ASC
    `;
    bill.items = await db.query(itemsSql, [billingId]);

    return bill;
  }

  /**
   * Update billing payment status
   * @param {string} billingId - Billing ID
   * @param {Object} paymentData - Payment information
   */
  async updatePaymentStatus(billingId, paymentData) {
    const { payment_status, payment_method, amount_paid } = paymentData;

    // First get current bill
    const [bill] = await db.query('SELECT total_amount, paid_amount FROM bills WHERE id = ?', [billingId]);
    if (!bill) throw new Error('Bill not found');

    const newPaidAmount = parseFloat(bill.paid_amount) + parseFloat(amount_paid || 0);
    const newBalance = parseFloat(bill.total_amount) - newPaidAmount;
    const finalStatus = newBalance <= 0 ? 'paid' : (newPaidAmount > 0 ? 'partial' : 'pending');

    const sql = `
      UPDATE bills 
      SET payment_status = ?,
          payment_method = ?,
          paid_amount = ?,
          balance = ?,
          updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(sql, [
      finalStatus,
      payment_method,
      newPaidAmount,
      newBalance,
      billingId
    ]);

    return this.getBillingById(billingId);
  }

  /**
   * Get billing record by consultation ID
   */
  async getBillingByConsultation(consultationId) {
    const [bill] = await db.query('SELECT id FROM bills WHERE consultation_id = ?', [consultationId]);
    if (!bill) return null;
    return this.getBillingById(bill.id);
  }

  /**
   * Get billing stats
   */
  async getBillingStats(filters = {}) {
    let sql = `
      SELECT 
        COUNT(*) as total_bills,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_bills,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_bills,
        SUM(total_amount) as total_revenue,
        SUM(paid_amount) as collected_revenue,
        SUM(balance) as pending_revenue
      FROM bills
      WHERE 1=1
    `;

    const params = [];
    if (filters.start_date) {
      sql += ' AND DATE(created_at) >= ?';
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      sql += ' AND DATE(created_at) <= ?';
      params.push(filters.end_date);
    }

    const results = await db.query(sql, params);
    return results[0];
  }
}

module.exports = new BillingService();
