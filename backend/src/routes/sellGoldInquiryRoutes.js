const express = require('express');
const router = express.Router();
const sellGoldInquiryController = require('../controllers/sellGoldInquiryController');

// Sell Gold Inquiries Admin API routes
router.get('/admin/sell-gold-inquiries', sellGoldInquiryController.getInquiries);
router.get('/admin/sell-gold-inquiries/:id', sellGoldInquiryController.getInquiryById);
router.patch('/admin/sell-gold-inquiries/:id/status', sellGoldInquiryController.updateInquiryStatus);

module.exports = router;
