import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppProviders from "./components/AppProviders";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDashboard from "./pages/PatientDashboard";
import Appointments from "./pages/Appointments";
import Consultation from "./pages/Consultation";
import Pharmacy from "./pages/Pharmacy";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import Laboratory from "./pages/Laboratory";
import LabDashboard from "./pages/LabDashboard";
import Billing from "./pages/Billing";
import BillingDashboard from "./pages/BillingDashboard";
import ReceptionistBooking from "./pages/ReceptionistBooking";
import Loader from "./components/common/Loader";
import { USER_ROLES } from "./utils/constants";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Role-Based Route Component
const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no roles specified, allow all authenticated users
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // Unauthorized - redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <AppProviders>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes - Available to all authenticated users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Patient Management - Receptionist, Doctor, Nurse, Admin */}
            <Route
              path="/patients"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.RECEPTIONIST,
                    USER_ROLES.DOCTOR,
                    USER_ROLES.NURSE,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <Patients />
                </RoleRoute>
              }
            />

            {/* Patient Dashboard - View individual patient details */}
            <Route
              path="/patients/:patientId"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.RECEPTIONIST,
                    USER_ROLES.DOCTOR,
                    USER_ROLES.NURSE,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <PatientDashboard />
                </RoleRoute>
              }
            />

            {/* Appointments - Receptionist, Doctor, Admin */}
            <Route
              path="/appointments"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.RECEPTIONIST,
                    USER_ROLES.DOCTOR,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <Appointments />
                </RoleRoute>
              }
            />

            {/* Receptionist Booking - Receptionist, Admin */}
            <Route
              path="/receptionist-booking"
              element={
                <RoleRoute
                  allowedRoles={[USER_ROLES.RECEPTIONIST, USER_ROLES.ADMIN]}
                >
                  <ReceptionistBooking />
                </RoleRoute>
              }
            />

            {/* Consultation - Doctor, Nurse, Admin */}
            <Route
              path="/consultation"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.DOCTOR,
                    USER_ROLES.NURSE,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <Consultation />
                </RoleRoute>
              }
            />
            <Route
              path="/consultation/:appointmentId"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.DOCTOR,
                    USER_ROLES.NURSE,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <Consultation />
                </RoleRoute>
              }
            />

            {/* Pharmacy - Pharmacist, Admin */}
            <Route
              path="/pharmacy"
              element={
                <RoleRoute
                  allowedRoles={[USER_ROLES.PHARMACIST, USER_ROLES.ADMIN]}
                >
                  <PharmacyDashboard />
                </RoleRoute>
              }
            />
            
            {/* Old Pharmacy (keep for reference) */}
            <Route
              path="/pharmacy-old"
              element={
                <RoleRoute
                  allowedRoles={[USER_ROLES.PHARMACIST, USER_ROLES.ADMIN]}
                >
                  <Pharmacy />
                </RoleRoute>
              }
            />

            {/* Laboratory - Lab Technician, Admin */}
            <Route
              path="/laboratory"
              element={
                <RoleRoute
                  allowedRoles={[USER_ROLES.LAB_TECHNICIAN, USER_ROLES.ADMIN]}
                >
                  <LabDashboard />
                </RoleRoute>
              }
            />
            
            {/* Old Laboratory (keep for reference) */}
            <Route
              path="/laboratory-old"
              element={
                <RoleRoute
                  allowedRoles={[USER_ROLES.LAB_TECHNICIAN, USER_ROLES.ADMIN]}
                >
                  <Laboratory />
                </RoleRoute>
              }
            />

            {/* Billing - Cashier, Receptionist, Admin */}
            <Route
              path="/billing"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.CASHIER,
                    USER_ROLES.RECEPTIONIST,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <BillingDashboard />
                </RoleRoute>
              }
            />
            
            {/* Old Billing (keep for reference) */}
            <Route
              path="/billing-old"
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.CASHIER,
                    USER_ROLES.RECEPTIONIST,
                    USER_ROLES.ADMIN,
                  ]}
                >
                  <Billing />
                </RoleRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 - Redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProviders>
    </AuthProvider>
  );
}

export default App;
