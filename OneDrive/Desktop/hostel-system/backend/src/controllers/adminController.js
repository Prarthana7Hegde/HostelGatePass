const pool = require("../db");

exports.getStats = async (req, res) => {
  try {
    // check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const [[students]] = await pool.query(
      "SELECT COUNT(*) AS total FROM users WHERE role='student'"
    );

    const [[passes]] = await pool.query(
      "SELECT COUNT(*) AS total FROM gate_passes"
    );

    const [[pending]] = await pool.query(
      "SELECT COUNT(*) AS total FROM gate_passes WHERE warden_status='pending'"
    );

    // behavior flags — simple version (students with > 3 passes)
  const [flags] = await pool.query(`
  SELECT users.name AS student, COUNT(gate_passes.id) AS count
  FROM gate_passes
  JOIN users ON gate_passes.student_id = users.id
  GROUP BY gate_passes.student_id
  HAVING COUNT(gate_passes.id) > 3;
`);




    res.json({
      totalStudents: students.total,
      totalPasses: passes.total,
      pendingPasses: pending.total,
      flags
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
