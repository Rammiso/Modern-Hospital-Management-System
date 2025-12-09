const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const DB_NAME = process.env.DB_NAME;

const initDatabase = async () => {
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST|| 'localhost',
    user: process.env.DB_USER|| 'root',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  try {
    // Create DB if not exists
    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME|| 'clinic_management_system'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`Database '${DB_NAME|| 'clinic_management_system'} ensured.`);

    // Load schema.sql
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    // Switch DB
    await tempConnection.query(`USE \`${DB_NAME}\`;`);

    // Run schema commands
    await tempConnection.query(schema);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    await tempConnection.end();
  }
};

// Initialize DB then create pool
(async () => {
  await initDatabase();

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const query = async (sql, params = []) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database Query Error:', error);
      throw error;
    }
  };

  const transaction = async (queries) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const results = [];
      for (const { sql, params } of queries) {
        const [result] = await connection.execute(sql, params);
        results.push(result);
      }

      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      console.error('Transaction Error:', error);
      throw error;
    } finally {
      connection.release();
    }
  };

  module.exports = {
    query,
    transaction,
    pool
  };
})();
