const bcrypt = require('bcrypt');
const pool = require('../db');
const { signToken } = require('../utils/jwt');

// ✅ REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role, rollNo, room, parentName, parentEmail, parentPhone } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashed, role]
    );

    const userId = result.insertId;

    // ONLY student gets parent details
    if (role === "student") {

      if (!rollNo || !room || !parentEmail) {
        return res.status(400).json({ error: "Student details missing" });
      }

      await pool.query(
        `INSERT INTO students 
        (id, roll_no, room, parent_name, parent_email, parent_phone)
        VALUES (?,?,?,?,?,?)`,
        [userId, rollNo, room, parentName, parentEmail, parentPhone]
      );
    }

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === 'ER_DUP_ENTRY') {
      if (err.sqlMessage.includes('users.email')) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (err.sqlMessage.includes('students.roll_no')) {
        return res.status(400).json({ error: "Roll number already exists" });
      }
    }

    res.status(500).json({ error: "Registration failed" });
  }
};


// ✅ LOGIN

const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    // ✅ compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ ROLE CHECK
    const dbRole = String(user.role || '').trim().toLowerCase();
    const requestedRole = String(role || '').trim().toLowerCase();

    if (dbRole !== requestedRole) {
      return res.status(401).json({
        error: `Invalid ${requestedRole || 'user'} credentials`
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
