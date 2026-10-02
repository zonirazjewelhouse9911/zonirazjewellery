const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

const httpCache = require('../middleware/httpCache');

router.get('/admin/banners', bannerController.getBanners);
router.get('/banners', httpCache(120), bannerController.getBanners);
router.post('/admin/banners', bannerController.createBanner);
router.delete('/admin/banners/:id', bannerController.deleteBanner);

module.exports = router;
