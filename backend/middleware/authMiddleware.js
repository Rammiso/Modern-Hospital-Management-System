const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

exports.protect = async (req, res, next) => {
  let token;

  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in! Please log in to get access." });
  }

  // 2) Verification token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);
    const currentUser = rows[0];

    if (!currentUser) {
      return res
        .status(401)
        .json({
          message: "The user belonging to this token does no longer exist.",
        });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Authorize user based on roles
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    // Get user role (handle different possible property names)
    const userRole = req.user.role || req.user.role_name || req.user.roleName;
    
    if (!userRole) {
      return res.status(403).json({ 
        success: false,
        message: "User role not found" 
      });
    }

    // Check if user's role is in the allowed roles (case-insensitive)
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole.toLowerCase()
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};
