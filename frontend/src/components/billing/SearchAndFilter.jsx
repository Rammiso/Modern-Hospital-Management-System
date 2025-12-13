import React from "react";
import { motion } from "framer-motion";

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
}) => {
  const statusOptions = [
    { value: "ALL", label: "All Invoices" },
    { value: "UNPAID", label: "Unpaid" },
    { value: "PARTIAL", label: "Partially Paid" },
    { value: "PAID", label: "Paid" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-6 mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, bill ID, or consultation ID..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-cyan-500/30 
                       rounded-xl text-white placeholder-cyan-300/40
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                       transition-all duration-300 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-300"
              >
                <svg
                  className="h-5 w-5"
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
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white/5 border border-cyan-500/30 
                       rounded-xl text-white appearance-none cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                       transition-all duration-300 backdrop-blur-sm"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-slate-800 text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchAndFilter;
