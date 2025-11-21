
const pool = require('../db');
const jwt = require('jsonwebtoken');
const { signQR, verifyQR } = require('../utils/qr');
const { sendEmail } = require('../utils/notifications');

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

    // ✅ Send link to REAL parent email
    const [studentRows] = await pool.query(
      "SELECT parent_user_id FROM students WHERE id = ?",
      [studentId]
    );

    const realParentId = studentRows[0]?.parent_user_id;

    if (realParentId) {
      const [parentRows] = await pool.query(
        "SELECT email FROM users WHERE id = ?",
        [realParentId]
      );

      const parentEmail = parentRows[0]?.email;

      if (parentEmail) {
        const token = jwt.sign(
          { passId, parentUserId: realParentId },
          process.env.PARENT_SECRET,
          { expiresIn: "24h" }
        );
const link = `${process.env.FRONTEND_URL}/parent-confirm?token=${token}`;

// FORCE PRINT FOR TESTING
console.log("\n==============================");
console.log("PARENT CONFIRM LINK:");
console.log(link);
console.log("==============================\n");

// still try sending email
await sendEmail(parentEmail, "Confirm Pass", link);

      }
    }

    res.json({ message: "Pass created", passId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------------------
// GET STUDENT PASSES
// --------------------------------------------------
exports.getStudentPasses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM gate_passes WHERE student_id=?",
      [studentId]
    );

    res.json({ passes: rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      return res.send("❌ Parent rejected the pass");
    }

    await pool.query(
      "UPDATE gate_passes SET parent_confirmed = 1 WHERE id = ?",
      [passId]
    );

    res.send("✔ Parent confirmed the pass. Waiting for warden approval.");
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(400).send("Invalid or expired parent confirmation link");
  }
};




// --------------------------------------------------
// WARDEN APPROVE/REJECT
// --------------------------------------------------
exports.wardenAction = async (req, res) => {
  const passId = req.params.id;
  const { action } = req.body;
  const wardenId = req.user.id;

  if (req.user.role !== "warden") {
    return res.status(403).json({ error: "Only wardens can approve or reject passes" });
  }

  try {

    if (action === "approve") {

      const [[currentPass]] = await pool.query(
        "SELECT parent_confirmed FROM gate_passes WHERE id = ?",
        [passId]
      );

      if (currentPass.parent_confirmed !== 1) {
        return res.status(400).json({ error: "Parent has not approved yet" });
      }

      const expiry = Math.floor(Date.now() / 1000) + (24 * 3600);

      const qr = signQR(passId, expiry);

      await pool.query(
        "UPDATE gate_passes SET warden_status='approved', warden_id=?, qr_token=? WHERE id=?",
        [wardenId, qr, passId]
      );

      return res.json({ message: "Pass approved", qr });
    }

    // REJECT FLOW
    await pool.query(
      "UPDATE gate_passes SET warden_status='rejected', warden_id=? WHERE id=?",
      [wardenId, passId]
    );

    res.json({ message: "Pass rejected" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// --------------------------------------------------
// QR SCAN
// --------------------------------------------------
exports.scanQR = async (req, res) => {
  const { token, gateId } = req.body;

  try {
    const payload = verifyQR(token);

    const [rows] = await pool.query(
      "SELECT * FROM gate_passes WHERE id=?",
      [payload.passId]
    );

    if (!rows.length)
      return res.json({ allowed: false, reason: "Pass not found" });

    const pass = rows[0];

    if (pass.warden_status !== "approved")
      return res.json({ allowed: false, reason: "Not approved" });

    // ✅ COUNT SCANS FOR THIS PASS
    const [scanCountRows] = await pool.query(
      "SELECT COUNT(*) AS total FROM movement_logs WHERE pass_id = ?",
      [pass.id]
    );

    const scanCount = scanCountRows[0].total;

    // ❌ If already used twice → EXPIRE QR
    if (scanCount >= 2) {
      return res.json({ 
        allowed: false, 
        reason: "QR already used (expired)" 
      });
    }

    // 🔁 Decide event type
    let eventType = scanCount === 0 ? "checkin" : "checkout";

    await pool.query(
      "INSERT INTO movement_logs (pass_id,event,gate_id) VALUES (?,?,?)",
      [pass.id, eventType, gateId]
    );

    res.json({ allowed: true, event: eventType });

  } catch (err) {
    console.error(err);
    res.json({ allowed: false, reason: "Invalid QR" });
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
