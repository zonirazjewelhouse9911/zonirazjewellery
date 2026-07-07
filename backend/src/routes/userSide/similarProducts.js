const express = require('express');
const router = express.Router();
const similarProductsController = require('../../controllers/userSide/similarProducts');

router.get('/similarProducts/:productId', similarProductsController.getSimilarProducts);

module.exports = router;
