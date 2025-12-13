import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Alert from "../components/common/Alert";
import PatientFormModal from "../components/patients/PatientFormModal";
import { usePatient } from "../context/PatientContext";

const Patients = () => {
  const navigate = useNavigate();
  const {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    searchPatients,
    clearError,
  } = usePatient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterGender, setFilterGender] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      await fetchPatients();
    } catch (err) {
      console.error("Failed to load patients:", err);
    }
  };

  const handleAddPatient = async (patientData) => {
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, patientData);
        setSuccessMessage("Patient updated successfully!");
      } else {
        await createPatient(patientData);
        setSuccessMessage("Patient registered successfully!");
      }
      setIsModalOpen(false);
      setEditingPatient(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      throw err;
    }
  };

  const handleEditPatient = (e, patient) => {
    e.stopPropagation(); // Prevent row click
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleViewPatient = (patient) => {
    // Navigate to patient dashboard
    navigate(`/patients/${patient.patient_id}`);
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (term.trim()) {
      try {
        await searchPatients(term);
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else {
      loadPatients();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter and paginate patients
  const filteredPatients = patients.filter((patient) => {
    if (filterGender !== "ALL" && patient.gender?.toLowerCase() !== filterGender.toLowerCase()) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  👥 Patient Management
                </h1>
                <p className="text-indigo-300/70">
                  Register and manage patient information
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                         hover:from-indigo-600 hover:to-purple-600
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
                         transition-all duration-300 transform hover:scale-105
                         flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Patient
              </button>
            </div>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
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
              <p className="text-green-300 font-semibold">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage("")}
                className="ml-auto text-green-300 hover:text-green-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <Alert type="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-indigo-400"
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
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name, phone, or patient ID..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-indigo-500/30 
                             rounded-xl text-white placeholder-indigo-300/40
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                             transition-all duration-300 backdrop-blur-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearch("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 hover:text-indigo-300"
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

              {/* Gender Filter */}
              <div className="md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-indigo-400"
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
                    value={filterGender}
                    onChange={(e) => {
                      setFilterGender(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-12 pr-10 py-3 bg-white/5 border border-indigo-500/30 
                             rounded-xl text-white appearance-none cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                             transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="ALL" className="bg-slate-800 text-white">
                      All Genders
                    </option>
                    <option value="male" className="bg-slate-800 text-white">
                      Male
                    </option>
                    <option value="female" className="bg-slate-800 text-white">
                      Female
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-indigo-400"
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

              {/* Refresh Button */}
              <button
                onClick={loadPatients}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-indigo-500/30 
                         hover:border-indigo-500/50 rounded-xl text-indigo-300 hover:text-indigo-200
                         transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
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
            </div>
          </motion.div>

          {/* Patient Table */}
          {loading ? (
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-indigo-300 mt-4">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl p-12 text-center"
            >
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No patients found
              </h3>
              <p className="text-indigo-300/60">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Click 'Add New Patient' to get started"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Blood Group
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currentPatients.map((patient, index) => (
                        <motion.tr
                          key={patient.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleViewPatient(patient)}
                          className="hover:bg-indigo-500/10 transition-all duration-300 cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono font-semibold text-indigo-400">
                              {patient.patient_id || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                              {patient.full_name || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-indigo-300/70">
                              {patient.phone || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                patient.gender?.toLowerCase() === "male"
                                  ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                                  : patient.gender?.toLowerCase() === "female"
                                  ? "bg-pink-500/20 border border-pink-500/50 text-pink-300"
                                  : "bg-gray-500/20 border border-gray-500/50 text-gray-300"
                              }`}
                            >
                              {patient.gender
                                ? patient.gender.charAt(0).toUpperCase() +
                                  patient.gender.slice(1)
                                : "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-white">
                              {calculateAge(patient.date_of_birth)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-indigo-300/70">
                              {patient.blood_group || "Not specified"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-indigo-300/60">
                              {formatDate(patient.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={(e) => handleEditPatient(e, patient)}
                              className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 
                                       hover:from-indigo-500/30 hover:to-purple-500/30 
                                       border border-indigo-500/30 hover:border-indigo-400/50
                                       text-indigo-300 hover:text-indigo-200 text-sm font-medium rounded-lg
                                       transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                            >
                              Edit
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
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-xl border border-indigo-500/20 px-6 py-4 mt-4"
                >
                  <div className="text-sm text-indigo-300/70">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of{" "}
                    {filteredPatients.length} patients
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-indigo-500/20 
                               text-indigo-300 rounded-lg transition-all duration-300
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
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                                : "bg-white/5 hover:bg-white/10 border border-indigo-500/20 text-indigo-300"
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
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-indigo-500/20 
                               text-indigo-300 rounded-lg transition-all duration-300
                               disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Patient Form Modal */}
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddPatient}
        initialData={editingPatient}
      />
    </Layout>
  );
};

export default Patients;
