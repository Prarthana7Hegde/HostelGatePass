
const router = require('express').Router();
const auth = require('../middleware/auth');
const passController = require('../controllers/passController');  // ✅ FIXED IMPORT

// Routes
router.post('/', auth, passController.createPass);
router.get('/student', auth, passController.getStudentPasses);
router.get('/parent-confirm', passController.parentConfirm);
router.post('/warden/:id', auth, passController.wardenAction);
router.post('/scan', auth, passController.scanQR);


// NEW: pending passes for warden
router.get('/pending', auth, passController.getPending);  // ✅ FIXED (authenticate → auth)

module.exports = router;
