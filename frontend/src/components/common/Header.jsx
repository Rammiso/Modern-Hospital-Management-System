import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mock notifications
  const notifications = [
    { id: 1, type: "appointment", message: "New appointment scheduled", time: "5 min ago" },
    { id: 2, type: "lab", message: "Lab results ready for review", time: "15 min ago" },
    { id: 3, type: "billing", message: "Payment received", time: "1 hour ago" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-indigo-500/20 shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Brand + Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-indigo-300 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                MHMS
              </h1>
              <span className="text-xs text-indigo-300/60 font-medium">
                Hospital Management System
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
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
              placeholder="Search patients, appointments, or records..."
              className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-indigo-500/30 
                       rounded-xl text-white placeholder-indigo-300/40
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                       transition-all duration-300 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-white/10 rounded-lg transition-all duration-300 text-indigo-300 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-slate-900/95 rounded-xl 
                           shadow-2xl border border-indigo-500/30 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <p className="text-xs text-indigo-300/60">
                      You have {notifications.length} new notifications
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 hover:bg-white/5 transition-all duration-300 border-b border-white/5 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">
                              {notification.type === "appointment"
                                ? "📅"
                                : notification.type === "lab"
                                ? "🔬"
                                : "💰"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              {notification.message}
                            </p>
                            <p className="text-xs text-indigo-300/60 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white/5 border-t border-indigo-500/20">
                    <button className="w-full text-center text-sm text-indigo-300 hover:text-indigo-200 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 border border-indigo-500/20 hover:border-indigo-500/40"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-semibold text-white">
                  {user?.full_name || "User"}
                </div>
                <div className="text-xs text-indigo-300/60 capitalize">
                  {user?.role || "Role"}
                </div>
              </div>
              <svg
                className="w-4 h-4 text-indigo-300"
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
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 backdrop-blur-xl bg-slate-900/95 rounded-xl 
                           shadow-2xl border border-indigo-500/30 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                        {user?.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {user?.full_name}
                        </div>
                        <div className="text-sm text-indigo-300/70">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-3 text-white transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-medium">Profile</span>
                    </button>
                    <button className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-3 text-white transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </button>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left hover:bg-red-500/10 flex items-center gap-3 text-red-400 hover:text-red-300 transition-all duration-300 font-medium"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
