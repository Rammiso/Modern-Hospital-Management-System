import React from "react";
import { motion } from "framer-motion";

const BillingCard = ({ billingHistory, onViewInvoice }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "UNPAID":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-300",
          icon: "⚠️",
          glow: "shadow-red-500/20",
        };
      case "PARTIAL":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-300",
          icon: "⏳",
          glow: "shadow-blue-500/20",
        };
      case "PAID":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-300",
          icon: "✓",
          glow: "shadow-green-500/20",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-300",
          icon: "•",
          glow: "shadow-gray-500/20",
        };
    }
  };

  const totalOutstanding = billingHistory
    .filter((bill) => bill.status !== "PAID")
    .reduce((sum, bill) => sum + (bill.totalAmount - bill.paidAmount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Billing & Payments
              </h2>
              <p className="text-sm text-cyan-300/70">
                {billingHistory.length} total invoices
              </p>
            </div>
          </div>
          {totalOutstanding > 0 && (
            <div className="text-right">
              <p className="text-xs text-red-300/70 mb-1">Outstanding</p>
              <p className="text-xl font-bold font-mono text-red-400">
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Billing List */}
      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
        {billingHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-cyan-300/60">No billing records</p>
          </div>
        ) : (
          billingHistory.map((bill, index) => {
            const statusConfig = getStatusConfig(bill.status);
            const balanceDue = bill.totalAmount - bill.paidAmount;

            return (
              <motion.div
                key={bill.billId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`backdrop-blur-sm bg-white/5 rounded-xl border border-cyan-500/20 
                         hover:border-cyan-500/40 transition-all duration-300 p-4
                         ${
                           bill.status === "UNPAID"
                             ? "shadow-lg shadow-red-500/10"
                             : ""
                         }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-cyan-400">
                        #{bill.billId}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                  ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border shadow-lg ${statusConfig.glow}`}
                      >
                        <span>{statusConfig.icon}</span>
                        {bill.status}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-300/50 mb-1">
                      Consultation: {bill.consultationId}
                    </p>
                  </div>

                  <button
                    onClick={() => onViewInvoice(bill)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                             hover:from-cyan-500/30 hover:to-blue-500/30 
                             border border-cyan-500/30 hover:border-cyan-400/50
                             text-cyan-300 hover:text-cyan-200 text-sm font-medium rounded-lg
                             transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20
                             whitespace-nowrap"
                  >
                    View Invoice
                  </button>
                </div>

                {/* Amount Details */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-cyan-300/50 mb-1">Total</p>
                    <p className="text-sm text-white font-bold font-mono">
                      {formatCurrency(bill.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-300/50 mb-1">Paid</p>
                    <p className="text-sm text-green-400 font-bold font-mono">
                      {formatCurrency(bill.paidAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-300/50 mb-1">Balance</p>
                    <p
                      className={`text-sm font-bold font-mono ${
                        balanceDue > 0 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {formatCurrency(balanceDue)}
                    </p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="pt-3 border-t border-cyan-500/10">
                  <p className="text-xs text-cyan-300/50 mb-2">
                    {bill.items.length} items
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {bill.items.slice(0, 3).map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded"
                      >
                        {item.name}
                      </span>
                    ))}
                    {bill.items.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded">
                        +{bill.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-cyan-500/10 mt-3 text-xs text-cyan-300/60">
                  <span>{formatDate(bill.date)}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default BillingCard;
