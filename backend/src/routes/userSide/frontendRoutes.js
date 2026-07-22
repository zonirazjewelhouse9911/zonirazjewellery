const express = require('express');
const router = express.Router();
const user_auth = require('../../middleware/user_auth');

const frontendAddress = require('../../controllers/userSide/frontendAddress');
const frontendOrder = require('../../controllers/userSide/frontendOrder');
const frontendCoupon = require('../../controllers/userSide/frontendCoupon');

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
router.get('/coupons/available', frontendCoupon.getAvailableCoupons);
router.get('/userSide/available-coupons', frontendCoupon.getAvailableCoupons);

module.exports = router;
