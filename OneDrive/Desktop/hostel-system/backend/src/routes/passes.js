const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createPass,
  scanQR,
  wardenAction,
  getStudentPasses,
  parentConfirm,
  getPending,
  getQRImage
} = require("../controllers/passController");

// Create pass
router.post("/", auth, createPass);

// Student routes
router.get("/student", auth, getStudentPasses);
router.get("/qr/:id", auth, getQRImage);


// Parent confirmation
router.get("/parent-confirm", parentConfirm);

// Warden routes
router.get("/pending", auth, getPending);
router.post("/warden/:id", auth, wardenAction);

// QR Scan
router.post("/scan", scanQR);

module.exports = router;
