import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";

const LabDashboard = () => {
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
      title: "Pending Tests",
      value: "18",
      icon: "⏳",
      gradient: "from-purple-500 to-pink-500",
      change: "Awaiting processing",
      changeType: "warning",
    },
    {
      title: "In Progress",
      value: "12",
      icon: "🔬",
      gradient: "from-blue-500 to-cyan-500",
      change: "Being analyzed",
      changeType: "info",
    },
    {
      title: "Completed Today",
      value: "34",
      icon: "✅",
      gradient: "from-green-500 to-teal-500",
      change: "Results ready",
      changeType: "success",
    },
    {
      title: "Critical Results",
      value: "3",
      icon: "⚠️",
      gradient: "from-red-500 to-orange-500",
      change: "Needs attention",
      changeType: "critical",
    },
  ];

  const pendingTests = [
    {
      requestId: "LAB-2024-001",
      patientName: "Ahmed Hassan",
      patientId: "P-1234",
      testName: "Complete Blood Count (CBC)",
      priority: "high",
      requestedBy: "Dr. Sarah Johnson",
      requestedAt: "09:15 AM",
      status: "pending",
    },
    {
      requestId: "LAB-2024-002",
      patientName: "Fatima Ali",
      patientId: "P-1235",
      testName: "Lipid Profile",
      priority: "normal",
      requestedBy: "Dr. Michael Chen",
      requestedAt: "09:30 AM",
      status: "in-progress",
    },
    {
      requestId: "LAB-2024-003",
      patientName: "Mohammed Ibrahim",
      patientId: "P-1236",
      testName: "Liver Function Test (LFT)",
      priority: "normal",
      requestedBy: "Dr. Sarah Johnson",
      requestedAt: "10:00 AM",
      status: "pending",
    },
    {
      requestId: "LAB-2024-004",
      patientName: "Aisha Mohamed",
      patientId: "P-1237",
      testName: "Urinalysis",
      priority: "urgent",
      requestedBy: "Dr. Emily Rodriguez",
      requestedAt: "10:15 AM",
      status: "pending",
    },
  ];

  const recentActivities = [
    {
      icon: "✅",
      iconBg: "from-green-500 to-teal-500",
      text: "Test completed",
      detail: "CBC for Ahmed Hassan - Results uploaded",
      time: "10 minutes ago",
    },
    {
      icon: "🔬",
      iconBg: "from-blue-500 to-cyan-500",
      text: "Sample received",
      detail: "Blood sample for Fatima Ali",
      time: "25 minutes ago",
    },
    {
      icon: "⚠️",
      iconBg: "from-red-500 to-orange-500",
      text: "Critical result",
      detail: "High glucose level - Dr. notified",
      time: "1 hour ago",
    },
    {
      icon: "📊",
      iconBg: "from-purple-500 to-pink-500",
      text: "Quality check passed",
      detail: "Batch QC-2024-12 approved",
      time: "2 hours ago",
    },
  ];

  const quickActions = [
    {
      title: "Process Sample",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      action: () => navigate("/laboratory"),
    },
    {
      title: "Upload Results",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      action: () => navigate("/laboratory"),
    },
    {
      title: "View Requests",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-green-500 to-teal-500",
      action: () => navigate("/laboratory"),
    },
    {
      title: "Quality Control",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-orange-500 to-yellow-500",
      action: () => navigate("/laboratory"),
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
      completed: "bg-green-500/20 border-green-500/50 text-green-300",
      critical: "bg-red-500/20 border-red-500/50 text-red-300",
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: "bg-red-500/20 border-red-500/50 text-red-300",
      high: "bg-orange-500/20 border-orange-500/50 text-orange-300",
      normal: "bg-gray-500/20 border-gray-500/50 text-gray-300",
    };
    return badges[priority] || badges.normal;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.full_name || "Lab Technician"}! 🔬
                </h1>
                <p className="text-purple-300/70">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 text-sm font-semibold">
                    Lab Active
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
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-purple-300/70 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white font-mono mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-purple-300/50">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl p-6"
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
            {/* Pending Tests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🧪</span>
                  Pending Lab Tests
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pendingTests.map((test, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-purple-500/30 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white text-2xl">🔬</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-semibold">
                              {test.testName}
                            </p>
                          </div>
                          <p className="text-purple-300/70 text-sm mb-1">
                            Patient: {test.patientName} ({test.patientId})
                          </p>
                          <p className="text-purple-300/60 text-xs mb-2">
                            Requested by {test.requestedBy} at {test.requestedAt}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                test.status
                              )}`}
                            >
                              {test.status.replace("-", " ").charAt(0).toUpperCase() +
                                test.status.replace("-", " ").slice(1)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(
                                test.priority
                              )}`}
                            >
                              {test.priority.charAt(0).toUpperCase() + test.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 text-sm font-medium rounded-lg transition-all duration-300">
                          Process
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-purple-500/20">
                <button
                  onClick={() => navigate("/laboratory")}
                  className="w-full text-center text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium"
                >
                  View all lab requests →
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20">
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
                        <p className="text-purple-300/70 text-xs mb-1">
                          {activity.detail}
                        </p>
                        <p className="text-purple-300/50 text-xs">
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

export default LabDashboard;
