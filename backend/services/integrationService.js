const billingService = require('./billingService');
const pharmacyService = require('./pharmacyService');
const db = require('../config/db');

class IntegrationService {
  /**
   * Process consultation completion with billing
   * @param {Object} consultationData - Consultation and billing data
   * @returns {Promise<Object>} Result with billing and consultation info
   */
  async processConsultationWithBilling(consultationData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        consultation_id,
        patient_id,
        consultation_fee,
        payment_status = 'pending',
        payment_method = null,
        created_by
      } = consultationData;

      // Check if billing already exists for this consultation
      const existingBilling = await billingService.getBillingByConsultation(consultation_id);
      
      if (existingBilling) {
        await connection.rollback();
        return {
          success: false,
          message: 'Billing already exists for this consultation',
          billing: existingBilling
        };
      }

      // Create billing record
      const billing = await billingService.createBilling({
        patient_id,
        consultation_id,
        total_amount: consultation_fee,
        payment_status,
        payment_method,
        created_by
      });

      // Update consultation status if payment is completed
      if (payment_status === 'paid') {
        await connection.execute(
          'UPDATE consultations SET billing_status = ? WHERE consultation_id = ?',
          ['paid', consultation_id]
        );
      }

      await connection.commit();

      return {
        success: true,
        message: 'Consultation billing created successfully',
        billing,
        consultation_id
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Process prescription dispensing with pharmacy billing
   * @param {Object} prescriptionData - Prescription and billing data
   * @returns {Promise<Object>} Result with pharmacy billing info
   */
  async processPrescriptionWithBilling(prescriptionData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        prescription_id,
        patient_id,
        total_amount,
        payment_status = 'pending',
        payment_method = null,
        dispensed_by
      } = prescriptionData;

      // Check if pharmacy billing already exists
      const existingBilling = await pharmacyService.getPharmacyBillingByPrescription(prescription_id);
      
      if (existingBilling) {
        await connection.rollback();
        return {
          success: false,
          message: 'Pharmacy billing already exists for this prescription',
          pharmacyBilling: existingBilling
        };
      }

      // Create pharmacy billing record
      const pharmacyBilling = await pharmacyService.createPharmacyBilling({
        prescription_id,
        patient_id,
        total_amount,
        payment_status,
        payment_method,
        dispensed_by
      });

      // Update prescription dispensed status
      const dispensedStatus = payment_status === 'paid' ? 'dispensed' : 'pending';
      await pharmacyService.updatePrescriptionStatus(prescription_id, dispensedStatus);

      await connection.commit();

      return {
        success: true,
        message: 'Prescription billing created successfully',
        pharmacyBilling,
        prescription_id
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get complete patient billing history (consultation + pharmacy)
   * @param {number} patientId - Patient ID
   * @returns {Promise<Object>} Combined billing history
   */
  async getPatientBillingHistory(patientId) {
    const consultationBilling = await billingService.getBillingByPatient(patientId);
    const pharmacyBilling = await pharmacyService.getPharmacyBillingByPatient(patientId);

    const totalConsultationAmount = consultationBilling.reduce(
      (sum, bill) => sum + parseFloat(bill.total_amount), 0
    );
    const totalPharmacyAmount = pharmacyBilling.reduce(
      (sum, bill) => sum + parseFloat(bill.total_amount), 0
    );

    return {
      patient_id: patientId,
      consultation_billing: consultationBilling,
      pharmacy_billing: pharmacyBilling,
      summary: {
        total_consultation_bills: consultationBilling.length,
        total_pharmacy_bills: pharmacyBilling.length,
        total_consultation_amount: totalConsultationAmount,
        total_pharmacy_amount: totalPharmacyAmount,
        grand_total: totalConsultationAmount + totalPharmacyAmount
      }
    };
  }

  /**
   * Get dashboard statistics for billing and pharmacy
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Combined statistics
   */
  async getDashboardStats(filters = {}) {
    const billingStats = await billingService.getBillingStats(filters);
    const pharmacyStats = await pharmacyService.getPharmacyStats(filters);

    return {
      consultation_billing: billingStats,
      pharmacy_billing: pharmacyStats,
      combined: {
        total_revenue: parseFloat(billingStats.total_revenue || 0) + 
                      parseFloat(pharmacyStats.total_revenue || 0),
        collected_revenue: parseFloat(billingStats.collected_revenue || 0) + 
                          parseFloat(pharmacyStats.collected_revenue || 0),
        pending_revenue: parseFloat(billingStats.pending_revenue || 0) + 
                        parseFloat(pharmacyStats.pending_revenue || 0),
        total_bills: parseInt(billingStats.total_bills || 0) + 
                    parseInt(pharmacyStats.total_bills || 0)
      }
    };
  }

  /**
   * Process payment for existing billing record
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Updated billing record
   */
  async processPayment(paymentData) {
    const { billing_type, billing_id, payment_method, transaction_id } = paymentData;

    if (billing_type === 'consultation') {
      return await billingService.updatePaymentStatus(billing_id, {
        payment_status: 'paid',
        payment_method,
        transaction_id
      });
    } else if (billing_type === 'pharmacy') {
      const result = await pharmacyService.updatePharmacyPaymentStatus(billing_id, {
        payment_status: 'paid',
        payment_method,
        transaction_id
      });

      // Update prescription status to dispensed
      const pharmacyBilling = await pharmacyService.getPharmacyBillingById(billing_id);
      if (pharmacyBilling) {
        await pharmacyService.updatePrescriptionStatus(
          pharmacyBilling.prescription_id,
          'dispensed'
        );
      }

      return result;
    } else {
      throw new Error('Invalid billing type');
    }
  }
}

module.exports = new IntegrationService();
