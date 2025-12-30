// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });
// };

// exports.register = async (req, res) => {
//   try {
//     const { email, password, full_name, role_id, phone, specialization } =
//       req.body;

//     // Check if user exists
//     const existingUser = await User.findByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use" });
//     }

//     // Create user
//     const newUser = await User.create({
//       email,
//       password,
//       full_name,
//       role_id: role_id || 2, // Default to staff (2) if not specified, 1 is usually admin
//       phone,
//       specialization,
//     });

//     // Generate token
//     const token = signToken(newUser.id);

//     // Remove password from output
//     delete newUser.password_hash;

//     res.status(201).json({
//       status: "success",
//       token,
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res
//       .status(500)
//       .json({
//         message: "Server error during registration",
//         error: error.message,
//       });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email and password exist
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide email and password" });
//     }

//     // Check if user exists & password is correct
//     const user = await User.findByEmail(email);

//     if (!user || !(await User.verifyPassword(user, password))) {
//       return res.status(401).json({ message: "Incorrect email or password" });
//     }

//     // Generate token
//     const token = signToken(user.id);

//     // Remove password from output
//     delete user.password_hash;

//     res.status(200).json({
//       status: "success",
//       token,
//       user,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res
//       .status(500)
//       .json({ message: "Server error during login", error: error.message });
//   }
// };

// exports.getMe = async (req, res) => {
//   try {
//     // req.user is set by auth middleware (to be implemented/imported)
//     // For now, let's assume middleware puts decoded token payload in req.user
//     // actually we need to make sure we have the middleware.

//     // We need to implement the protect middleware first or put it here.
//     // Let's defer that and assume protect middleware is used in route.

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       status: "success",
//       user,
//     });
//   } catch (error) {
//     console.error("GetMe Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables!");
    // Fallback for development if .env is still failing to load for some reason
    process.env.JWT_SECRET = "temp_dev_secret_only_for_fixing_the_issue";
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (req, res) => {
  // Map 'role' from body to 'role_id' if needed, or assume body sends role_id
  // Frontend sends role_id (e.g. 1 for Admin, 2 for Doctor)
  const { full_name, email, password, role_id, phone, specialization } =
    req.body;

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser)
      //?.length > 0
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use default role_id = 2 (Staff/Doctor) if not provided
    const userRoleId = role_id || 2;

    await db.query(
      "INSERT INTO users (full_name, email, password_hash, role_id, phone, specialization) VALUES (?, ?, ?, ?, ?, ?)",
      [full_name, email, hashedPassword, userRoleId, phone, specialization]
    );

    // Fetch the new user to return it (with role name)
    const newUserRows = await db.query(
      `
      SELECT u.id, u.email, u.full_name, u.role_id, LOWER(r.role_name) as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.role_id 
      WHERE u.email = ?
    `,
      [email]
    );

    const newUser = newUserRows[0];
    const token = signToken(newUser);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Join with roles to get role name for the token
    // SECURITY: Only allow active users to login
    const userRows = await db.query(
      `
      SELECT u.id, u.email, u.password_hash, u.full_name, u.role_id, u.is_active, LOWER(r.role_name) as role
      FROM users u 
      JOIN roles r ON u.role_id = r.role_id 
      WHERE u.email = ? AND u.is_active = 1
    `,
      [email]
    );

    if (userRows.length === 0)
      return res.status(401).json({ message: "Invalid credentials or account disabled" });

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    // Remove password hash
    delete user.password_hash;

    res.json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user.id comes from middleware
    const userRows = await db.query(
      `
      SELECT u.id, u.email, u.full_name, u.role_id, u.phone, u.specialization, LOWER(r.role_name) as role
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.id = ?
    `,
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      user: userRows[0],
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login, getMe };
