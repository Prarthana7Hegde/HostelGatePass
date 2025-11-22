const pool = require("../db");
const jwt = require("jsonwebtoken");
const { signQR, verifyQR } = require("../utils/qr");
const { sendEmail } = require("../utils/notifications");


exports.wardenAction = async (req, res) => {
  const passId = req.params.id;
  const { action } = req.body;
  const wardenId = req.user.id;

  if (req.user.role !== "warden") {
    return res.status(403).json({ error: "Only wardens can approve or reject passes" });
  }

  try {
    // ✅ APPROVE FLOW
    if (action === "approve") {
      // 1) Check parent status first
      const [[currentPass]] = await pool.query(
        "SELECT parent_confirmed FROM gate_passes WHERE id = ?",
        [passId]
      );

      if (!currentPass) {
        return res.status(404).json({ error: "Pass not found" });
      }

      if (currentPass.parent_confirmed !== 1) {
        return res.status(400).json({ error: "Parent has not approved yet" });
      }

      // 2) Generate QR token
      const qr = signQR(passId);

      // 3) Save warden approval + QR to DB
      await pool.query(
        "UPDATE gate_passes SET warden_status='approved', warden_id=?, qr_token=? WHERE id=?",
        [wardenId, qr, passId]
      );

      return res.json({ message: "Pass approved", qr });
    }

    // ❌ REJECT FLOW
    if (action === "reject") {
      await pool.query(
        "UPDATE gate_passes SET warden_status='rejected', warden_id=? WHERE id=?",
        [wardenId, passId]
      );

      return res.json({ message: "Pass rejected" });
    }

    // If action is neither approve nor reject
    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    console.error("WARDEN ACTION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};







// --------------------------------------------------
// CREATE PASS (Student)
// --------------------------------------------------
exports.createPass = async (req, res) => {
  const { purpose, destination, startTime, endTime } = req.body;
  const studentId = req.user.id;

  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can create gate passes" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO gate_passes (student_id,purpose,destination,start_time,end_time,parent_confirmed,warden_status) VALUES (?,?,?,?,?,0,'pending')",
      [studentId, purpose, destination, startTime, endTime]
    );

    const passId = result.insertId;

    // ✅ Fetch parent email directly from students table
  const [studentRows] = await pool.query(
  "SELECT parent_email FROM students WHERE id = ?",
  [studentId]
);

const parentEmail = studentRows[0]?.parent_email;

if (parentEmail) {
  const token = jwt.sign({ passId }, process.env.PARENT_SECRET, { expiresIn: "24h" });

  const link = `${process.env.FRONTEND_URL}/parent-confirm?token=${token}`;

  console.log("Parent Approval Link:", link); // for testing

  await sendEmail(parentEmail, "Confirm Gate Pass", link);
}


    res.json({ message: "Pass created", passId });

  } catch (err) {
    console.error("CREATE PASS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// --------------------------------------------------
// GET STUDENT PASSES
// --------------------------------------------------
exports.getStudentPasses = async (req, res) => {
  const studentId = req.user.id;

  const [passes] = await pool.query(
  "SELECT id, purpose, destination, warden_status, parent_confirmed, qr_token, created_at FROM gate_passes WHERE student_id = ?",
  [studentId]
);


  res.json({ passes });
};


// --------------------------------------------------
// PARENT CONFIRM LINK
// --------------------------------------------------
// --------------------------------------------------
// PARENT CONFIRM LINK
// --------------------------------------------------
exports.parentConfirm = async (req, res) => {
  const { token, action } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.PARENT_SECRET);
    const passId = decoded.passId;

    if (action === "reject") {
      await pool.query(
        "UPDATE gate_passes SET parent_confirmed = -1 WHERE id = ?",
        [passId]
      );
      return res.send("❌ Pass rejected by parent");
    }

    await pool.query(
      "UPDATE gate_passes SET parent_confirmed = 1 WHERE id = ?",
      [passId]
    );

    res.send("✅ Pass approved by parent. Waiting for warden approval.");

  } catch (err) {
    res.status(400).send("Invalid or expired link");
  }
};





// --------------------------------------------------
// WARDEN APPROVE/REJECT



// --------------------------------------------------
// QR SCAN
// --------------------------------------------------
exports.scanQR = async (req, res) => {
  try {
    const { token, gateId } = req.body;

    if (!token) {
      return res.status(400).json({ allowed: false, reason: "QR token missing" });
    }

    // 1. Verify QR token
    let decoded;
    try {
      decoded = verifyQR(token);
    } catch (err) {
      return res.status(403).json({ allowed: false, reason: "Invalid or expired QR" });
    }

    const passId = decoded.passId;

    // 2. Get pass details
    const [passes] = await pool.query(
      "SELECT * FROM gate_passes WHERE id = ?",
      [passId]
    );

    if (passes.length === 0) {
      return res.status(404).json({ allowed: false, reason: "Pass not found" });
    }

    const pass = passes[0];

    // 3. Parent + Warden approval check
    if (pass.parent_confirmed !== 1 || pass.warden_status !== "approved") {
      return res.status(403).json({
        allowed: false,
        reason: "Pass not fully approved"
      });
    }

    // 4. Count previous scans
    const [logs] = await pool.query(
      "SELECT * FROM movement_logs WHERE pass_id = ? ORDER BY timestamp ASC",
      [passId]
    );

    // 5. Third scan → block
    if (logs.length >= 2) {
      return res.status(403).json({
        allowed: false,
        reason: "QR expired - already used twice"
      });
    }

    // 6. Decide event
    let event = logs.length === 0 ? "checkout" : "checkin";

    // 7. Insert log
    await pool.query(
      "INSERT INTO movement_logs (pass_id, event, gate_id) VALUES (?, ?, ?)",
      [passId, event, gateId || "main_gate"]
    );

    res.json({
      allowed: true,
      event,
      message: `${event.toUpperCase()} successful`
    });

  } catch (error) {
    console.error("QR Scan Error:", error);
    res.status(500).json({ allowed: false, reason: "Server error during scan" });
  }
};




exports.getPending = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM gate_passes WHERE warden_status='pending'"
    );
    res.json({ passes: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getQRImage = async (req, res) => {
  try {
    const passId = req.params.id;

    const [[pass]] = await pool.query(
      "SELECT qr_token FROM gate_passes WHERE id = ?",
      [passId]
    );

    if (!pass || !pass.qr_token) {
      return res.status(404).json({ error: "QR not found" });
    }

    res.json({ qr: pass.qr_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

