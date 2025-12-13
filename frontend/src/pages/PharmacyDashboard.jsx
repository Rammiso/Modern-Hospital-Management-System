import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Pending Prescriptions",
      value: "15",
      icon: "📋",
      gradient: "from-cyan-500 to-teal-500",
      change: "Awaiting dispensing",
      changeType: "warning",
    },
    {
      title: "Dispensed Today",
      value: "42",
      icon: "💊",
      gradient: "from-blue-500 to-cyan-500",
      change: "Completed",
      changeType: "success",
    },
    {
      title: "Low Stock Items",
      value: "8",
      icon: "⚠️",
      gradient: "from-orange-500 to-yellow-500",
      change: "Needs reorder",
      changeType: "warning",
    },
    {
      title: "Revenue Today",
      value: "ETB 12,450",
      icon: "💰",
      gradient: "from-green-500 to-teal-500",
      change: "+18% from yesterday",
      changeType: "success",
    },
  ];

  const pendingPrescriptions = [
    {
      prescriptionId: "RX-2024-001",
      patientName: "Ahmed Hassan",
      patientId: "P-1234",
      doctor: "Dr. Sarah Johnson",
      medications: ["Amoxicillin 500mg", "Paracetamol 500mg"],
      quantity: 3,
      priority: "normal",
      issuedAt: "09:30 AM",
      status: "pending",
    },
    {
      prescriptionId: "RX-2024-002",
      patientName: "Fatima Ali",
      patientId: "P-1235",
      doctor: "Dr. Michael Chen",
      medications: ["Metformin 500mg", "Atorvastatin 20mg"],
      quantity: 2,
      priority: "normal",
      issuedAt: "10:00 AM",
      status: "in-progress",
    },
    {
      prescriptionId: "RX-2024-003",
      patientName: "Mohammed Ibrahim",
      patientId: "P-1236",
      doctor: "Dr. Sarah Johnson",
      medications: ["Insulin Glargine"],
      quantity: 1,
      priority: "urgent",
      issuedAt: "10:15 AM",
      status: "pending",
    },
    {
      prescriptionId: "RX-2024-004",
      patientName: "Aisha Mohamed",
      patientId: "P-1237",
      doctor: "Dr. Emily Rodriguez",
      medications: ["Ambroxol Syrup", "Cetirizine 10mg"],
      quantity: 2,
      priority: "normal",
      issuedAt: "10:30 AM",
      status: "pending",
    },
  ];

  const recentActivities = [
    {
      icon: "✅",
      iconBg: "from-green-500 to-teal-500",
      text: "Prescription dispensed",
      detail: "RX-2024-001 - Ahmed Hassan",
      time: "5 minutes ago",
    },
    {
      icon: "💊",
      iconBg: "from-cyan-500 to-teal-500",
      text: "Medication prepared",
      detail: "Amoxicillin 500mg x30 tablets",
      time: "15 minutes ago",
    },
    {
      icon: "📦",
      iconBg: "from-blue-500 to-cyan-500",
      text: "Stock received",
      detail: "New shipment - 15 items",
      time: "1 hour ago",
    },
    {
      icon: "⚠️",
      iconBg: "from-orange-500 to-yellow-500",
      text: "Low stock alert",
      detail: "Paracetamol 500mg - 20 units left",
      time: "2 hours ago",
    },
  ];

  const quickActions = [
    {
      title: "Dispense Medication",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      gradient: "from-cyan-500 to-teal-500",
      action: () => navigate("/pharmacy"),
    },
    {
      title: "View Prescriptions",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      action: () => navigate("/pharmacy"),
    },
    {
      title: "Manage Inventory",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: "from-green-500 to-teal-500",
      action: () => navigate("/pharmacy"),
    },
    {
      title: "Stock Report",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-orange-500 to-yellow-500",
      action: () => navigate("/pharmacy"),
    },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-orange-500/20 border-orange-500/50 text-orange-300",
      "in-progress": "bg-blue-500/20 border-blue-500/50 text-blue-300",
      dispensed: "bg-green-500/20 border-green-500/50 text-green-300",
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: "bg-red-500/20 border-red-500/50 text-red-300",
      normal: "bg-gray-500/20 border-gray-500/50 text-gray-300",
    };
    return badges[priority] || badges.normal;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.full_name || "Pharmacist"}! 💊
                </h1>
                <p className="text-cyan-300/70">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-cyan-300 text-sm font-semibold">
                    Pharmacy Open
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-cyan-300/70 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white font-mono mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-cyan-300/50">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  onClick={action.action}
                  className={`p-6 bg-gradient-to-br ${action.gradient} bg-opacity-10 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 group`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {action.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Prescriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">💊</span>
                  Pending Prescriptions
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pendingPrescriptions.map((prescription, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cyan-500/30 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white text-2xl">💊</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-semibold">
                              {prescription.prescriptionId}
                            </p>
                          </div>
                          <p className="text-cyan-300/70 text-sm mb-1">
                            Patient: {prescription.patientName} ({prescription.patientId})
                          </p>
                          <p className="text-cyan-300/60 text-xs mb-2">
                            Prescribed by {prescription.doctor} at {prescription.issuedAt}
                          </p>
                          <div className="mb-2">
                            <p className="text-cyan-300/50 text-xs mb-1">Medications:</p>
                            <div className="flex flex-wrap gap-1">
                              {prescription.medications.map((med, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                                >
                                  {med}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                prescription.status
                              )}`}
                            >
                              {prescription.status.replace("-", " ").charAt(0).toUpperCase() +
                                prescription.status.replace("-", " ").slice(1)}
                            </span>
                            {prescription.priority === "urgent" && (
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(
                                  prescription.priority
                                )}`}
                              >
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 text-sm font-medium rounded-lg transition-all duration-300">
                          Dispense
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-cyan-500/20">
                <button
                  onClick={() => navigate("/pharmacy")}
                  className="w-full text-center text-sm text-cyan-300 hover:text-cyan-200 transition-colors font-medium"
                >
                  View all prescriptions →
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${activity.iconBg} rounded-lg flex items-center justify-center text-lg flex-shrink-0 shadow-lg`}
                      >
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-1">
                          {activity.text}
                        </p>
                        <p className="text-cyan-300/70 text-xs mb-1">
                          {activity.detail}
                        </p>
                        <p className="text-cyan-300/50 text-xs">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PharmacyDashboard;
