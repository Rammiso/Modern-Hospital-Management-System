import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
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
      title: "Total Patients",
      value: "1,234",
      icon: "👥",
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Appointments Today",
      value: "56",
      icon: "📅",
      gradient: "from-green-500 to-teal-500",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Pending Consultations",
      value: "23",
      icon: "🩺",
      gradient: "from-orange-500 to-yellow-500",
      change: "-5%",
      changeType: "decrease",
    },
    {
      title: "Revenue This Month",
      value: "ETB 45,678",
      icon: "💰",
      gradient: "from-purple-500 to-pink-500",
      change: "+15%",
      changeType: "increase",
    },
  ];

  const activities = [
    {
      icon: "👤",
      iconBg: "from-blue-500 to-cyan-500",
      text: "New patient registered",
      detail: "John Doe",
      time: "5 minutes ago",
      type: "patient",
    },
    {
      icon: "📅",
      iconBg: "from-green-500 to-teal-500",
      text: "Appointment scheduled",
      detail: "Jane Smith",
      time: "15 minutes ago",
      type: "appointment",
    },
    {
      icon: "💊",
      iconBg: "from-purple-500 to-pink-500",
      text: "Prescription filled",
      detail: "Bob Johnson",
      time: "30 minutes ago",
      type: "prescription",
    },
    {
      icon: "🔬",
      iconBg: "from-indigo-500 to-purple-500",
      text: "Lab results ready",
      detail: "Sarah Williams",
      time: "1 hour ago",
      type: "lab",
    },
    {
      icon: "💰",
      iconBg: "from-cyan-500 to-blue-500",
      text: "Payment received",
      detail: "Invoice #9001",
      time: "2 hours ago",
      type: "billing",
    },
  ];

  const quickActions = [
    {
      title: "Register Patient",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      action: () => navigate("/patients"),
    },
    {
      title: "New Appointment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-green-500 to-teal-500",
      action: () => navigate("/appointments"),
    },
    {
      title: "Start Consultation",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      action: () => navigate("/consultation"),
    },
    {
      title: "View Billing",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-orange-500 to-yellow-500",
      action: () => navigate("/billing"),
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.full_name || "User"}! 👋
                </h1>
                <p className="text-indigo-300/70">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-semibold">
                    All Systems Operational
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
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      stat.changeType === "increase"
                        ? "bg-green-500/20 text-green-300 border border-green-500/50"
                        : "bg-red-500/20 text-red-300 border border-red-500/50"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-indigo-300/70 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white font-mono">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl p-6"
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

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-indigo-500/30 cursor-pointer group"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${activity.iconBg} rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1">
                        {activity.text}
                      </p>
                      <p className="text-indigo-300/70 text-sm">
                        {activity.detail}
                      </p>
                    </div>
                    <div className="text-indigo-300/50 text-sm whitespace-nowrap">
                      {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-white/5 border-t border-indigo-500/20">
              <button className="w-full text-center text-sm text-indigo-300 hover:text-indigo-200 transition-colors font-medium">
                View all activity →
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
