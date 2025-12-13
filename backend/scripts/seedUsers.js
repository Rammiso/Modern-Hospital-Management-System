const { query, pool } = require("../config/db");
const bcrypt = require("bcryptjs");

const seedUsers = async () => {
  try {
    console.log("🌱 Seeding users...");

    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Admin
    await query(
      `
      INSERT IGNORE INTO users (id, email, password_hash, role_id, full_name, phone, is_active)
      VALUES (UUID(), 'admin@hospital.com', ?, 1, 'System Admin', '1112223333', true)
    `,
      [passwordHash]
    );

    // 2. Doctor
    await query(
      `
      INSERT IGNORE INTO users (id, email, password_hash, role_id, full_name, phone, specialization, is_active)
      VALUES (UUID(), 'doctor@hospital.com', ?, 2, 'Dr. Sarah Smith', '4445556666', 'Cardiology', true)
    `,
      [passwordHash]
    );

    // 3. Receptionist
    await query(
      `
      INSERT IGNORE INTO users (id, email, password_hash, role_id, full_name, phone, is_active)
      VALUES (UUID(), 'receptionist@hospital.com', ?, 4, 'Front Desk Jane', '7778889999', true)
    `,
      [passwordHash]
    );

    console.log("✅ Staff users seeded successfully!");

    // 4. Patient (Need to be created in users table via register usually, but patients table is separate for clinical data)
    // Looking at schema.sql, patients table has patient_id, full_name etc.
    // The Receptionist UI searches the 'patients' table.

    await query(`
      INSERT IGNORE INTO patients (id, patient_id, full_name, phone, email, date_of_birth, gender, created_at)
      VALUES (UUID(), 'P-1001', 'John Doe', '1234567890', 'john@example.com', '1985-05-15', 'male', NOW())
    `);

    await query(`
      INSERT IGNORE INTO patients (id, patient_id, full_name, phone, email, date_of_birth, gender, created_at)
      VALUES (UUID(), 'P-1002', 'Jane Doe', '0987654321', 'jane@example.com', '1990-08-20', 'female', NOW())
    `);

    console.log("✅ Patients seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit();
  }
};

seedUsers();
