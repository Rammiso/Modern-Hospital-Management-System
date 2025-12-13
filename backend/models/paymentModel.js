const db = require("../config/db");

exports.getBillById = async (bill_id) => {
  const [bill] = await db.query(
    "SELECT * FROM bills WHERE id = ?",
    [bill_id]
  );
  return bill[0];
};

exports.updatePayment = async (bill_id, data) => {
  const sql = `
    UPDATE bills SET
      paid_amount = ?,
      balance = ?,
      payment_method = ?,
      payment_status = ?,
      insurance_provider = ?,
      insurance_claim_number = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    data.paid_amount,
    data.balance,
    data.payment_method,
    data.payment_status,
    data.insurance_provider,
    data.insurance_claim_number,
    bill_id
  ];

  await db.query(sql, params);
};
