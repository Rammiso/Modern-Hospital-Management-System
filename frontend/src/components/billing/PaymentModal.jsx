import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PaymentModal = ({ invoice, balanceDue, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountReceived, setAmountReceived] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");
  const [changeDue, setChangeDue] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const paymentMethods = [
    { value: "CASH", label: "Cash", icon: "💵" },
    { value: "MOBILE_MONEY", label: "Mobile Money", icon: "📱" },
    { value: "POS", label: "POS/Card", icon: "💳" },
    { value: "BANK_TRANSFER", label: "Bank Transfer", icon: "🏦" },
  ];

  // Calculate change due
  useEffect(() => {
    const amount = parseFloat(amountReceived) || 0;
    if (amount > balanceDue) {
      setChangeDue(amount - balanceDue);
    } else {
      setChangeDue(0);
    }
  }, [amountReceived, balanceDue]);

  const formatCurrency = (amount) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!amountReceived || parseFloat(amountReceived) <= 0) {
      newErrors.amountReceived = "Please enter a valid amount";
    }

    if (parseFloat(amountReceived) > balanceDue * 2) {
      newErrors.amountReceived = "Amount seems unusually high";
    }

    if (
      paymentMethod !== "CASH" &&
      (!transactionRef || transactionRef.trim() === "")
    ) {
      newErrors.transactionRef = "Transaction reference is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const paymentAmount = Math.min(
        parseFloat(amountReceived),
        balanceDue
      );
      
      onPaymentSuccess(invoice.billId, paymentAmount);
      setSubmitting(false);
      setShowSuccess(true);

      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

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
                   shadow-2xl shadow-cyan-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  💰 Add Payment
                </h2>
                <p className="text-cyan-300/70">
                  Invoice #{invoice.billId} - {invoice.patientName}
                </p>
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

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-6 mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-300"
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
                  <p className="text-green-300 font-semibold">
                    Payment Recorded Successfully!
                  </p>
                  <p className="text-green-300/70 text-sm">
                    Invoice has been updated
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Balance Due Display */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/70">Balance Due</span>
                <span className="text-3xl font-bold font-mono text-white">
                  {formatCurrency(balanceDue)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                      paymentMethod === method.value
                        ? "bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 border-white/10 hover:border-cyan-500/30"
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span
                      className={`font-medium ${
                        paymentMethod === method.value
                          ? "text-cyan-300"
                          : "text-white/70"
                      }`}
                    >
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Received */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-2">
                Amount Received *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-semibold">
                  ETB
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-16 pr-4 py-3 bg-white/5 border rounded-xl text-white text-lg font-mono
                           focus:outline-none focus:ring-2 transition-all duration-300 ${
                             errors.amountReceived
                               ? "border-red-500/50 focus:ring-red-500/50"
                               : "border-cyan-500/30 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                           }`}
                />
              </div>
              {errors.amountReceived && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.amountReceived}
                </p>
              )}
            </div>

            {/* Change Due (if applicable) */}
            {changeDue > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-orange-300/70">Change Due</span>
                  <span className="text-2xl font-bold font-mono text-orange-300">
                    {formatCurrency(changeDue)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Transaction Reference (for non-cash) */}
            {paymentMethod !== "CASH" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-sm font-semibold text-cyan-300 mb-2">
                  Transaction Reference *
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Enter transaction ID or reference number"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white
                           focus:outline-none focus:ring-2 transition-all duration-300 ${
                             errors.transactionRef
                               ? "border-red-500/50 focus:ring-red-500/50"
                               : "border-cyan-500/30 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                           }`}
                />
                {errors.transactionRef && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.transactionRef}
                  </p>
                )}
              </motion.div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-xl text-white
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                         transition-all duration-300 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-cyan-500/30 
                         text-cyan-300 font-semibold rounded-xl transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-600 hover:to-blue-600
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                         transition-all duration-300 transform hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Submit Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
