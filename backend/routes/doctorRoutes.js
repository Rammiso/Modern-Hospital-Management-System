const express = require("express");
const doctorController = require("../controllers/doctorController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Get all doctors
router.get("/", verifyToken, doctorController.getDoctors);

// Get doctor by ID
router.get("/:id", verifyToken, doctorController.getDoctorById);

module.exports = router;
