import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { login } = useAuth();
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load saved credentials if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setCredentials({ ...credentials, email: savedEmail });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(credentials);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", credentials.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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

  // Quick login demo accounts
  const demoAccounts = [
    { role: "Admin", email: "admin@hospital.com", icon: "👨‍💼", color: "from-blue-500 to-cyan-500" },
    { role: "Doctor", email: "doctor@hospital.com", icon: "👨‍⚕️", color: "from-green-500 to-teal-500" },
    { role: "Receptionist", email: "receptionist@hospital.com", icon: "👩‍💼", color: "from-purple-500 to-pink-500" },
    { role: "Lab Tech", email: "lab@hospital.com", icon: "🔬", color: "from-purple-500 to-pink-500" },
    { role: "Pharmacist", email: "pharmacy@hospital.com", icon: "💊", color: "from-cyan-500 to-teal-500" },
    { role: "Cashier", email: "cashier@hospital.com", icon: "💰", color: "from-cyan-500 to-blue-500" },
  ];

  const fillDemoAccount = (email) => {
    setCredentials({ email, password: "password123" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-8 hidden lg:block"
          >
            {/* Logo & Title */}
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/50"
              >
                🏥
              </motion.div>
              <h1 className="text-5xl font-bold">
                Hospital Management
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  System
                </span>
              </h1>
              <p className="text-indigo-300/70 text-lg">
                Modern, secure, and efficient healthcare management platform
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: "🔒", text: "Secure JWT Authentication" },
                { icon: "⚡", text: "Real-time Updates" },
                { icon: "📊", text: "Advanced Analytics" },
                { icon: "🌐", text: "Multi-role Access Control" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 text-indigo-200/80"
                >
                  <div className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-indigo-500/20">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Time Display */}
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-indigo-500/20 p-4">
              <div className="text-sm text-indigo-300/60 mb-1">Current Time</div>
              <div className="text-2xl font-mono font-bold">{formatTime(currentTime)}</div>
              <div className="text-sm text-indigo-300/60 mt-1">{formatDate(currentTime)}</div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border-2 border-indigo-500/20 shadow-2xl shadow-indigo-500/20 p-8 md:p-10">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-block w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/50 mb-4">
                  🏥
                </div>
                <h2 className="text-2xl font-bold text-white">Hospital Management System</h2>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-indigo-300/70">Sign in to access your dashboard</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-indigo-500/30 bg-white/5 text-indigo-500 focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    />
                    <span className="text-sm text-indigo-300/70 group-hover:text-indigo-300 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-red-300 text-sm font-medium flex-1">{error}</p>
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-red-300 hover:text-red-200 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-indigo-500/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-indigo-300/60">Quick Demo Access</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {demoAccounts.map((account, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      onClick={() => fillDemoAccount(account.email)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg transition-all duration-300 group"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${account.color} rounded-lg flex items-center justify-center text-xl mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        {account.icon}
                      </div>
                      <div className="text-xs text-indigo-300/70 group-hover:text-indigo-300 transition-colors">
                        {account.role}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-indigo-300/50">
                  Secure login powered by JWT authentication
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
