/**
 * useRoleAccess Hook
 * Custom hook for role-based access control
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
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
} from '../utils/roleGuards';

/**
 * Custom hook for role-based access control
 * @returns {Object} - Role access utilities
 */
export const useRoleAccess = () => {
  const { user } = useAuth();

  const roleAccess = useMemo(() => ({
    // User info
    user,
    userRole: user?.role?.toLowerCase() || null,
    
    // Role checks
    hasRole: (roles) => hasRole(user, roles),
    isDoctor: isDoctor(user),
    isReceptionist: isReceptionist(user),
    isLabTechnician: isLabTechnician(user),
    isPharmacist: isPharmacist(user),
    isCashier: isCashier(user),
    isAdmin: isAdmin(user),
    
    // Module access checks
    canAccessConsultation: canAccessConsultation(user),
    canAccessLab: canAccessLab(user),
    canAccessPharmacy: canAccessPharmacy(user),
    canAccessBilling: canAccessBilling(user),
    canProcessPayments: canProcessPayments(user),
    canViewPatientDashboard: canViewPatientDashboard(user),
    
    // Route utilities
    dashboardRoute: getDashboardRoute(user),
    allowedRoutes: getAllowedRoutes(user),
  }), [user]);

  return roleAccess;
};

export default useRoleAccess;
