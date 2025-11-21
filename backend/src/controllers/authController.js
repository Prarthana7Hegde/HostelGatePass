const bcrypt = require('bcrypt');
const pool = require('../db');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
  "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
  [name, email, hashed, role]
);

const userId = result.insertId;

// ✅ AUTO CREATE STUDENT PROFILE
if (role === "student") {
  await pool.query(
    "INSERT INTO students (id, roll_no, room, parent_user_id) VALUES (?, NULL, NULL, NULL)",
    [userId]
  );
}

res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);

    if (!rows.length) return res.status(401).json({ error: "Invalid email" });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = signToken({ id: user.id, role: user.role });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
