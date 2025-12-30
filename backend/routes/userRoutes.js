const express = require("express");
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes here require login
router.use(protect);

// Only Admin can manage users
router.use(authorize("Admin"));

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/roles", userController.getRoles);
router.put("/:id", userController.updateUser);

module.exports = router;
