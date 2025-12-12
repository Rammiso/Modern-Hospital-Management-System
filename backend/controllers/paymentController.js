const PaymentModel = require("../models/paymentModel");
const db = require("../config/db");

exports.processPayment = async (req, res) => {
  try {
    const bill_id = req.params.id;
    const { amount, payment_method, insurance_provider, insurance_claim_number } = req.body;
    const user_id = req.user.id;

    // 1. Fetch bill
    const bill = await PaymentModel.getBillById(bill_id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const total_amount = Number(bill.total_amount);
    const already_paid = Number(bill.paid_amount);

    // 2. Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const new_paid_total = already_paid + Number(amount);

    if (new_paid_total > total_amount) {
      return res.status(400).json({
        message: "Amount exceeds total bill amount"
      });
    }

    // 3. Determine new status
    let payment_status = "pending";

    if (new_paid_total === total_amount) payment_status = "paid";
    else if (new_paid_total > 0) payment_status = "partial";

    const balance = total_amount - new_paid_total;

    // 4. Update the bill
    await PaymentModel.updatePayment(bill_id, {
      paid_amount: new_paid_total,
      balance,
      payment_method,
      payment_status,
      insurance_provider: payment_method === "insurance" ? insurance_provider : null,
      insurance_claim_number: payment_method === "insurance" ? insurance_claim_number : null
    });

    // 5. Add payment history (optional)
    await db.query(
      `INSERT INTO payments_history 
        (id, bill_id, amount, payment_method, created_by)
       VALUES (UUID(), ?, ?, ?, ?)`,
      [bill_id, amount, payment_method, user_id]
    );

    return res.json({
      message: "Payment processed successfully",
      bill_id,
      new_paid_total,
      balance,
      payment_status
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
