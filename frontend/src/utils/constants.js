// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Application Routes
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PATIENTS: "/patients",
  APPOINTMENTS: "/appointments",
  CONSULTATION: "/consultation",
  PHARMACY: "/pharmacy",
  LABORATORY: "/laboratory",
  BILLING: "/billing",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
  PHARMACIST: "pharmacist",
  LAB_TECHNICIAN: "lab_technician",
  CASHIER: "cashier",
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  CHECKED_IN: "checked_in",
  IN_CONSULTATION: "in_consultation",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

// Appointment Types
export const APPOINTMENT_TYPES = {
  NEW: "new",
  FOLLOW_UP: "follow_up",
  EMERGENCY: "emergency",
};

// Patient Status
export const PATIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DISCHARGED: "discharged",
};

// Prescription Status
export const PRESCRIPTION_STATUS = {
  PENDING: "pending",
  DISPENSED: "dispensed",
  CANCELLED: "cancelled",
};

// Lab Request Status
export const LAB_STATUS = {
  REQUESTED: "requested",
  SAMPLE_COLLECTED: "sample_collected",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Billing/Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  CANCELLED: "cancelled",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  MOBILE_MONEY: "mobile_money",
  INSURANCE: "insurance",
};

// Gender Options
export const GENDER_OPTIONS = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

// Blood Groups
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
