/**
 * Role-Based Access Control Utilities
 * Helper functions for role-based UI guards
 */

/**
 * Check if user has required role
 * @param {Object} user - User object with role information
 * @param {string|Array} requiredRoles - Required role(s)
 * @returns {boolean} - True if user has required role
 */
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) {
    return false;
  }

  const userRole = user.role.toLowerCase();
  
  // If requiredRoles is an array
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.some(role => role.toLowerCase() === userRole);
  }
  
  // If requiredRoles is a string
  return userRole === requiredRoles.toLowerCase();
};

/**
 * Check if user is doctor
 * @param {Object} user - User object
 * @returns {boolean} - True if user is doctor
 */
export const isDoctor = (user) => {
  return hasRole(user, 'doctor');
};

/**
 * Check if user is receptionist
 * @param {Object} user - User object
 * @returns {boolean} - True if user is receptionist
 */
export const isReceptionist = (user) => {
  return hasRole(user, 'receptionist');
};

/**
 * Check if user is lab technician
 * @param {Object} user - User object
 * @returns {boolean} - True if user is lab technician
 */
export const isLabTechnician = (user) => {
  return hasRole(user, ['lab technician', 'lab_technician', 'labtechnician']);
};

/**
 * Check if user is pharmacist
 * @param {Object} user - User object
 * @returns {boolean} - True if user is pharmacist
 */
export const isPharmacist = (user) => {
  return hasRole(user, 'pharmacist');
};

/**
 * Check if user is cashier
 * @param {Object} user - User object
 * @returns {boolean} - True if user is cashier
 */
export const isCashier = (user) => {
  return hasRole(user, 'cashier');
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

/**
 * Check if user can access consultation module
 * @param {Object} user - User object
 * @returns {boolean} - True if user can access consultation
 */
export const canAccessConsultation = (user) => {
  return hasRole(user, ['doctor', 'admin']);
};

/**
 * Check if user can access lab module
 * @param {Object} user - User object
 * @returns {boolean} - True if user can access lab
 */
export const canAccessLab = (user) => {
  return hasRole(user, ['doctor', 'lab technician', 'lab_technician', 'labtechnician', 'admin']);
};

/**
 * Check if user can access pharmacy module
 * @param {Object} user - User object
 * @returns {boolean} - True if user can access pharmacy
 */
export const canAccessPharmacy = (user) => {
  return hasRole(user, ['pharmacist', 'admin']);
};

/**
 * Check if user can access billing module
 * @param {Object} user - User object
 * @returns {boolean} - True if user can access billing
 */
export const canAccessBilling = (user) => {
  return hasRole(user, ['receptionist', 'cashier', 'admin']);
};

/**
 * Check if user can process payments
 * @param {Object} user - User object
 * @returns {boolean} - True if user can process payments
 */
export const canProcessPayments = (user) => {
  return hasRole(user, ['receptionist', 'cashier', 'pharmacist', 'admin']);
};

/**
 * Check if user can view patient dashboard
 * @param {Object} user - User object
 * @returns {boolean} - True if user can view patient dashboard
 */
export const canViewPatientDashboard = (user) => {
  return hasRole(user, ['doctor', 'receptionist', 'cashier', 'admin']);
};

/**
 * Get user's dashboard route based on role
 * @param {Object} user - User object
 * @returns {string} - Dashboard route
 */
export const getDashboardRoute = (user) => {
  if (!user || !user.role) {
    return '/login';
  }

  const role = user.role.toLowerCase();
  
  const dashboardRoutes = {
    'doctor': '/doctor-dashboard',
    'receptionist': '/receptionist-dashboard',
    'lab technician': '/lab-dashboard',
    'lab_technician': '/lab-dashboard',
    'labtechnician': '/lab-dashboard',
    'pharmacist': '/pharmacy-dashboard',
    'cashier': '/cashier-dashboard',
    'admin': '/admin-dashboard',
  };

  return dashboardRoutes[role] || '/dashboard';
};

/**
 * Get allowed routes for user role
 * @param {Object} user - User object
 * @returns {Array} - Array of allowed routes
 */
export const getAllowedRoutes = (user) => {
  if (!user || !user.role) {
    return ['/login'];
  }

  const role = user.role.toLowerCase();
  
  const routesByRole = {
    'doctor': ['/consultation', '/patients', '/doctor-dashboard'],
    'receptionist': ['/appointments', '/patients', '/billing', '/receptionist-dashboard'],
    'lab technician': ['/laboratory', '/lab-dashboard'],
    'lab_technician': ['/laboratory', '/lab-dashboard'],
    'labtechnician': ['/laboratory', '/lab-dashboard'],
    'pharmacist': ['/pharmacy', '/pharmacy-dashboard'],
    'cashier': ['/billing', '/cashier-dashboard'],
    'admin': ['/admin-dashboard', '/patients', '/billing', '/pharmacy', '/laboratory', '/consultation'],
  };

  return routesByRole[role] || [];
};

export default {
  hasRole,
  isDoctor,
  isReceptionist,
  isLabTechnician,
  isPharmacist,
  isCashier,
  isAdmin,
  canAccessConsultation,
  canAccessLab,
  canAccessPharmacy,
  canAccessBilling,
  canProcessPayments,
  canViewPatientDashboard,
  getDashboardRoute,
  getAllowedRoutes,
};
