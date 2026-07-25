const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');

// Admin Authentication REST Endpoints
router.post('/login', adminAuthController.login);
router.post('/forgot-password', adminAuthController.forgotPassword);
router.post('/verify-otp', adminAuthController.verifyOtp);
router.post('/reset-password', adminAuthController.resetPassword);
router.get('/me', adminAuthController.getMe);

module.exports = router;
