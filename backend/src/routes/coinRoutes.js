const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

// Standalone Coin Price Calculation API
// Formula: (price + makking + gst) - discount
router.get('/calculate-price', coinController.calculatePrice);
router.post('/calculate-price', coinController.calculatePrice);
router.get('/coins/calculate-price', coinController.calculatePrice);
router.post('/coins/calculate-price', coinController.calculatePrice);

// Public Coins Catalog (For user website coin category)
router.get('/catalog', coinController.getPublicCoins);
router.get('/coins/catalog', coinController.getPublicCoins);

// Admin & General Coin CRUD Endpoints
router.get('/', coinController.getAllCoins);
router.get('/coins', coinController.getAllCoins);

router.post('/', coinController.createCoin);
router.post('/coins', coinController.createCoin);

router.get('/:id', coinController.getCoinById);
router.get('/coins/:id', coinController.getCoinById);

router.put('/:id', coinController.updateCoin);
router.put('/coins/:id', coinController.updateCoin);

router.delete('/:id', coinController.deleteCoin);
router.delete('/coins/:id', coinController.deleteCoin);

module.exports = router;

