const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { loginLimiter } = require('../../middlewares/rateLimiter');
const { authenticate } = require('../../middlewares/auth');

// POST /api/auth/login
// Rate limited: max 5 attempts per minute per IP
router.post('/login', loginLimiter, authController.login);

// GET /api/auth/me
// Protected: requires valid JWT token
router.get('/me', authenticate, authController.getMe);

module.exports = router;
