const db = require("../config/db");
const { generateBillNumber } = require("../utils/helpers");

exports.createBill = async (billData) => {
  const bill_number = generateBillNumber();

  const sql = `
    INSERT INTO bills (
      id, bill_number, patient_id, consultation_id,
      consultation_fee, pharmacy_total, lab_total,
      other_charges, discount, tax,
      total_amount, paid_amount, balance,
      payment_status, created_by
    )
    VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    bill_number,
    billData.patient_id,
    billData.consultation_id,
    billData.consultation_fee,
    billData.pharmacy_total,
    billData.lab_total,
    billData.other_charges,
    billData.discount,
    billData.tax,
    billData.total_amount,
    0,
    billData.total_amount,
    "pending",
    billData.created_by
  ];

  const [result] = await db.query(sql, params);

  return {
    id: result.insertId || null,
    bill_number
  };
};

exports.addBillItems = async (items) => {
  const sql = `
    INSERT INTO bill_items (
      id, bill_id, item_type, item_description,
      quantity, unit_price, total_price,
      prescription_id, lab_request_id
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const item of items) {
    await db.query(sql, [
      item.bill_id,
      item.item_type,
      item.description,
      item.quantity,
      item.unit_price,
      item.total_price,
      item.prescription_id || null,
      item.lab_request_id || null
    ]);
  }
};
