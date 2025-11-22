const jwt = require("jsonwebtoken");

const QR_SECRET = process.env.QR_SECRET || "QR_SECRET_KEY_123";

// CREATE QR TOKEN


exports.signQR = (passId) => {
  return jwt.sign(
    { passId },
    process.env.QR_SECRET,
    { expiresIn: "3h" }   // ✅ VALID FORMAT
  );
};


// VERIFY QR TOKEN
exports.verifyQR = (token) => {
  try {
    const decoded = jwt.verify(token, QR_SECRET);
    return decoded;
  } catch (err) {
    console.log("QR VERIFY ERROR:", err.message);
    throw new Error("Invalid QR");
  }
};
