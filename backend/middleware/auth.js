const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verify JWT token and attach user to request
 */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

/**
 * Authenticate token (alias for verifyToken)
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Access denied. No token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};

/**
 * Authorize user based on roles
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorizeRoles = (...allowedRoles) => {
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

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }
  
  next();
};

module.exports = {
  verifyToken,
  authenticateToken,
  authorizeRoles,
  optionalAuth,
};
