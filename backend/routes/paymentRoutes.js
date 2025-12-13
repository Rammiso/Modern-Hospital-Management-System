const express = require("express");
const router = express.Router();

const { processPayment } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/:id/payment",
  protect,
  authorize("cashier", "admin"),
  processPayment
);

module.exports = router;
