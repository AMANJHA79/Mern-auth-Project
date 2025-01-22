const express = require('express');

const { signup, login, logout , verifyEmail , forgotPassword , resetPassword,checkAuth} = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Authentication Check Route
router.get('/check-auth',verifyToken, checkAuth);

// Authentication Routes
router.post('/signup', signup);           // User registration
router.post('/login', login);             // User login
router.post('/logout', logout);           // User logout

// Email Verification Route
router.post('/verify-email', verifyEmail);

// Password Management Routes
router.post('/forgot-password', forgotPassword);         // Initiate password reset
router.post('/reset-password/:token', resetPassword);    // Complete password reset

module.exports = router;