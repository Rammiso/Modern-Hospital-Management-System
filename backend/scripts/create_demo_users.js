const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function createDemoUsers() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "hospital_management",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Connected to MySQL");

    // Hash the password (password123)
    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    // Demo users to create
    const demoUsers = [
      {
        username: "admin",
        full_name: "System Administrator",
        email: "admin@hospital.com",
        role: "admin",
        phone: "+251911234567",
      },
      {
        username: "doctor",
        full_name: "Dr. Sarah Johnson",
        email: "doctor@hospital.com",
        role: "doctor",
        phone: "+251911234568",
      },
      {
        username: "receptionist",
        full_name: "Front Desk Receptionist",
        email: "receptionist@hospital.com",
        role: "receptionist",
        phone: "+251911234569",
      },
      {
        username: "lab",
        full_name: "Lab Technician",
        email: "lab@hospital.com",
        role: "lab_technician",
        phone: "+251911234570",
      },
      {
        username: "pharmacist",
        full_name: "Hospital Pharmacist",
        email: "pharmacy@hospital.com",
        role: "pharmacist",
        phone: "+251911234571",
      },
      {
        username: "cashier",
        full_name: "Billing Cashier",
        email: "cashier@hospital.com",
        role: "cashier",
        phone: "+251911234572",
      },
    ];

    console.log("\n📝 Creating/Updating demo users...\n");

    for (const user of demoUsers) {
      try {
        // Check if user exists
        const [existing] = await connection.query(
          "SELECT id FROM users WHERE email = ?",
          [user.email]
        );

        if (existing.length > 0) {
          // Update existing user
          await connection.query(
            `UPDATE users 
             SET username = ?, password_hash = ?, full_name = ?, role = ?, phone = ?, is_active = TRUE
             WHERE email = ?`,
            [user.username, passwordHash, user.full_name, user.role, user.phone, user.email]
          );
          console.log(`✅ Updated: ${user.full_name} (${user.email}) - Role: ${user.role}`);
        } else {
          // Insert new user
          await connection.query(
            `INSERT INTO users (username, password_hash, full_name, email, role, phone, is_active)
             VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
            [user.username, passwordHash, user.full_name, user.email, user.role, user.phone]
          );
          console.log(`✅ Created: ${user.full_name} (${user.email}) - Role: ${user.role}`);
        }
      } catch (error) {
        console.error(`❌ Error with ${user.email}:`, error.message);
      }
    }

    // Display all users
    console.log("\n📋 All Users in Database:\n");
    const [users] = await connection.query(
      "SELECT id, username, full_name, email, role, is_active FROM users ORDER BY id"
    );
    
    console.table(users);

    console.log("\n✅ Demo users created/updated successfully!");
    console.log("\n🔑 Login Credentials:");
    console.log("   Email: [any of the emails above]");
    console.log("   Password: password123");
    console.log("\n📌 Available Roles:");
    console.log("   - admin@hospital.com (System Administrator)");
    console.log("   - doctor@hospital.com (Doctor)");
    console.log("   - receptionist@hospital.com (Receptionist)");
    console.log("   - lab@hospital.com (Lab Technician)");
    console.log("   - pharmacy@hospital.com (Pharmacist)");
    console.log("   - cashier@hospital.com (Cashier)");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n✅ Database connection closed");
    }
  }
}

createDemoUsers();
