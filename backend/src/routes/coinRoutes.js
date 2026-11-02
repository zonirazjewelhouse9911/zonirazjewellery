const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

// Standalone Coin Price Calculation API
// Formula: (price + makking + gst) - discount
router.get('/coins/calculate-price', coinController.calculatePrice);
router.post('/coins/calculate-price', coinController.calculatePrice);

// Public Coins Catalog (For user website coin category)
router.get('/coins/catalog', coinController.getPublicCoins);

// Admin & General Coin CRUD Endpoints
router.get('/coins', coinController.getAllCoins);
router.get('/coins/:id', coinController.getCoinById);
router.post('/coins', coinController.createCoin);
router.put('/coins/:id', coinController.updateCoin);
router.delete('/coins/:id', coinController.deleteCoin);

// Also direct root endpoints when mounted at /api/admin/coins
router.get('/', coinController.getAllCoins);
router.get('/:id', coinController.getCoinById);
router.post('/', coinController.createCoin);
router.put('/:id', coinController.updateCoin);
router.delete('/:id', coinController.deleteCoin);

module.exports = router;

