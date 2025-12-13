import React, { useState } from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import InvoiceSummaryCard from "./InvoiceSummaryCard";
import PaymentModal from "./PaymentModal";

const InvoiceView = ({ invoice, onBack, onPaymentSuccess }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const calculateItemTotal = (item) => {
    return item.qty * item.price;
  };

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  const tax = 0; // Placeholder
  const discount = 0; // Placeholder
  const grandTotal = subtotal + tax - discount;
  const balanceDue = grandTotal - invoice.paidAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 
                   border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg
                   text-cyan-300 hover:text-cyan-200 transition-all duration-300"
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
          Back to Dashboard
        </motion.button>

        {/* Invoice Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Invoice #{invoice.billId}
              </h1>
              <p className="text-cyan-300/70">{formatDate(invoice.lastUpdated)}</p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                Patient Information
              </h3>
              <div className="space-y-1.5">
                <p className="text-white">
                  <span className="text-cyan-300/60">Name:</span>{" "}
                  <span className="font-semibold">{invoice.patientName}</span>
                </p>
                <p className="text-white">
                  <span className="text-cyan-300/60">Patient ID:</span>{" "}
                  <span className="font-mono text-cyan-300">{invoice.patientId}</span>
                </p>
                <p className="text-white">
                  <span className="text-cyan-300/60">Age:</span> {invoice.patientAge}
                </p>
                <p className="text-white">
                  <span className="text-cyan-300/60">Sex:</span> {invoice.patientSex}
                </p>
              </div>
            </div>

            {/* Doctor & Department Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                Consultation Details
              </h3>
              <div className="space-y-1.5">
                <p className="text-white">
                  <span className="text-cyan-300/60">Doctor:</span>{" "}
                  <span className="font-semibold">{invoice.doctor}</span>
                </p>
                <p className="text-white">
                  <span className="text-cyan-300/60">Department:</span>{" "}
                  {invoice.department}
                </p>
                <p className="text-white">
                  <span className="text-cyan-300/60">Consultation ID:</span>{" "}
                  <span className="font-mono text-cyan-300">
                    {invoice.consultationId}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Invoice Items Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden mb-6"
        >
          <div className="p-6 border-b border-cyan-500/20">
            <h2 className="text-xl font-bold text-white">Invoice Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoice.items.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="hover:bg-cyan-500/5 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-cyan-300/70 font-mono">{item.qty}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-cyan-300/70 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-bold font-mono">
                        {formatCurrency(calculateItemTotal(item))}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Summary and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="lg:col-span-2">
            <InvoiceSummaryCard
              subtotal={subtotal}
              tax={tax}
              discount={discount}
              grandTotal={grandTotal}
              paidAmount={invoice.paidAmount}
              balanceDue={balanceDue}
            />
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {balanceDue > 0 && (
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-600 hover:to-blue-600
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                         transition-all duration-300 transform hover:scale-105
                         flex items-center justify-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Payment
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 
                       border border-cyan-500/30 hover:border-cyan-500/50
                       text-cyan-300 hover:text-cyan-200 font-semibold rounded-xl
                       transition-all duration-300
                       flex items-center justify-center gap-2"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Invoice
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <PaymentModal
          invoice={invoice}
          balanceDue={balanceDue}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default InvoiceView;
