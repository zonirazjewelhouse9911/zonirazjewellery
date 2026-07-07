const express = require('express');
const router = express.Router();
const exchangeInquiryController = require('../controllers/exchangeInquiryController');

// Exchange Inquiries Admin API routes
router.get('/admin/exchange-inquiries', exchangeInquiryController.getInquiries);
router.get('/admin/exchange-inquiries/:id', exchangeInquiryController.getInquiryById);
router.patch('/admin/exchange-inquiries/:id/status', exchangeInquiryController.updateInquiryStatus);

module.exports = router;
