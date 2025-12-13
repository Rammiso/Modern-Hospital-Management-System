// const express = require("express");
// const app = express();
// const cors = require("cors");
// const dotenv = require("dotenv");

// // Load environment variables
// dotenv.config();

// // Middleware
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const patientRoutes = require("./routes/patientRoutes");
// const doctorRoutes = require("./routes/doctorRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/patients", patientRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", require("./routes/appointment"));

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", message: "Server is running" });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     error: "Something went wrong!",
//     message: process.env.NODE_ENV === "development" ? err.message : undefined,
//   });
// });

// // Start server
// const { initDatabase } = require("./config/db");

// const startServer = async () => {
//   try {
//     await initDatabase();

//     const PORT = process.env.PORT || 4000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
//       console.log(`📡 API available at: http://localhost:${PORT}/api`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();


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
console.log("Loading routes...");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const prescriptionRoutes = require("./routes/prescription.routes");
const labRequestRoutes = require("./routes/labRequestRoutes");
const labTestRoutes = require("./routes/labTestRoutes");
const billingRoutes = require("./routes/billingRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const integrationRoutes = require("./routes/integrationRoutes");

console.log("Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/consultations", consultationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/lab-requests", labRequestRoutes);
app.use("/api/lab", labTestRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/integration", integrationRoutes);

// Temporary test endpoint for doctors (no auth required)
app.get("/api/doctors-test", async (req, res) => {
  try {
    const { query } = require("./config/db");
    const doctors = await query(`
      SELECT u.id as doctor_id, u.full_name as name, u.specialization, u.phone, u.email
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE LOWER(r.role_name) = 'doctor'
      AND u.is_active = 1
      ORDER BY u.full_name
    `);

    res.status(200).json({
      status: "success",
      results: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Test Error:", error);
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
});

console.log("Routes registered successfully!");

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const { query } = require("./config/db");
    
    // Test database connection
    const result = await query("SELECT 1 as test");
    
    res.json({ 
      status: "ok", 
      message: "Server is running",
      database: "connected",
      test_query: result[0]?.test
    });
  } catch (error) {
    res.json({ 
      status: "ok", 
      message: "Server is running",
      database: "error",
      error: error.message
    });
  }
});

// Database check endpoint
app.get("/api/db-check", async (req, res) => {
  res.json({
    status: "ok",
    message: "Database check endpoint working"
  });
});

// Test lab request endpoint (for testing without foreign key constraints)
app.post("/api/test-lab-request", async (req, res) => {
  try {
    const { lab_requests } = req.body;
    
    res.json({
      status: "success",
      message: "Lab request data received successfully",
      received_data: {
        lab_requests: lab_requests,
        count: lab_requests?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// Test database data endpoint
app.get("/api/test-data", async (req, res) => {
  try {
    const { query } = require("./config/db");
    
    // Check appointments
    const appointments = await query("SELECT * FROM appointments LIMIT 5");
    
    // Check patients
    const patients = await query("SELECT * FROM patients LIMIT 5");
    
    // Check users (doctors)
    const users = await query("SELECT * FROM users LIMIT 5");
    
    res.json({
      status: "success",
      data: {
        appointments: appointments,
        patients: patients,
        users: users
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// Schema setup endpoint
app.get("/api/setup-schema", async (req, res) => {
  try {
    const { query } = require("./config/db");
    
    // First, let's check if the table exists
    const tables = await query("SHOW TABLES LIKE 'ethiopian_moh_lab_tests'");
    
    if (tables.length === 0) {
      // Create the table
      await query(`
        CREATE TABLE IF NOT EXISTS ethiopian_moh_lab_tests (
          id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          test_name VARCHAR(200) NOT NULL UNIQUE,
          test_code VARCHAR(50) UNIQUE,
          test_type ENUM('blood', 'urine', 'imaging', 'microbiology', 'serology', 'other') NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          normal_range VARCHAR(200),
          unit VARCHAR(50),
          price DECIMAL(10,2) DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_test_type (test_type),
          INDEX idx_category (category),
          INDEX idx_active (is_active)
        )
      `);
      
      // Insert some sample data
      await query(`
        INSERT IGNORE INTO ethiopian_moh_lab_tests (test_name, test_code, test_type, category, description, normal_range, unit, price) VALUES
        ('Complete Blood Count (CBC)', 'CBC', 'blood', 'Hematology', 'Full blood count including RBC, WBC, platelets, hemoglobin', 'Varies by component', 'cells/μL', 150.00),
        ('Hemoglobin', 'HGB', 'blood', 'Hematology', 'Hemoglobin level measurement', 'M: 13.5-17.5, F: 12.0-15.5', 'g/dL', 50.00),
        ('Fasting Blood Sugar (FBS)', 'FBS', 'blood', 'Clinical Chemistry', 'Glucose level after fasting', '70-100', 'mg/dL', 80.00),
        ('Random Blood Sugar (RBS)', 'RBS', 'blood', 'Clinical Chemistry', 'Glucose level without fasting', '<140', 'mg/dL', 70.00),
        ('Urinalysis Complete', 'URINE', 'urine', 'Clinical Chemistry', 'Complete urine examination', 'Normal', '', 100.00)
      `);
    }
    
    // Check the count
    const countResult = await query("SELECT COUNT(*) as count FROM ethiopian_moh_lab_tests");
    
    res.json({
      status: "success",
      message: "Schema setup completed",
      lab_tests_count: countResult[0]?.count || 0
    });
  } catch (error) {
    console.error("Schema setup error:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
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
