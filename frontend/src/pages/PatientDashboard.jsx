import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeader from "../components/patient/PatientHeader";
import VisitsCard from "../components/patient/VisitsCard";
import PrescriptionsCard from "../components/patient/PrescriptionsCard";
import LabResultsCard from "../components/patient/LabResultsCard";
import BillingCard from "../components/patient/BillingCard";
import ConsultationSummaryModal from "../components/patient/ConsultationSummaryModal";
import LabResultModal from "../components/patient/LabResultModal";
import InvoiceModal from "../components/patient/InvoiceModal";

// Mock patient data
const mockPatientData = {
  patientId: "P-2024-001",
  name: "Sara Bekele",
  age: 29,
  gender: "Female",
  phone: "+251-911-234567",
  email: "sara.bekele@email.com",
  address: "Addis Ababa, Ethiopia",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  emergencyContact: {
    name: "Abebe Bekele",
    relation: "Spouse",
    phone: "+251-911-765432",
  },
  stats: {
    totalVisits: 12,
    outstandingBalance: 850,
    activePrescriptions: 2,
    pendingLabResults: 1,
  },
  visits: [
    {
      id: "V-2024-150",
      date: "2025-12-10T10:30:00",
      doctor: "Dr. Amanuel Tesfaye",
      department: "General Medicine",
      status: "COMPLETED",
      diagnosis: "Acute Upper Respiratory Infection",
      symptoms: ["Cough", "Fever", "Sore throat"],
      vitals: {
        bloodPressure: "120/80",
        heartRate: 78,
        temperature: 38.2,
        weight: 65,
        height: 165,
        spo2: 98,
      },
      prescriptions: [
        {
          medicine: "Amoxicillin 500mg",
          dosage: "500mg",
          frequency: "TID",
          duration: "7 days",
        },
        {
          medicine: "Paracetamol 500mg",
          dosage: "500mg",
          frequency: "QID",
          duration: "5 days",
        },
      ],
      testsOrdered: ["CBC", "Chest X-Ray"],
      notes: "Patient advised to rest and increase fluid intake.",
    },
    {
      id: "V-2024-135",
      date: "2025-11-25T14:15:00",
      doctor: "Dr. Sarah Ahmed",
      department: "Cardiology",
      status: "COMPLETED",
      diagnosis: "Hypertension - Stage 1",
      symptoms: ["Headache", "Dizziness"],
      vitals: {
        bloodPressure: "145/92",
        heartRate: 85,
        temperature: 36.8,
        weight: 66,
        height: 165,
        spo2: 99,
      },
      prescriptions: [
        {
          medicine: "Amlodipine 5mg",
          dosage: "5mg",
          frequency: "OD",
          duration: "30 days",
        },
      ],
      testsOrdered: ["ECG", "Lipid Profile"],
      notes: "Follow-up in 2 weeks. Monitor blood pressure daily.",
    },
    {
      id: "V-2024-098",
      date: "2025-10-15T09:00:00",
      doctor: "Dr. Yohannes Bekele",
      department: "General Medicine",
      status: "COMPLETED",
      diagnosis: "Annual Health Checkup",
      symptoms: ["None - Routine checkup"],
      vitals: {
        bloodPressure: "118/76",
        heartRate: 72,
        temperature: 36.6,
        weight: 64,
        height: 165,
        spo2: 99,
      },
      prescriptions: [],
      testsOrdered: ["CBC", "Urinalysis", "Blood Sugar"],
      notes: "All parameters within normal range. Continue healthy lifestyle.",
    },
  ],
  prescriptions: [
    {
      id: "RX-2024-450",
      medicine: "Amlodipine 5mg",
      dosage: "5mg",
      frequency: "Once daily",
      duration: "30 days",
      prescribedDate: "2025-11-25",
      prescribedBy: "Dr. Sarah Ahmed",
      status: "ACTIVE",
      refillsRemaining: 2,
    },
    {
      id: "RX-2024-451",
      medicine: "Metformin 500mg",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "30 days",
      prescribedDate: "2025-11-25",
      prescribedBy: "Dr. Sarah Ahmed",
      status: "ACTIVE",
      refillsRemaining: 1,
    },
    {
      id: "RX-2024-420",
      medicine: "Amoxicillin 500mg",
      dosage: "500mg",
      frequency: "Three times daily",
      duration: "7 days",
      prescribedDate: "2025-12-10",
      prescribedBy: "Dr. Amanuel Tesfaye",
      status: "COMPLETED",
      refillsRemaining: 0,
    },
  ],
  labResults: [
    {
      id: "LAB-2024-890",
      requestDate: "2025-12-10",
      tests: [
        {
          name: "Complete Blood Count (CBC)",
          status: "PENDING",
          result: null,
        },
        {
          name: "Chest X-Ray",
          status: "PENDING",
          result: null,
        },
      ],
      orderedBy: "Dr. Amanuel Tesfaye",
      status: "PENDING",
    },
    {
      id: "LAB-2024-850",
      requestDate: "2025-11-25",
      completedDate: "2025-11-26",
      tests: [
        {
          name: "ECG",
          status: "COMPLETED",
          result: "Normal sinus rhythm",
          referenceRange: "60-100 bpm",
          notes: "No abnormalities detected",
        },
        {
          name: "Lipid Profile",
          status: "COMPLETED",
          result: "Total Cholesterol: 185 mg/dL",
          referenceRange: "<200 mg/dL",
          notes: "Within normal limits",
        },
      ],
      orderedBy: "Dr. Sarah Ahmed",
      status: "COMPLETED",
      technician: "Lab Tech - Ahmed Hassan",
    },
    {
      id: "LAB-2024-720",
      requestDate: "2025-10-15",
      completedDate: "2025-10-16",
      tests: [
        {
          name: "Complete Blood Count (CBC)",
          status: "COMPLETED",
          result: "WBC: 7.2, RBC: 4.8, Hgb: 13.5",
          referenceRange: "WBC: 4-11, RBC: 4.2-5.4, Hgb: 12-16",
          notes: "All values within normal range",
        },
        {
          name: "Urinalysis",
          status: "COMPLETED",
          result: "Normal",
          referenceRange: "Clear, pH 5-7",
          notes: "No abnormalities",
        },
        {
          name: "Blood Sugar (Fasting)",
          status: "COMPLETED",
          result: "92 mg/dL",
          referenceRange: "70-100 mg/dL",
          notes: "Normal fasting glucose",
        },
      ],
      orderedBy: "Dr. Yohannes Bekele",
      status: "COMPLETED",
      technician: "Lab Tech - Fatima Mohammed",
    },
  ],
  billingHistory: [
    {
      billId: 9001,
      date: "2025-12-10",
      consultationId: "V-2024-150",
      totalAmount: 850,
      paidAmount: 0,
      status: "UNPAID",
      items: [
        { name: "Consultation Fee", qty: 1, price: 150 },
        { name: "CBC Lab Test", qty: 1, price: 200 },
        { name: "Chest X-Ray", qty: 1, price: 300 },
        { name: "Medications", qty: 1, price: 200 },
      ],
    },
    {
      billId: 8950,
      date: "2025-11-25",
      consultationId: "V-2024-135",
      totalAmount: 1200,
      paidAmount: 1200,
      status: "PAID",
      items: [
        { name: "Specialist Consultation", qty: 1, price: 300 },
        { name: "ECG Test", qty: 1, price: 400 },
        { name: "Lipid Profile", qty: 1, price: 300 },
        { name: "Medications", qty: 1, price: 200 },
      ],
    },
    {
      billId: 8800,
      date: "2025-10-15",
      consultationId: "V-2024-098",
      totalAmount: 650,
      paidAmount: 650,
      status: "PAID",
      items: [
        { name: "Consultation Fee", qty: 1, price: 150 },
        { name: "CBC Test", qty: 1, price: 200 },
        { name: "Urinalysis", qty: 1, price: 100 },
        { name: "Blood Sugar Test", qty: 1, price: 200 },
      ],
    },
  ],
};

