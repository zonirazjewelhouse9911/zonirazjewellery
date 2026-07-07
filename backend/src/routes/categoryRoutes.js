const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Category Admin API endpoints
router.get('/admin/categories', categoryController.getCategories);
router.get('/admin/categories/:id', categoryController.getCategoryById);
router.post('/admin/categories', categoryController.createCategory);
router.patch('/admin/categories/:id', categoryController.updateCategory);

module.exports = router;
