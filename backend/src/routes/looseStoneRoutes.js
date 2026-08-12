const express = require('express');
const router = express.Router();
const looseStoneController = require('../controllers/looseStoneController');

// Admin & Public routes for Loose Stones
router.get('/', looseStoneController.getAllLooseStones);
router.get('/:id', looseStoneController.getLooseStoneById);
router.post('/', looseStoneController.createLooseStone);
router.put('/:id', looseStoneController.updateLooseStone);
router.delete('/:id', looseStoneController.deleteLooseStone);

module.exports = router;
