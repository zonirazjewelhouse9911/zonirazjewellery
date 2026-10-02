const express = require('express');
const router = express.Router();
const similarProductsController = require('../../controllers/userSide/similarProducts');
const httpCache = require('../../middleware/httpCache');

router.get('/similarProducts/:productId', httpCache(60), similarProductsController.getSimilarProducts);

module.exports = router;
