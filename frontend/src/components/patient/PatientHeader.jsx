import React from "react";
import { motion } from "framer-motion";

const PatientHeader = ({ patient }) => {
  const stats = [
    {
      label: "Total Visits",
      value: patient.stats.totalVisits,
      icon: "🏥",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Outstanding Balance",
      value: `ETB ${patient.stats.outstandingBalance.toLocaleString()}`,
      icon: "💰",
      color: "from-red-500 to-orange-500",
      highlight: patient.stats.outstandingBalance > 0,
    },
    {
      label: "Active Prescriptions",
      value: patient.stats.activePrescriptions,
      icon: "💊",
      color: "from-green-500 to-teal-500",
    },
    {
      label: "Pending Lab Results",
      value: patient.stats.pendingLabResults,
      icon: "🔬",
      color: "from-purple-500 to-pink-500",
      highlight: patient.stats.pendingLabResults > 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Patient Info */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/30">
              {patient.name.charAt(0)}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {patient.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-indigo-300/70">
                <span className="flex items-center gap-1">
                  <span className="font-mono text-indigo-400">
                    {patient.patientId}
                  </span>
                </span>
                <span>•</span>
                <span>{patient.age} years old</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  🩸 {patient.bloodType}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-right space-y-1">
            <p className="text-sm text-indigo-300/70">
              📞 {patient.phone}
            </p>
            <p className="text-sm text-indigo-300/70">
              ✉️ {patient.email}
            </p>
            <p className="text-sm text-indigo-300/70">
              📍 {patient.address}
            </p>
          </div>
        </div>

        {/* Allergies Warning */}
        {patient.allergies && patient.allergies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <p className="text-red-300 font-semibold text-sm">
                Allergies: {patient.allergies.join(", ")}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`backdrop-blur-sm bg-gradient-to-br ${stat.color} bg-opacity-10 
                     rounded-xl p-4 border ${
                       stat.highlight
                         ? "border-red-500/50 shadow-lg shadow-red-500/20"
                         : "border-white/10"
                     } 
                     hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              {stat.highlight && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-2xl font-bold text-white font-mono mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-indigo-300/70 uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Emergency Contact */}
      <div className="border-t border-indigo-500/20 p-4 bg-indigo-500/5">
        <div className="flex items-center gap-2 text-sm text-indigo-300/70">
          <span className="font-semibold text-indigo-400">
            Emergency Contact:
          </span>
          <span>
            {patient.emergencyContact.name} ({patient.emergencyContact.relation})
          </span>
          <span>•</span>
          <span>{patient.emergencyContact.phone}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientHeader;
