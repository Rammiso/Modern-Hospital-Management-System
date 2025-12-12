const express = require("express");
const router = express.Router();
const controller = require("../controllers/labRequestController");
const { protect } = require("../middleware/authMiddleware");

// Create a new lab request
router.post("/", protect, controller.createLabRequest);

// Get pending lab requests
router.get("/pending/list", protect, controller.getPendingLabRequests);

// Search lab requests with filters
router.get("/search/results", protect, controller.searchLabRequests);

// Get lab statistics
router.get("/stats/summary", protect, controller.getLabStatistics);

// Get all lab requests for a consultation
router.get("/consultation/:consultationId", protect, controller.getLabRequestsByConsultation);

// Get all lab requests for a patient
router.get("/patient/:patientId", protect, controller.getPatientLabHistory);

// Get a single lab request by ID
router.get("/:id", protect, controller.getLabRequest);

// Mark sample as collected
router.patch("/:id/collect", protect, controller.markSampleCollected);

// Mark as processing
router.patch("/:id/process", protect, controller.markProcessing);

// Complete lab request with results
router.patch("/:id/complete", protect, controller.completeLabRequest);

// Update lab request (status/result)
router.put("/:id", protect, controller.updateLabRequest);

// Cancel lab request
router.patch("/:id/cancel", protect, controller.cancelLabRequest);

// Delete lab request
router.delete("/:id", protect, controller.deleteLabRequest);

module.exports = router;
