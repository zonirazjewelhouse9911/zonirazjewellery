const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User Admin API routes
router.get('/admin/users', userController.getUsers);
router.get('/admin/users/:id', userController.getUserById);
router.patch('/admin/users/:id/status', userController.updateUserStatus);

module.exports = router;
