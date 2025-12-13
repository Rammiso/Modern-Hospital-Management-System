const express = require("express");
const router = express.Router();
const controller = require("../controllers/labTestController");
// const verifyToken = require("../middleware/auth"); // Temporarily disabled for testing

// Get all Ethiopian MOH standard lab tests
router.get("/tests", controller.getLabTests);

// Search lab tests (must come before /:id route)
router.get("/tests/search", controller.searchLabTests);

// Get lab test by ID
router.get("/tests/:id", controller.getLabTest);

module.exports = router;
