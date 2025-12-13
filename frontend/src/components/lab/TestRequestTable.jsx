import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const TestRequestTable = ({ labRequests, loading, onViewTests }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = labRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(labRequests.length / itemsPerPage);

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
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-purple-500/30 p-6 shadow-2xl shadow-purple-500/20">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 bg-purple-500/20 rounded-xl flex-1"></div>
              <div className="h-16 bg-purple-500/20 rounded-xl w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (labRequests.length === 0) {
    return (
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-purple-500/30 p-12 shadow-2xl shadow-purple-500/20 text-center">
        <svg
          className="w-24 h-24 mx-auto text-purple-400/50 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 className="text-xl font-semibold text-purple-100 mb-2">
          No Lab Requests Found
        </h3>
        <p className="text-purple-300/70">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Lab Request ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Doctor Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Test Count
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Requested Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {currentItems.map((request, index) => (
              <tr
                key={request.id}
                className="hover:bg-purple-500/10 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-sm font-mono text-purple-100">
                      LAB-{request.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-purple-100">
                      {request.patientName}
                    </div>
                    <div className="text-xs text-purple-300/70">
                      {request.patientId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-purple-200">
                    {request.doctorName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                      <span className="text-sm font-semibold text-purple-200">
                        {request.tests.length} {request.tests.length === 1 ? 'test' : 'tests'}
                      </span>
                    </div>
                    {request.tests.some(t => t.urgency === "Urgent") && (
                      <div className="px-2 py-1 bg-red-500/20 border border-red-400/50 rounded text-xs font-semibold text-red-300">
                        URGENT
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-purple-200">
                    {formatDateTime(request.requestedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewTests(request)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105 group-hover:ring-2 group-hover:ring-purple-400/50"
                  >
                    View Tests
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-purple-300">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, labRequests.length)} of{" "}
              {labRequests.length} requests
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-purple-100 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                      : "bg-white/5 border border-purple-500/30 text-purple-100 hover:bg-purple-500/20"
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
                className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-purple-100 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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

export default TestRequestTable;
