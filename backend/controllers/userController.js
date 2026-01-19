const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

/**
 * Get all users with their roles
 */
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT u.id, u.email, u.full_name, u.phone, u.specialization, u.is_active, u.role_id, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      ORDER BY u.created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Create a new user (Staff Management)
 */
exports.createUser = async (req, res) => {
  const { full_name, email, password, role_id, phone, specialization } = req.body;

  try {
    // Check if email already exists
    const [existingUser] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.execute(
      "INSERT INTO users (id, full_name, email, password_hash, role_id, phone, specialization, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
      [userId, full_name, email, hashedPassword, role_id, phone, specialization || null]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: userId, full_name, email, role_id }
    });
  } catch (error) {
    console.error("CreateUser Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Update user details/role
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, specialization, role_id, is_active } = req.body;

  try {
    const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await pool.execute(
      "UPDATE users SET full_name = ?, phone = ?, specialization = ?, role_id = ?, is_active = ? WHERE id = ?",
      [full_name, phone, specialization || null, role_id, is_active, id]
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("UpdateUser Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Get all roles
 */
exports.getRoles = async (req, res) => {
  try {
    const [roles] = await pool.execute("SELECT role_id, role_name, description FROM roles");
    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
