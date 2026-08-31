const express = require('express');
const router = express.Router();
const pendantController = require('../controllers/pendantController');

// Public endpoints for generator & pricing
router.get('/config', pendantController.getConfig);
router.post('/calculate-price', pendantController.calculatePrice);
router.post('/upload-preview', pendantController.uploadPreview);

// Admin calibration update endpoint
router.put('/admin/config', pendantController.updateConfig);

module.exports = router;
