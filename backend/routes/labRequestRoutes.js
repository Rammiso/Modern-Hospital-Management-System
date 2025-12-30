const express = require("express");
const router = express.Router();
const controller = require("../controllers/labRequestController");
const { verifyToken } = require("../middleware/auth");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get all lab requests (with filters)
router.get("/", protect, controller.getAllLabRequests);

// Create a new lab request (doctors only)
router.post("/", protect, authorize('doctor', 'admin'), controller.createLabRequest);

// Get all lab requests for a consultation
router.get("/consultation/:consultationId", protect, controller.getLabRequestsByConsultation);

// Get a single lab request by ID
router.get("/:id", protect, controller.getLabRequest);

// Get lab request status (for polling)
router.get("/:id/status", protect, controller.getLabRequestStatus);

// Update lab request (status/result) - Lab technicians and admins only
router.put("/:id", protect, authorize('laboratorist', 'admin'), controller.updateLabRequest);

// Delete lab request
router.delete("/:id", protect, authorize('doctor', 'admin'), controller.deleteLabRequest);

module.exports = router;
