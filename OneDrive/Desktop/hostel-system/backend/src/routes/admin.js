const router = require("express").Router();
const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");

// only admin can access
router.get("/stats", auth, adminController.getStats);

module.exports = router;
