import React from "react";
import { PatientProvider } from "../context/PatientContext";
import { AppointmentProvider } from "../context/AppointmentContext";

/**
 * AppProviders - Wraps the app with all necessary context providers
 * This keeps the main App.jsx clean and organized
 */
const AppProviders = ({ children }) => {
  return (
    <PatientProvider>
      <AppointmentProvider>{children}</AppointmentProvider>
    </PatientProvider>
  );
};

export default AppProviders;
