const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const consulationRoutes = require("./routes/consultationRoutes");
const prescriptionRoutes = require("./routes/prescription.routes");
const labRequestRoutes = require("./routes/labRequestRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/consultations", consulationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/lab-requests", labRequestRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const { initDatabase } = require("./config/db");

const startServer = async () => {
  try {
    await initDatabase();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API available at: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
