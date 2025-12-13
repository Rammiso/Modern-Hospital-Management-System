import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";
import { getLabRequests, updateLabRequestStatus } from "../services/labService";
import SubmitResultModal from "../components/lab/SubmitResultModal";
import LabRequestDrawer from "../components/lab/LabRequestDrawer";

const LabRequests = () => {
  const { user } = useAuth();
  const [labRequests, setLabRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    testType: "all",
  });

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchLabRequests();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [filters, labRequests]);

  const fetchLabRequests = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching lab requests...");
      const result = await getLabRequests();
      console.log("📊 API Result:", result);
      console.log("✅ Success:", result.success);
      console.log("📝 Data:", result.data);
      console.log("🔢 Count:", result.data?.length);
      
      if (result.success) {
        setLabRequests(result.data || []);
        console.log("✨ Lab requests set in state:", result.data?.length, "items");
      } else {
        console.error("❌ Failed to fetch lab requests:", result.error);
      }
    } catch (error) {
      console.error("💥 Error fetching lab requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...labRequests];

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((req) => req.status === filters.status);
    }

    // Test type filter
    if (filters.testType !== "all") {
      filtered = filtered.filter((req) => req.test_type === filters.testType);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.patient_name?.toLowerCase().includes(searchLower) ||
          req.test_name?.toLowerCase().includes(searchLower) ||
          req.id?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRequests(filtered);
  };

  const calculateStats = () => {
    const pending = labRequests.filter((r) => r.status === "requested").length;
    const processing = labRequests.filter(
      (r) => r.status === "sample_collected" || r.status === "processing"
    ).length;
    const completed = labRequests.filter((r) => r.status === "completed").length;

    setStats({
      pending,
      processing,
      completed,
      total: labRequests.length,
    });
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const result = await updateLabRequestStatus(requestId, { status: newStatus });
      if (result.success) {
        fetchLabRequests();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSubmitResults = (request) => {
    setSelectedRequest(request);
    setIsResultModalOpen(true);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      requested: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
      sample_collected: "bg-blue-500/20 border-blue-500/50 text-blue-300",
      processing: "bg-purple-500/20 border-purple-500/50 text-purple-300",
      completed: "bg-green-500/20 border-green-500/50 text-green-300",
      cancelled: "bg-red-500/20 border-red-500/50 text-red-300",
    };
    return badges[status] || badges.requested;
  };

  const getStatusLabel = (status) => {
    const labels = {
      requested: "Requested",
      sample_collected: "Sample Collected",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading lab requests...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Lab Requests 🧪
                </h1>
                <p className="text-purple-300/70">
                  Manage and process laboratory test requests
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Total Requests",
                value: stats.total,
                icon: "📋",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Pending",
                value: stats.pending,
                icon: "⏳",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                title: "Processing",
                value: stats.processing,
                icon: "🔬",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                title: "Completed",
                value: stats.completed,
                icon: "✅",
                gradient: "from-green-500 to-teal-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-purple-300/70 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white font-mono">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-purple-300/70 text-sm font-medium mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by patient, test, or ID..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-purple-300/70 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="requested">Requested</option>
                  <option value="sample_collected">Sample Collected</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-300/70 text-sm font-medium mb-2">
                  Test Type
                </label>
                <select
                  value={filters.testType}
                  onChange={(e) =>
                    setFilters({ ...filters, testType: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="all">All Types</option>
                  <option value="blood">Blood</option>
                  <option value="urine">Urine</option>
                  <option value="imaging">Imaging</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Lab Requests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Lab Requests ({filteredRequests.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-purple-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Requested At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-purple-300/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-purple-300/50"
                      >
                        No lab requests found
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request, index) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                          {request.id?.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {request.patient_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {request.test_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/70">
                          {request.test_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                              request.status
                            )}`}
                          >
                            {getStatusLabel(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/70">
                          {formatDate(request.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-colors text-xs"
                            >
                              View
                            </button>
                            {request.status !== "completed" && (
                              <button
                                onClick={() => handleSubmitResults(request)}
                                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-lg transition-colors text-xs"
                              >
                                Submit Result
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      {isResultModalOpen && selectedRequest && (
        <SubmitResultModal
          isOpen={isResultModalOpen}
          onClose={() => {
            setIsResultModalOpen(false);
            setSelectedRequest(null);
          }}
          labRequest={selectedRequest}
          onSubmit={() => {
            fetchLabRequests();
            setIsResultModalOpen(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {isDrawerOpen && selectedRequest && (
        <LabRequestDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedRequest(null);
          }}
          labRequest={selectedRequest}
        />
      )}
    </Layout>
  );
};

export default LabRequests;
