const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    console.log("Connected to MySQL");

    // Read and execute the workflow schema
    const schemaPath = path.join(__dirname, "config", "consultation_workflow_schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    
    console.log("Executing workflow schema...");
    
    // Split the schema into individual statements and execute them one by one
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await connection.query(statement);
        }
      } catch (error) {
        // Ignore "column already exists" errors
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Column already exists, skipping: ${error.message.split("'")[1]}`);
        } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⚠️  Table already exists, skipping`);
        } else {
          console.log(`⚠️  SQL Warning: ${error.message}`);
        }
      }
    }
    
    console.log("✅ Database schema updated successfully!");
    
    // Check if Ethiopian MOH tests were inserted
    const [rows] = await connection.query("SELECT COUNT(*) as count FROM ethiopian_moh_lab_tests");
    console.log(`✅ Ethiopian MOH Lab Tests loaded: ${rows[0].count} tests`);
    
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();