const express = require("express");
const router = express.Router();
const controller = require("../controllers/labRequestController");
const verifyToken = require("../middleware/auth");

// Create a new lab request
router.post("/", verifyToken, controller.createLabRequest);

// Get all lab requests for a consultation
router.get("/consultation/:consultationId", verifyToken, controller.getLabRequestsByConsultation);

// Get a single lab request by ID
router.get("/:id", verifyToken, controller.getLabRequest);

// Update lab request (status/result)
router.put("/:id", verifyToken, controller.updateLabRequest);

// Delete lab request
router.delete("/:id", verifyToken, controller.deleteLabRequest);

module.exports = router;
