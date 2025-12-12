const express = require("express");
const router = express.Router();

const { generateBill } = require("../controllers/billingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/generate",
  protect,
  authorize("cashier", "receptionist", "admin"),
  generateBill
);

module.exports = router;
