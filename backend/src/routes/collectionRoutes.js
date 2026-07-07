const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// Collection Admin API routes
router.get('/admin/collections', collectionController.getCollections);
router.get('/admin/collections/:id', collectionController.getCollectionById);
router.post('/admin/collections', collectionController.createCollection);
router.patch('/admin/collections/:id', collectionController.updateCollection);

module.exports = router;
