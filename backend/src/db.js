const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'hostel',
  waitForConnections: true,
  connectionLimit: 10
});

// ✅ TEST CONNECTION ON START
pool.getConnection()
  .then(connection => {
    console.log("✅ Connected to MySQL");
    connection.release();
  })
  .catch(err => {
    console.error("❌ MySQL Connection Failed:", err.message);
  });

module.exports = pool;
