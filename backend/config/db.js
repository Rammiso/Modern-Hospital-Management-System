const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DB_NAME = process.env.DB_NAME || "clinic_management_system";

// Create the pool (we will use this for queries)
// Note: This assumes the DB exists. We ensure it exists with initDatabase()
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to initialize database if it doesn't exist
const initDatabase = async () => {
  let tempConnection;
  try {
    // Connect without database selected
    tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    // Create DB if not exists
    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`Database '${DB_NAME}' ensured.`);

    // Check if tables need to be created (simple check: try to switch DB)
    await tempConnection.query(`USE \`${DB_NAME}\`;`);

    // We can also check if tables exist, but for now we'll just run schema if needed
    // or we can rely on manual setup.
    // The previous code always ran schema.sql which might fail if tables exist (unless IF NOT EXISTS is used)
    // Let's check schema.sql content... it uses CREATE TABLE IF NOT EXISTS. So it's safe to run.

    const schemaPath = path.join(__dirname, "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      await tempConnection.query(schema);
      console.log("Tables initialized successfully.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
    // Don't throw here, let the app crash naturally if pool fails later,
    // or throw to stop server startup in server.js
    throw err;
  } finally {
    if (tempConnection) await tempConnection.end();
  }
};

const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
};

module.exports = {
  pool,
  initDatabase,
  query,
};


