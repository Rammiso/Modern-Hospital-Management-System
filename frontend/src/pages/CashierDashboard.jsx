import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context/AuthContext";

const CashierDashboard = () => {
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
      title: "Pending Payments",
      value: "12",
      icon: "⏳",
      gradient: "from-cyan-500 to-blue-500",
      change: "Awaiting payment",
      changeType: "warning",
    },
    {
      title: "Collected Today",
      value: "ETB 28,450",
      icon: "💰",
      gradient: "from-green-500 to-teal-500",
      change: "+22% from yesterday",
      changeType: "success",
    },
    {
      title: "Transactions",
      value: "45",
      icon: "📊",
      gradient: "from-blue-500 to-cyan-500",
      change: "Today",
      changeType: "info",
    },
    {
      title: "Outstanding",
      value: "ETB 15,200",
      icon: "⚠️",
      gradient: "from-orange-500 to-yellow-500",
      change: "Unpaid invoices",
      changeType: "warning",
    },
  ];

  const pendingPayments = [
    {
      invoiceId: "INV-2024-001",
      patientName: "Ahmed Hassan",
      patientId: "P-1234",
      services: ["Consultation", "Lab Tests"],
      totalAmount: 850,
      paidAmount: 0,
      balance: 850,
      status: "unpaid",
      priority: "normal",
      issuedAt: "09:30 AM",
    },
    {
      invoiceId: "INV-2024-002",
      patientName: "Fatima Ali",
      patientId: "P-1235",
      services: ["Consultation", "Medications"],
      totalAmount: 1200,
      paidAmount: 500,
      balance: 700,
      status: "partial",
      priority: "normal",
      issuedAt: "10:00 AM",
    },
    {
      invoiceId: "INV-2024-003",
      patientName: "Mohammed Ibrahim",
      patientId: "P-1236",
      services: ["Emergency Care", "X-Ray"],
      totalAmount: 2500,
      paidAmount: 0,
      balance: 2500,
      status: "unpaid",
      priority: "high",
      issuedAt: "10:15 AM",
    },
    {
      invoiceId: "INV-2024-004",
      patientName: "Aisha Mohamed",
      patientId: "P-1237",
      services: ["Consultation", "Prescription"],
      totalAmount: 450,
      paidAmount: 0,
      balance: 450,
      status: "unpaid",
      priority: "normal",
      issuedAt: "10:30 AM",
    },
  ];

  const recentTransactions = [
    {
      icon: "✅",
      iconBg: "from-green-500 to-teal-500",
      text: "Payment received",
      detail: "INV-2024-001 - ETB 850 (Cash)",
      time: "5 minutes ago",
    },
    {
      icon: "💳",
      iconBg: "from-blue-500 to-cyan-500",
      text: "Card payment",
      detail: "INV-2024-002 - ETB 500 (POS)",
      time: "15 minutes ago",
    },
    {
      icon: "📱",
      iconBg: "from-purple-500 to-pink-500",
      text: "Mobile money",
      detail: "INV-2024-003 - ETB 1200 (M-Pesa)",
      time: "30 minutes ago",
    },
    {
      icon: "🧾",
      iconBg: "from-cyan-500 to-teal-500",
      text: "Invoice generated",
      detail: "INV-2024-004 - ETB 450",
      time: "1 hour ago",
    },
  ];

  const quickActions = [
    {
      title: "Process Payment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-cyan-500 to-blue-500",
      action: () => navigate("/billing"),
    },
    {
      title: "View Invoices",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      action: () => navigate("/billing"),
    },
    {
      title: "Payment Report",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-green-500 to-teal-500",
      action: () => navigate("/billing"),
    },
    {
      title: "Patient Search",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      gradient: "from-orange-500 to-yellow-500",
      action: () => navigate("/patients"),
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
      unpaid: "bg-red-500/20 border-red-500/50 text-red-300",
      partial: "bg-orange-500/20 border-orange-500/50 text-orange-300",
      paid: "bg-green-500/20 border-green-500/50 text-green-300",
    };
    return badges[status] || badges.unpaid;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: "bg-red-500/20 border-red-500/50 text-red-300",
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
                  Welcome back, {user?.full_name || "Cashier"}! 💰
                </h1>
                <p className="text-cyan-300/70">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-cyan-300 text-sm font-semibold">
                    Billing Active
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
            {/* Pending Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">💳</span>
                  Pending Payments
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pendingPayments.map((payment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cyan-500/30 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white text-2xl">💰</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-semibold">
                              {payment.invoiceId}
                            </p>
                          </div>
                          <p className="text-cyan-300/70 text-sm mb-1">
                            Patient: {payment.patientName} ({payment.patientId})
                          </p>
                          <p className="text-cyan-300/60 text-xs mb-2">
                            Services: {payment.services.join(", ")}
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                            <div>
                              <span className="text-cyan-300/50">Total:</span>
                              <span className="text-white font-mono ml-1">ETB {payment.totalAmount}</span>
                            </div>
                            <div>
                              <span className="text-cyan-300/50">Paid:</span>
                              <span className="text-green-300 font-mono ml-1">ETB {payment.paidAmount}</span>
                            </div>
                            <div>
                              <span className="text-cyan-300/50">Balance:</span>
                              <span className="text-orange-300 font-mono ml-1">ETB {payment.balance}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                payment.status
                              )}`}
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                            {payment.priority === "high" && (
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(
                                  payment.priority
                                )}`}
                              >
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/billing?invoice=${payment.invoiceId}`)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 text-sm font-medium rounded-lg transition-all duration-300"
                        >
                          Collect
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-cyan-500/20">
                <button
                  onClick={() => navigate("/billing")}
                  className="w-full text-center text-sm text-cyan-300 hover:text-cyan-200 transition-colors font-medium"
                >
                  View all invoices →
                </button>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Recent Transactions
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${transaction.iconBg} rounded-lg flex items-center justify-center text-lg flex-shrink-0 shadow-lg`}
                      >
                        {transaction.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-1">
                          {transaction.text}
                        </p>
                        <p className="text-cyan-300/70 text-xs mb-1">
                          {transaction.detail}
                        </p>
                        <p className="text-cyan-300/50 text-xs">
                          {transaction.time}
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

export default CashierDashboard;
