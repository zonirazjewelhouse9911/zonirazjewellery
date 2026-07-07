const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Admin Order REST routes
router.get('/admin/orders', orderController.getOrders);
router.get('/admin/orders/:id', orderController.getOrderById);
router.patch('/admin/orders/:id/status', orderController.updateOrderStatus);
router.patch('/admin/orders/:id/payment', orderController.updatePaymentStatus);

module.exports = router;
