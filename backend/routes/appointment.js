const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointment,
  listAppointments,
} = require("../controllers/appointmentController");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, createAppointment);
router.get("/:id", verifyToken, getAppointment);
router.get("/", verifyToken, listAppointments);

module.exports = router;