const PatientDashboard = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setPatient(mockPatientData);
      setLoading(false);
    }, 800);
  }, [patientId]);

  const handleViewConsultation = (visit) => {
    setSelectedVisit(visit);
  };

  const handleViewLabResult = (labResult) => {
    setSelectedLabResult(labResult);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 p-8 animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Patient Not Found</h2>
          <p className="text-indigo-300/70 mb-6">
            The patient you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/patients")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/patients")}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 
                   border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg
                   text-indigo-300 hover:text-indigo-200 transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Patients
        </motion.button>

        {/* Patient Header */}
        <PatientHeader patient={patient} />

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visits History */}
          <VisitsCard
            visits={patient.visits}
            onViewConsultation={handleViewConsultation}
          />

          {/* Prescriptions History */}
          <PrescriptionsCard prescriptions={patient.prescriptions} />

          {/* Lab Results History */}
          <LabResultsCard
            labResults={patient.labResults}
            onViewLabResult={handleViewLabResult}
          />

          {/* Billing & Payments History */}
          <BillingCard
            billingHistory={patient.billingHistory}
            onViewInvoice={handleViewInvoice}
          />
        </div>
      </motion.div>

      {/* Modals */}
      {selectedVisit && (
        <ConsultationSummaryModal
          visit={selectedVisit}
          onClose={() => setSelectedVisit(null)}
        />
      )}

      {selectedLabResult && (
        <LabResultModal
          labResult={selectedLabResult}
          patientName={patient.name}
          onClose={() => setSelectedLabResult(null)}
        />
      )}

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          patientName={patient.name}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
