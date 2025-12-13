import React from "react";
import { motion } from "framer-motion";

const InvoiceSummaryCard = ({
  subtotal,
  tax,
  discount,
  grandTotal,
  paidAmount,
  balanceDue,
}) => {
  const formatCurrency = (amount) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const summaryRows = [
    { label: "Subtotal", value: subtotal, highlight: false },
    { label: "Tax/VAT", value: tax, highlight: false },
    { label: "Discount", value: discount, highlight: false, isNegative: true },
    { label: "Grand Total", value: grandTotal, highlight: true, divider: true },
    { label: "Amount Paid", value: paidAmount, highlight: false, isPaid: true },
    {
      label: "Balance Due",
      value: balanceDue,
      highlight: true,
      isBalance: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6">Payment Summary</h2>
      <div className="space-y-4">
        {summaryRows.map((row, index) => (
          <React.Fragment key={row.label}>
            {row.divider && (
              <div className="border-t border-cyan-500/20 my-4"></div>
            )}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className={`flex justify-between items-center ${
                row.highlight ? "py-2" : ""
              }`}
            >
              <span
                className={`${
                  row.highlight
                    ? "text-lg font-bold text-white"
                    : "text-cyan-300/70"
                }`}
              >
                {row.label}
              </span>
              <span
                className={`font-mono ${
                  row.highlight
                    ? "text-2xl font-bold"
                    : "text-lg font-semibold"
                } ${
                  row.isBalance && balanceDue > 0
                    ? "text-red-400"
                    : row.isBalance && balanceDue === 0
                    ? "text-green-400"
                    : row.isPaid
                    ? "text-green-400"
                    : row.isNegative
                    ? "text-orange-400"
                    : "text-white"
                }`}
              >
                {row.isNegative && row.value > 0 ? "-" : ""}
                {formatCurrency(Math.abs(row.value))}
              </span>
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      {/* Payment Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-cyan-500/20"
      >
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
        ) : paidAmount > 0 ? (
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
              <p className="text-blue-300 font-semibold">Partially Paid</p>
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
              <p className="text-red-300 font-semibold">Payment Required</p>
              <p className="text-red-300/60 text-sm">
                Full amount of {formatCurrency(balanceDue)} is due
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InvoiceSummaryCard;
