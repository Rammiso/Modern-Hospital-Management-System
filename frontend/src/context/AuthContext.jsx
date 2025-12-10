import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Fetch the full user profile including role
          const response = await getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setUser(response.user);
    localStorage.setItem("token", response.token);
    return response;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
