// const express = require("express");
// const router = express.Router();
// const {
//   createAppointment,
//   getAppointment,
//   listAppointments,
// } = require("../controllers/appointmentController");
// const verifyToken = require("../middleware/auth");

// router.post("/", verifyToken, createAppointment);
// router.get("/:id", verifyToken, getAppointment);
// router.get("/", verifyToken, listAppointments);

// module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const verifyToken = require("../middleware/auth");

// CREATE Appointment
router.post("/", verifyToken, controller.createAppointment);

// LIST Appointments
router.get("/", verifyToken, controller.listAppointments);

// GET Single Appointment
router.get("/:id", verifyToken, controller.getAppointment);

// UPDATE Appointment
router.put("/:id", verifyToken, controller.updateAppointment);

// DELETE Appointment
router.delete("/:id", verifyToken, controller.deleteAppointment);

module.exports = router;

