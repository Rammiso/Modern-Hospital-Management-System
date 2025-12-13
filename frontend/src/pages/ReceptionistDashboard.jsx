import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";

const ReceptionistDashboard = () => {
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
      title: "Today's Appointments",
      value: "24",
      icon: "📅",
      gradient: "from-blue-500 to-cyan-500",
      change: "+6 from yesterday",
      changeType: "info",
    },
    {
      title: "Patients Registered",
      value: "8",
      icon: "👥",
      gradient: "from-green-500 to-teal-500",
      change: "Today",
      changeType: "info",
    },
    {
      title: "Pending Check-ins",
      value: "5",
      icon: "⏰",
      gradient: "from-orange-500 to-yellow-500",
      change: "Waiting",
      changeType: "warning",
    },
    {
      title: "Completed Today",
      value: "19",
      icon: "✅",
      gradient: "from-purple-500 to-pink-500",
      change: "Checked out",
      changeType: "success",
    },
  ];

  const upcomingAppointments = [
    {
      time: "09:30 AM",
      patientName: "Ahmed Hassan",
      patientId: "P-1234",
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      status: "waiting",
    },
    {
      time: "10:00 AM",
      patientName: "Fatima Ali",
      patientId: "P-1235",
      doctor: "Dr. Michael Chen",
      department: "Cardiology",
      status: "scheduled",
    },
    {
      time: "10:30 AM",
      patientName: "Mohammed Ibrahim",
      patientId: "P-1236",
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      status: "scheduled",
    },
    {
      time: "11:00 AM",
      patientName: "Aisha Mohamed",
      patientId: "P-1237",
      doctor: "Dr. Emily Rodriguez",
      department: "Pediatrics",
      status: "scheduled",
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
      title: "Book Appointment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-green-500 to-teal-500",
      action: () => navigate("/appointments"),
    },
    {
      title: "Patient Records",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      action: () => navigate("/patients"),
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

  const getStatusBadge = (status) => {
    const badges = {
      waiting: "bg-orange-500/20 border-orange-500/50 text-orange-300",
      scheduled: "bg-blue-500/20 border-blue-500/50 text-blue-300",
      completed: "bg-green-500/20 border-green-500/50 text-green-300",
    };
    return badges[status] || badges.scheduled;
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
                  Welcome back, {user?.full_name || "Receptionist"}! 👋
                </h1>
                <p className="text-indigo-300/70">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm font-semibold">
                    Front Desk Active
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
                </div>
                <h3 className="text-indigo-300/70 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white font-mono mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-indigo-300/50">{stat.change}</p>
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

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Today's Appointments
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-indigo-500/30 cursor-pointer group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-semibold">
                          {appointment.time.split(" ")[0]}
                        </span>
                        <span className="text-white/70 text-xs">
                          {appointment.time.split(" ")[1]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold">
                          {appointment.patientName}
                        </p>
                        <span className="text-indigo-300/50 text-sm">
                          ({appointment.patientId})
                        </span>
                      </div>
                      <p className="text-indigo-300/70 text-sm mb-1">
                        {appointment.doctor} • {appointment.department}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 hover:border-indigo-400/50 text-indigo-300 hover:text-indigo-200 text-sm font-medium rounded-lg transition-all duration-300">
                      Check In
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-white/5 border-t border-indigo-500/20">
              <button
                onClick={() => navigate("/appointments")}
                className="w-full text-center text-sm text-indigo-300 hover:text-indigo-200 transition-colors font-medium"
              >
                View all appointments →
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ReceptionistDashboard;
