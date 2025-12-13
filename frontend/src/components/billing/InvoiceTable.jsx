import React, { useState } from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

const InvoiceTable = ({ invoices, loading, onViewInvoice }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20">
              <tr>
                {[
                  "Bill ID",
                  "Patient Name",
                  "Consultation ID",
                  "Status",
                  "Total Amount",
                  "Last Updated",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-white/5">
                  {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (invoices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-12 text-center"
      >
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No invoices found
        </h3>
        <p className="text-cyan-300/60">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Bill ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Consultation ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentInvoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.billId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-cyan-500/5 transition-all duration-300 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold text-cyan-400">
                      #{invoice.billId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {invoice.patientName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-cyan-300/70">
                      {invoice.consultationId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-white font-mono">
                      {formatCurrency(invoice.totalAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-cyan-300/60">
                      {formatDate(invoice.lastUpdated)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                               hover:from-cyan-500/30 hover:to-blue-500/30 
                               border border-cyan-500/30 hover:border-cyan-400/50
                               text-cyan-300 hover:text-cyan-200 text-sm font-medium rounded-lg
                               transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20
                               group-hover:scale-105"
                    >
                      View Invoice
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-xl border border-cyan-500/20 px-6 py-4"
        >
          <div className="text-sm text-cyan-300/70">
            Showing {startIndex + 1} to {Math.min(endIndex, invoices.length)} of{" "}
            {invoices.length} invoices
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-cyan-500/20 
                       text-cyan-300 rounded-lg transition-all duration-300
                       disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-white/5 hover:bg-white/10 border border-cyan-500/20 text-cyan-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-cyan-500/20 
                       text-cyan-300 rounded-lg transition-all duration-300
                       disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InvoiceTable;
