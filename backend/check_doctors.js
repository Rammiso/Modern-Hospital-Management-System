const db = require("./config/db");

async function checkDoctors() {
  try {
    console.log("🔍 Checking doctors in database...\n");

    // Check roles table
    console.log("1. Checking roles:");
    const roles = await db.query("SELECT * FROM roles");
    console.log(roles);

    // Check users table
    console.log("\n2. Checking users:");
    const users = await db.query("SELECT id, full_name, role_id, is_active FROM users LIMIT 10");
    console.log(users);

    // Check doctors specifically
    console.log("\n3. Checking doctors query:");
    const doctors = await db.query(`
      SELECT u.id as doctor_id, u.full_name as name, u.specialization, u.phone, u.email, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE LOWER(r.role_name) = 'doctor'
      AND u.is_active = 1
      ORDER BY u.full_name
    `);
    console.log(`Found ${doctors.length} doctors:`);
    console.log(doctors);

    // If no doctors, let's create one for testing
    if (doctors.length === 0) {
      console.log("\n4. No doctors found. Creating a test doctor...");
      
      // Get doctor role ID
      const [doctorRole] = await db.query("SELECT role_id FROM roles WHERE LOWER(role_name) = 'doctor'");
      
      if (doctorRole) {
        await db.query(`
          INSERT INTO users (id, email, phone, password_hash, role_id, full_name, specialization, is_active)
          VALUES (UUID(), 'doctor@test.com', '+251911111111', '$2b$10$dummy.hash.for.testing', ?, 'Dr. Test Doctor', 'General Medicine', 1)
        `, [doctorRole.role_id]);
        
        console.log("✅ Test doctor created successfully!");
        
        // Check again
        const newDoctors = await db.query(`
          SELECT u.id as doctor_id, u.full_name as name, u.specialization, u.phone, u.email
          FROM users u
          JOIN roles r ON u.role_id = r.role_id
          WHERE LOWER(r.role_name) = 'doctor'
          AND u.is_active = 1
          ORDER BY u.full_name
        `);
        console.log(`Now found ${newDoctors.length} doctors:`);
        console.log(newDoctors);
      } else {
        console.log("❌ Doctor role not found in roles table");
      }
    }

  } catch (error) {
    console.error("❌ Error checking doctors:", error);
  } finally {
    process.exit(0);
  }
}

checkDoctors();