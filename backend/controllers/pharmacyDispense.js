const { prescriptionModel } = require('../models/prescription.model');
const { pharmacyInventoryModel } = require('../models/pharmacy-inventory.model');
const db = require('../config/db');

/**
 * Dispense prescription with inventory management
 * POST /api/pharmacy/dispense/:prescriptionId
 */
exports.dispensePrescription = async (req, res) => {
  const connection = await db.pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { prescriptionId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user?.id;
    
    // 1. Get prescription
    const prescription = await prescriptionModel.findById(prescriptionId);
    
    if (!prescription) {
      await connection.rollback();
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // 2. Check if already dispensed
    if (prescription.status === 'dispensed') {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Prescription already dispensed',
        dispensed_at: prescription.dispensed_at
      });
    }
    
    // 3. Find drug in inventory
    const [inventory] = await connection.execute(
      `SELECT * FROM pharmacy_inventory 
       WHERE drug_name = ? AND status = 'available' 
       ORDER BY expiry_date ASC LIMIT 1`,
      [prescription.drug_name]
    );
    
    if (!inventory || inventory.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        message: 'Drug not found in inventory',
        drug_name: prescription.drug_name
      });
    }
    
    const drug = inventory[0];
    
    // 4. Check stock availability
    if (drug.quantity < quantity) {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Insufficient stock',
        available: drug.quantity,
        requested: quantity
      });
    }
    
    // 5. Reduce inventory (ATOMIC)
    const success = await pharmacyInventoryModel.decreaseQuantity(
      drug.id, 
      quantity
    );
    
    if (!success) {
      await connection.rollback();
      return res.status(500).json({ 
        message: 'Failed to update inventory'
      });
    }
    
    // 6. Mark prescription as dispensed
    await prescriptionModel.dispense(prescriptionId, userId);
    
    // 7. Create dispensation record
    await connection.execute(
      `INSERT INTO dispensations (dispense_id, drug_id, patient_id, quantity, dispensed_by, remarks)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [
        drug.id,
        prescription.patient_id,
        quantity,
        userId,
        `Prescription ${prescriptionId}`
      ]
    );
    
    await connection.commit();
    
    res.status(200).json({
      success: true,
      message: 'Prescription dispensed successfully',
      data: {
        prescription_id: prescriptionId,
        drug_name: drug.drug_name,
        quantity_dispensed: quantity,
        remaining_stock: drug.quantity - quantity,
        unit_price: drug.unit_price,
        total_cost: drug.unit_price * quantity
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Dispense Error:', error);
    res.status(500).json({ 
      message: 'Failed to dispense prescription',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * Get pending prescriptions for pharmacy
 * GET /api/pharmacy/pending
 */
exports.getPendingPrescriptions = async (req, res) => {
  try {
    const { query } = require('../config/db');
    
    const prescriptions = await query(
      `SELECT p.id, p.drug_name, p.dosage, p.frequency, p.duration,
              p.instructions, p.created_at,
              c.patient_id,
              pat.full_name as patient_name,
              pat.patient_id as patient_number,
              u.full_name as doctor_name
       FROM prescriptions p
       INNER JOIN consultations c ON p.consultation_id = c.id
       INNER JOIN patients pat ON c.patient_id = pat.id
       INNER JOIN users u ON c.doctor_id = u.id
       WHERE p.status = 'pending'
       ORDER BY p.created_at ASC`
    );
    
    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
    
  } catch (error) {
    console.error('Get Pending Prescriptions Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pending prescriptions',
      error: error.message
    });
  }
};

/**
 * Get dispensed prescriptions history
 * GET /api/pharmacy/dispensed
 */
exports.getDispensedPrescriptions = async (req, res) => {
  try {
    const { query } = require('../config/db');
    const { startDate, endDate, limit = 50 } = req.query;
    
    let sql = `
      SELECT p.id, p.drug_name, p.dosage, p.dispensed_at,
             pat.full_name as patient_name,
             pat.patient_id as patient_number,
             u.full_name as dispensed_by_name,
             d.quantity as dispensed_quantity
      FROM prescriptions p
      INNER JOIN consultations c ON p.consultation_id = c.id
      INNER JOIN patients pat ON c.patient_id = pat.id
      LEFT JOIN users u ON p.dispensed_by = u.id
      LEFT JOIN dispensations d ON CONCAT('Prescription ', p.id) = d.remarks
      WHERE p.status = 'dispensed'
    `;
    
    const params = [];
    
    if (startDate && endDate) {
      sql += ` AND DATE(p.dispensed_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    
    sql += ` ORDER BY p.dispensed_at DESC LIMIT ?`;
    params.push(parseInt(limit));
    
    const prescriptions = await query(sql, params);
    
    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
    
  } catch (error) {
    console.error('Get Dispensed Prescriptions Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dispensed prescriptions',
      error: error.message
    });
  }
};

module.exports = {
  dispensePrescription: exports.dispensePrescription,
  getPendingPrescriptions: exports.getPendingPrescriptions,
  getDispensedPrescriptions: exports.getDispensedPrescriptions
};
