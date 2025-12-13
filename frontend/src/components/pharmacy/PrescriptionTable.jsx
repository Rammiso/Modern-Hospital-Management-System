import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const PrescriptionTable = ({ prescriptions, loading, onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = prescriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 bg-cyan-500/20 rounded-xl flex-1"></div>
              <div className="h-16 bg-cyan-500/20 rounded-xl w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (prescriptions.length === 0) {
    return (
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-cyan-500/30 p-12 shadow-2xl shadow-cyan-500/20 text-center">
        <svg
          className="w-24 h-24 mx-auto text-cyan-400/50 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-cyan-100 mb-2">
          No Prescriptions Found
        </h3>
        <p className="text-cyan-300/70">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyan-500/30 bg-cyan-500/10">
              <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Prescription ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Doctor Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Created Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/20">
            {currentItems.map((prescription, index) => (
              <tr
                key={prescription.id}
                className="hover:bg-cyan-500/10 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-sm font-mono text-cyan-100">
                      #{prescription.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-cyan-100">
                      {prescription.patientName}
                    </div>
                    <div className="text-xs text-cyan-300/70">
                      {prescription.patientId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-cyan-200">
                    {prescription.doctorName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={prescription.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-cyan-200">
                    {formatDateTime(prescription.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewDetails(prescription)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-sm hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 group-hover:ring-2 group-hover:ring-cyan-400/50"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-cyan-500/30 bg-cyan-500/5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-cyan-300">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, prescriptions.length)} of{" "}
              {prescriptions.length} prescriptions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 border border-cyan-500/30 rounded-lg text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                      : "bg-white/5 border border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/5 border border-cyan-500/30 rounded-lg text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTable;
