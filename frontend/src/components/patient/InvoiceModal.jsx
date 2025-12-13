import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const InvoiceModal = ({ invoice, patientName, onClose }) => {
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "UNPAID":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-300",
          icon: "⚠️",
        };
      case "PARTIAL":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-300",
          icon: "⏳",
        };
      case "PAID":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-300",
          icon: "✓",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-300",
          icon: "•",
        };
    }
  };

  const statusConfig = getStatusConfig(invoice.status);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="backdrop-blur-xl bg-slate-900/95 rounded-2xl border-2 border-cyan-500/30 
                   shadow-2xl shadow-cyan-500/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  💰 Invoice Details
                </h2>
                <p className="text-cyan-300/70">Invoice #{invoice.billId}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-cyan-300 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Invoice Info */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Invoice Information
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold
                            ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border shadow-lg`}
                >
                  <span>{statusConfig.icon}</span>
                  {invoice.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-cyan-300/50 mb-1">Patient</p>
                  <p className="text-white font-semibold">{patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-300/50 mb-1">
                    Consultation ID
                  </p>
                  <p className="text-white font-mono">
                    {invoice.consultationId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-cyan-300/50 mb-1">Invoice Date</p>
                  <p className="text-white">{formatDate(invoice.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-300/50 mb-1">Invoice ID</p>
                  <p className="text-white font-mono">#{invoice.billId}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-cyan-500/20 overflow-hidden">
              <div className="p-6 border-b border-cyan-500/20">
                <h3 className="text-lg font-bold text-white">Invoice Items</h3>
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
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-cyan-500/5 transition-all duration-300"
                      >
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">
                            {item.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-cyan-300/70 font-mono">
                            {item.qty}
                          </span>
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
            </div>

            {/* Payment Summary */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-6">
                Payment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/70">Subtotal</span>
                  <span className="text-white font-mono text-lg font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/70">Tax/VAT</span>
                  <span className="text-white font-mono text-lg font-semibold">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/70">Discount</span>
                  <span className="text-orange-400 font-mono text-lg font-semibold">
                    {formatCurrency(discount)}
                  </span>
                </div>
                <div className="border-t border-cyan-500/20 pt-4"></div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold text-white">
                    Grand Total
                  </span>
                  <span className="text-white font-mono text-2xl font-bold">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Amount Paid</span>
                  <span className="text-green-400 font-mono text-lg font-semibold">
                    {formatCurrency(invoice.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold text-white">
                    Balance Due
                  </span>
                  <span
                    className={`font-mono text-2xl font-bold ${
                      balanceDue > 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {formatCurrency(balanceDue)}
                  </span>
                </div>
              </div>

              {/* Payment Status Indicator */}
              <div className="mt-6 pt-6 border-t border-cyan-500/20">
                {balanceDue === 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-300 font-semibold">Fully Paid</p>
                      <p className="text-green-300/60 text-sm">
                        This invoice has been paid in full
                      </p>
                    </div>
                  </div>
                ) : invoice.paidAmount > 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-blue-300 font-semibold">
                        Partially Paid
                      </p>
                      <p className="text-blue-300/60 text-sm">
                        {formatCurrency(balanceDue)} remaining
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-300 font-semibold">
                        Payment Required
                      </p>
                      <p className="text-red-300/60 text-sm">
                        Full amount of {formatCurrency(balanceDue)} is due
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-cyan-500/20 p-6 bg-slate-900/95 backdrop-blur-xl flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 
                       border border-cyan-500/30 hover:border-cyan-500/50
                       text-cyan-300 hover:text-cyan-200 font-semibold rounded-xl
                       transition-all duration-300 flex items-center justify-center gap-2"
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
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 
                       hover:from-cyan-600 hover:to-blue-600
                       text-white font-semibold rounded-xl
                       shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                       transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InvoiceModal;
