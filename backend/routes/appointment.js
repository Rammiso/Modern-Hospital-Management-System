// const express = require("express");
// const router = express.Router();
// const {
//   createAppointment,
//   getAppointment,
//   listAppointments,
//   getAvailableSlots,
// } = require("../controllers/appointmentController");
// const verifyToken = require("../middleware/auth");

// router.post("/", verifyToken, createAppointment);
// router.get("/available-slots", verifyToken, getAvailableSlots);
// router.get("/:id", verifyToken, getAppointment);
// router.get("/", verifyToken, listAppointments);

// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const { verifyToken } = require("../middleware/auth");

// GET Available Slots (must be before /:id route)
router.get("/available-slots", verifyToken, controller.getAvailableSlots);

// CREATE Appointment
router.post("/", verifyToken, controller.createAppointment);

// LIST Appointments
router.get("/", verifyToken, controller.listAppointments);

// GET or CREATE Consultation for Appointment (NEW - for workflow)
router.get("/:id/consultation-or-create", verifyToken, controller.getOrCreateConsultation);

// UPDATE Appointment Status (NEW - for workflow)
router.patch("/:id/status", verifyToken, controller.updateStatus);

// GET Single Appointment (must be last to avoid conflicts)
router.get("/:id", verifyToken, controller.getAppointment);

module.exports = router;
