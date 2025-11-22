/*const router = require('express').Router();
const { register, login } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
module.exports = router;
*/

/*const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ 1) REGISTER ROUTE – THIS WAS MISSING
router.post("/register", authController.register);

// ✅ 2) LOGIN ROUTE – already there
router.post("/login", authController.login);

module.exports = router;

