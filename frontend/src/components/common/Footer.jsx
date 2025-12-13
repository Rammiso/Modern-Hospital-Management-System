import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="backdrop-blur-xl bg-slate-900/80 border-t border-indigo-500/20 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-indigo-300/70"
          >
            <span className="text-lg">🏥</span>
            <span>
              &copy; {currentYear} Hospital Management System. All rights reserved.
            </span>
          </motion.div>

          {/* Center: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-6 text-sm"
          >
            <a
              href="#"
              className="text-indigo-300/70 hover:text-indigo-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-indigo-300/70 hover:text-indigo-300 transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-indigo-300/70 hover:text-indigo-300 transition-colors duration-300"
            >
              Support
            </a>
          </motion.div>

          {/* Right: Version & Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-indigo-300/70">Online</span>
            </div>
            <div className="px-3 py-1 bg-white/5 border border-indigo-500/20 rounded-lg">
              <span className="text-indigo-300/70 font-mono text-xs">v1.0.0</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
