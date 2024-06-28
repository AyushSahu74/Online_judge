const express = require('express');

const authController = require('../controllers/auth.controller.js');
const { getMe, login, logout, signup } = authController;

const protectRoute = require('../middleware/protectRoute.js');
const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;