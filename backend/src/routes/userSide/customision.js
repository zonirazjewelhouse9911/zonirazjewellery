const express = require('express');
const router = express.Router();
const customisionController = require('../../controllers/userSide/customision');

router.post('/customision', customisionController.customision);

module.exports = router;
