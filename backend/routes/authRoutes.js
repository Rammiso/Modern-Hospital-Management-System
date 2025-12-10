const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware.protect, authController.getMe);
router.get("/logout", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

module.exports = router;






