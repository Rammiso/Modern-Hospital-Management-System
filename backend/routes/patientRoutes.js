const express = require("express");
const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

router.get("/search", patientController.searchPatients);

router
  .route("/")
  .get(patientController.getAllPatients)
  .post(patientController.createPatient);

router
  .route("/:id")
  .get(patientController.getPatient)
  .put(patientController.updatePatient)
  .delete(patientController.deletePatient);

module.exports = router;
