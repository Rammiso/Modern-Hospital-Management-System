const db = require("../config/db");
const BillingModel = require("../models/billingModel");
const { generateBillNumber } = require("../utils/helpers");

exports.generateBill = async (req, res) => {
  try {
    const { consultation_id } = req.body;
    const user_id = req.user.id;

    // 1. Get consultation
    const [consultation] = await db.query(
      "SELECT * FROM consultations WHERE id = ?",
      [consultation_id]
    );

    if (!consultation.length) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const patient_id = consultation[0].patient_id;

    // 2. Consultation Fee
    const CONSULTATION_FEE = 200;

    // 3. Pharmacy Total
    const [prescriptions] = await db.query(
      `SELECT p.id, p.drug_name, i.unit_price
       FROM prescriptions p
       LEFT JOIN pharmacy_inventory i
        ON p.drug_name = i.drug_name
       WHERE p.consultation_id = ? AND p.status = 'dispensed'`,
      [consultation_id]
    );

    let pharmacy_total = prescriptions.reduce(
      (sum, p) => sum + Number(p.unit_price || 0),
      0
    );

    // 4. Lab Total
    const [labTests] = await db.query(
      `SELECT id, test_name 
       FROM lab_requests 
       WHERE consultation_id = ? AND status = 'completed'`,
      [consultation_id]
    );

    let lab_total = labTests.length * 150;

    // 5. Calculate Total
    const other_charges = 0;
    const tax = 0;
    const discount = 0;

    const total_amount =
      CONSULTATION_FEE + pharmacy_total + lab_total + tax + other_charges - discount;

    // 6. Create bill
    const billData = {
      patient_id,
      consultation_id,
      consultation_fee: CONSULTATION_FEE,
      pharmacy_total,
      lab_total,
      other_charges,
      discount,
      tax,
      total_amount,
      created_by: user_id
    };

    const bill = await BillingModel.createBill(billData);

    // 7. Bill items
    const items = [];

    items.push({
      bill_id: bill.id,
      item_type: "consultation",
      description: "Consultation Fee",
      quantity: 1,
      unit_price: CONSULTATION_FEE,
      total_price: CONSULTATION_FEE
    });

    prescriptions.forEach(p => {
      items.push({
        bill_id: bill.id,
        item_type: "pharmacy",
        description: p.drug_name,
        quantity: 1,
        unit_price: p.unit_price,
        total_price: p.unit_price,
        prescription_id: p.id
      });
    });

    labTests.forEach(l => {
      items.push({
        bill_id: bill.id,
        item_type: "lab",
        description: l.test_name,
        quantity: 1,
        unit_price: 150,
        total_price: 150,
        lab_request_id: l.id
      });
    });

    await BillingModel.addBillItems(items);

    return res.json({
      message: "Bill generated successfully",
      bill,
      items
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
