const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Anyone can see their own or general schedules, but only Admin can manage them.
router.get("/staff/:staffId", scheduleController.getStaffSchedules);
router.get("/", scheduleController.getAllSchedules);

// Only Admin can save/update
router.post("/", authorize("Admin"), scheduleController.saveSchedule);

module.exports = router;
