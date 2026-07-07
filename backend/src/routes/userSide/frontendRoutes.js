const express = require('express');
const router = express.Router();
const user_auth = require('../../middleware/user_auth');

const frontendAuth = require('../../controllers/userSide/frontendAuth');
const frontendAddress = require('../../controllers/userSide/frontendAddress');
const frontendOrder = require('../../controllers/userSide/frontendOrder');
const frontendCoupon = require('../../controllers/userSide/frontendCoupon');

// Auth routes
router.post('/auth/register', frontendAuth.register);
router.post('/auth/login', frontendAuth.login);
router.get('/auth/me', user_auth, frontendAuth.me);
router.put('/auth/profile', user_auth, frontendAuth.updateProfile);
router.delete('/auth/profile', user_auth, frontendAuth.deleteAccount);
router.post('/otp/send', frontendAuth.sendOtp);
router.post('/otp/verify', frontendAuth.verifyOtp);

// Saved Addresses routes
router.get('/addresses', user_auth, frontendAddress.getAddresses);
router.post('/addresses', user_auth, frontendAddress.addAddress);
router.put('/addresses/:id', user_auth, frontendAddress.updateAddress);
router.delete('/addresses/:id', user_auth, frontendAddress.deleteAddress);

// Order History routes
router.get('/orders', user_auth, frontendOrder.getOrders);
router.post('/orders', user_auth, frontendOrder.createOrder);

// Coupon routes
router.post('/coupons/verify', frontendCoupon.verifyCoupon);

module.exports = router;
