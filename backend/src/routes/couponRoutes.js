const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Coupon Admin API routes
router.get('/admin/coupons', couponController.getCoupons);
router.get('/admin/coupons/:id', couponController.getCouponById);
router.post('/admin/coupons', couponController.createCoupon);
router.patch('/admin/coupons/:id', couponController.updateCoupon);
router.post('/admin/coupons/send-whatsapp', couponController.sendWhatsAppCoupon);

module.exports = router;
