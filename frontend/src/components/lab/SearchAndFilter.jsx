import React from "react";

const SearchAndFilter = ({ filters, onFilterChange, onRefresh }) => {
  const handleSearchChange = (value) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleStatusChange = (value) => {
    onFilterChange({ ...filters, status: value });
  };

  const handleStartDateChange = (value) => {
    onFilterChange({ ...filters, startDate: value });
  };

  const handleEndDateChange = (value) => {
    onFilterChange({ ...filters, endDate: value });
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6">
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
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by patient name, test name, or request ID..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none px-6 py-3 pr-10 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <option value="all" className="bg-slate-800">All Status</option>
            <option value="requested" className="bg-slate-800">Requested</option>
            <option value="sample_collected" className="bg-slate-800">Sample Collected</option>
            <option value="processing" className="bg-slate-800">Processing</option>
            <option value="completed" className="bg-slate-800">Completed</option>
            <option value="cancelled" className="bg-slate-800">Cancelled</option>
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
            value={filters.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          />
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-xl transition-all duration-300 flex items-center gap-2"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
