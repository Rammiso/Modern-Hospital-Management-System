import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ConsultationsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today"); // today, upcoming, all

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/appointments");
      if (response.data) {
        let filtered = response.data;
        
        const today = new Date().toDateString();
        
        if (filter === "today") {
          filtered = filtered.filter(apt => 
            new Date(apt.appointment_date).toDateString() === today
          );
        } else if (filter === "upcoming") {
          filtered = filtered.filter(apt => 
            new Date(apt.appointment_date) >= new Date()
          );
        }
        
        setAppointments(filtered);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: "bg-blue-500/20 border-blue-500/50 text-blue-300",
      checked_in: "bg-green-500/20 border-green-500/50 text-green-300",
      in_consultation: "bg-purple-500/20 border-purple-500/50 text-purple-300",
      completed: "bg-gray-500/20 border-gray-500/50 text-gray-300",
      cancelled: "bg-red-500/20 border-red-500/50 text-red-300",
    };
    return badges[status] || badges.scheduled;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5); // HH:MM
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading appointments...</div>
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
                  My Consultations 👨‍⚕️
                </h1>
                <p className="text-purple-300/70">
                  View and manage your patient consultations
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Appointments List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Appointments ({appointments.length})
              </h2>
            </div>
            
            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-purple-300/70 text-lg">No appointments found</p>
                <p className="text-purple-300/50 text-sm mt-2">
                  {filter === "today" ? "No appointments scheduled for today" : "No appointments available"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-purple-500/10">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">👤</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg">
                            {appointment.patient_name || "Unknown Patient"}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-purple-300/70">
                            <span>📅 {formatDate(appointment.appointment_date)}</span>
                            <span>🕐 {formatTime(appointment.appointment_time)}</span>
                            <span>📝 {appointment.appointment_type || "General"}</span>
                          </div>
                          {appointment.reason && (
                            <p className="text-purple-300/60 text-sm mt-1">
                              Reason: {appointment.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                            appointment.status
                          )}`}
                        >
                          {appointment.status?.replace("_", " ").toUpperCase()}
                        </span>
                        <button
                          onClick={() => navigate(`/consultation/${appointment.id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                        >
                          Start Consultation
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ConsultationsList;
