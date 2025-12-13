import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/common/Layout";
import TestRequestTable from "../components/lab/TestRequestTable";
import LabRequestDrawer from "../components/lab/LabRequestDrawer";
import SearchAndFilter from "../components/lab/SearchAndFilter";
import SubmitResultModal from "../components/lab/SubmitResultModal";
import { getLabRequests, submitLabResults, updateLabRequestStatus } from "../services/labService";
import { useAuth } from "../context/AuthContext";

const Laboratory = () => {
  const { user } = useAuth();
  
  // State management
  const [labRequests, setLabRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    startDate: "",
    endDate: "",
  });

  // Fetch lab requests on component mount
  useEffect(() => {
    fetchLabRequests();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, labRequests]);

  /**
   * Fetch all lab requests from backend
   */
  const fetchLabRequests = async () => {
    setLoading(true);
    try {
      console.log("🔍 [Laboratory] Fetching lab requests with filters:", filters);
      const result = await getLabRequests({
        status: filters.status !== "all" ? filters.status : undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
      });

      console.log("📊 [Laboratory] API Result:", result);
      console.log("✅ [Laboratory] Success:", result.success);
      console.log("📝 [Laboratory] Data count:", result.data?.length);

      if (result.success) {
        setLabRequests(result.data || []);
        console.log("✨ [Laboratory] Lab requests set:", result.data?.length, "items");
      } else {
        console.error("❌ [Laboratory] Failed to fetch lab requests:", result.error);
        setLabRequests([]);
      }
    } catch (err) {
      console.error("💥 [Laboratory] Error fetching lab requests:", err);
      setLabRequests([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to lab requests
   */
  const applyFilters = () => {
    let filtered = [...labRequests];

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((req) => req.status === filters.status);
    }

    // Search filter (patient name, test name, or request ID)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.patient_name?.toLowerCase().includes(searchLower) ||
          req.test_name?.toLowerCase().includes(searchLower) ||
          req.id?.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter((req) => {
        const reqDate = new Date(req.created_at);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        return reqDate >= start && reqDate <= end;
      });
    }

    setFilteredRequests(filtered);
  };

  /**
   * Handle opening the drawer with selected request
   */
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  /**
   * Handle closing the drawer
   */
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRequest(null);
  };

  /**
   * Handle opening result submission modal
   */
  const handleSubmitResults = (request) => {
    setSelectedTest(request);
    setIsResultModalOpen(true);
  };

  /**
   * Handle closing result modal
   */
  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    setSelectedTest(null);
  };

  /**
   * Handle result submission success
   */
  const handleResultSubmitted = () => {
    fetchLabRequests();
    handleCloseResultModal();
  };

  /**
   * Handle status update
   */
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const result = await updateLabRequestStatus(requestId, { status: newStatus });
      if (result.success) {
        fetchLabRequests();
      } else {
        console.error("Failed to update status:", result.error);
        alert("Failed to update status: " + result.error);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("An error occurred while updating status");
    }
  };

  /**
   * Handle starting processing
   */
  const handleStartProcessing = async (requestId) => {
    await handleStatusUpdate(requestId, "processing");
    handleCloseDrawer();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white text-xl">Loading lab requests...</p>
          </div>
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
                  Laboratory Management 🔬
                </h1>
                <p className="text-purple-300/70">
                  Manage and process laboratory test requests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl">
                  <span className="text-purple-300 text-sm font-semibold">
                    {filteredRequests.length} Requests
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SearchAndFilter
              filters={filters}
              onFilterChange={setFilters}
              onRefresh={fetchLabRequests}
            />
          </motion.div>

          {/* Test Request Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TestRequestTable
              requests={filteredRequests}
              onViewRequest={handleViewRequest}
              onSubmitResults={handleSubmitResults}
              onStatusUpdate={handleStatusUpdate}
              loading={loading}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Lab Request Drawer */}
      {isDrawerOpen && selectedRequest && (
        <LabRequestDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          labRequest={selectedRequest}
          onStartProcessing={handleStartProcessing}
          onSubmitResults={handleSubmitResults}
        />
      )}

      {/* Submit Result Modal */}
      {isResultModalOpen && selectedTest && (
        <SubmitResultModal
          isOpen={isResultModalOpen}
          onClose={handleCloseResultModal}
          labRequest={selectedTest}
          onSubmit={handleResultSubmitted}
        />
      )}
    </Layout>
  );
};

export default Laboratory;
