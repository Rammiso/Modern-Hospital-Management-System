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
      database: process.env.DB_NAME || "clinic_management_system",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Connected to MySQL");

    // First, let's add missing roles if they don't exist
    console.log("\n📝 Ensuring all roles exist...\n");
    
    const rolesToAdd = [
      { role_id: 1, role_name: 'Admin', description: 'Administrator with full access' },
      { role_id: 2, role_name: 'Doctor', description: 'Medical Doctor' },
      { role_id: 3, role_name: 'Nurse', description: 'Medical Nurse' },
      { role_id: 4, role_name: 'Receptionist', description: 'Front Desk Receptionist' },
      { role_id: 5, role_name: 'Pharmacist', description: 'Pharmacy Staff' },
      { role_id: 6, role_name: 'Laboratorist', description: 'Lab Technician' },
      { role_id: 7, role_name: 'Cashier', description: 'Billing and Cashier Staff' },
    ];

    for (const role of rolesToAdd) {
      try {
        await connection.query(
          `INSERT IGNORE INTO roles (role_id, role_name, description) VALUES (?, ?, ?)`,
          [role.role_id, role.role_name, role.description]
        );
      } catch (error) {
        console.log(`⚠️  Role ${role.role_name} might already exist`);
      }
    }

    // Hash the password (password123)
    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    // Demo users to create (using role_id instead of role name)
    const demoUsers = [
      {
        full_name: "System Administrator",
        email: "admin@hospital.com",
        role_id: 1, // Admin
        phone: "+251911234567",
      },
      {
        full_name: "Dr. Sarah Johnson",
        email: "doctor@hospital.com",
        role_id: 2, // Doctor
        phone: "+251911234568",
        specialization: "General Medicine",
      },
      {
        full_name: "Front Desk Receptionist",
        email: "receptionist@hospital.com",
        role_id: 4, // Receptionist
        phone: "+251911234569",
      },
      {
        full_name: "Lab Technician",
        email: "lab@hospital.com",
        role_id: 6, // Laboratorist
        phone: "+251911234570",
      },
      {
        full_name: "Hospital Pharmacist",
        email: "pharmacy@hospital.com",
        role_id: 5, // Pharmacist
        phone: "+251911234571",
      },
      {
        full_name: "Billing Cashier",
        email: "cashier@hospital.com",
        role_id: 7, // Cashier
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
             SET password_hash = ?, full_name = ?, role_id = ?, phone = ?, specialization = ?, is_active = TRUE
             WHERE email = ?`,
            [passwordHash, user.full_name, user.role_id, user.phone, user.specialization || null, user.email]
          );
          console.log(`✅ Updated: ${user.full_name} (${user.email}) - Role ID: ${user.role_id}`);
        } else {
          // Insert new user
          await connection.query(
            `INSERT INTO users (email, password_hash, full_name, role_id, phone, specialization, is_active)
             VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
            [user.email, passwordHash, user.full_name, user.role_id, user.phone, user.specialization || null]
          );
          console.log(`✅ Created: ${user.full_name} (${user.email}) - Role ID: ${user.role_id}`);
        }
      } catch (error) {
        console.error(`❌ Error with ${user.email}:`, error.message);
      }
    }

    // Display all users with their roles
    console.log("\n📋 All Users in Database:\n");
    const [users] = await connection.query(
      `SELECT u.id, u.email, u.full_name, r.role_name, u.phone, u.is_active 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       ORDER BY u.id`
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
