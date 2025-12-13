import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InvoiceTable from "../components/billing/InvoiceTable";
import InvoiceView from "../components/billing/InvoiceView";
import SearchAndFilter from "../components/billing/SearchAndFilter";

// Mock data for invoices
const mockInvoices = [
  {
    billId: 9001,
    patientName: "Abdi Ibrahim",
    patientId: "P-2024-001",
    consultationId: "C-2024-150",
    status: "UNPAID",
    totalAmount: 850,
    paidAmount: 0,
    lastUpdated: "2025-12-13T10:30:00",
    patientAge: 35,
    patientSex: "Male",
    doctor: "Dr. Amanuel Tesfaye",
    department: "General Medicine",
    items: [
      { name: "Consultation Fee", qty: 1, price: 150 },
      { name: "CBC Lab Test", qty: 1, price: 200 },
      { name: "Amoxicillin 500mg", qty: 1, price: 100 },
      { name: "Ultrasound", qty: 1, price: 400 },
    ],
  },
  {
    billId: 9002,
    patientName: "Fatima Hassan",
    patientId: "P-2024-002",
    consultationId: "C-2024-151",
    status: "PARTIAL",
    totalAmount: 1200,
    paidAmount: 500,
    lastUpdated: "2025-12-13T09:15:00",
    patientAge: 28,
    patientSex: "Female",
    doctor: "Dr. Sarah Ahmed",
    department: "Pediatrics",
    items: [
      { name: "Consultation Fee", qty: 1, price: 150 },
      { name: "X-Ray Chest", qty: 1, price: 350 },
      { name: "Blood Test Panel", qty: 1, price: 300 },
      { name: "Medications", qty: 1, price: 400 },
    ],
  },
  {
    billId: 9003,
    patientName: "Mohammed Ali",
    patientId: "P-2024-003",
    consultationId: "C-2024-152",
    status: "PAID",
    totalAmount: 650,
    paidAmount: 650,
    lastUpdated: "2025-12-12T16:45:00",
    patientAge: 42,
    patientSex: "Male",
    doctor: "Dr. Amanuel Tesfaye",
    department: "General Medicine",
    items: [
      { name: "Consultation Fee", qty: 1, price: 150 },
      { name: "Urinalysis", qty: 1, price: 100 },
      { name: "Medications", qty: 1, price: 400 },
    ],
  },
  {
    billId: 9004,
    patientName: "Hawa Yusuf",
    patientId: "P-2024-004",
    consultationId: "C-2024-153",
    status: "UNPAID",
    totalAmount: 2100,
    paidAmount: 0,
    lastUpdated: "2025-12-13T11:00:00",
    patientAge: 55,
    patientSex: "Female",
    doctor: "Dr. Yohannes Bekele",
    department: "Cardiology",
    items: [
      { name: "Specialist Consultation", qty: 1, price: 300 },
      { name: "ECG Test", qty: 1, price: 400 },
      { name: "Echocardiogram", qty: 1, price: 800 },
      { name: "Medications", qty: 1, price: 600 },
    ],
  },
  {
    billId: 9005,
    patientName: "Ahmed Osman",
    patientId: "P-2024-005",
    consultationId: "C-2024-154",
    status: "PARTIAL",
    totalAmount: 950,
    paidAmount: 300,
    lastUpdated: "2025-12-13T08:30:00",
    patientAge: 31,
    patientSex: "Male",
    doctor: "Dr. Sarah Ahmed",
    department: "Orthopedics",
    items: [
      { name: "Consultation Fee", qty: 1, price: 150 },
      { name: "X-Ray Limb", qty: 2, price: 250 },
      { name: "Physical Therapy Session", qty: 1, price: 200 },
      { name: "Pain Medications", qty: 1, price: 350 },
    ],
  },
];

const BillingDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
      setLoading(false);
    }, 800);
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = [...invoices];

    // Apply status filter
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((inv) => inv.status === filterStatus);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.patientName.toLowerCase().includes(query) ||
          inv.billId.toString().includes(query) ||
          inv.consultationId.toLowerCase().includes(query)
      );
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, filterStatus, invoices]);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleBackToDashboard = () => {
    setSelectedInvoice(null);
  };

  const handlePaymentSuccess = (billId, paymentAmount) => {
    // Update invoice with new payment
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.billId === billId) {
          const newPaidAmount = inv.paidAmount + paymentAmount;
          const newStatus =
            newPaidAmount >= inv.totalAmount
              ? "PAID"
              : newPaidAmount > 0
              ? "PARTIAL"
              : "UNPAID";
          return {
            ...inv,
            paidAmount: newPaidAmount,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    // Update selected invoice if it's the one being paid
    if (selectedInvoice && selectedInvoice.billId === billId) {
      const newPaidAmount = selectedInvoice.paidAmount + paymentAmount;
      const newStatus =
        newPaidAmount >= selectedInvoice.totalAmount
          ? "PAID"
          : newPaidAmount > 0
          ? "PARTIAL"
          : "UNPAID";
      setSelectedInvoice({
        ...selectedInvoice,
        paidAmount: newPaidAmount,
        status: newStatus,
      });
    }
  };

  // If an invoice is selected, show the invoice view
  if (selectedInvoice) {
    return (
      <InvoiceView
        invoice={selectedInvoice}
        onBack={handleBackToDashboard}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // Otherwise, show the dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            💰 Billing & Payments
          </h1>
          <p className="text-cyan-300/70">
            Manage invoices and process payments
          </p>
        </div>

        {/* Search and Filter Bar */}
        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Invoice Table */}
        <InvoiceTable
          invoices={filteredInvoices}
          loading={loading}
          onViewInvoice={handleViewInvoice}
        />
      </motion.div>
    </div>
  );
};

export default BillingDashboard;
