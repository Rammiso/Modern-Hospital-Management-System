import React from "react";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-purple-400"
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, ID, doctor, or request ID..."
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none px-6 py-3 pr-10 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm cursor-pointer"
        >
          <option value="ALL" className="bg-slate-800">All Status</option>
          <option value="PENDING" className="bg-slate-800">Pending</option>
          <option value="PROCESSING" className="bg-slate-800">Processing</option>
          <option value="COMPLETED" className="bg-slate-800">Completed</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-purple-400"
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

      {/* Date Range Picker */}
      <div className="flex gap-2">
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className="px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;
