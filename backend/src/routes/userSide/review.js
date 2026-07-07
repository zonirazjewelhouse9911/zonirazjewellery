const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/userSide/review');

router.post('/postReview', reviewController.postReview);
router.get('/getUserReviews/:userId', reviewController.getUserReviews);

module.exports = router;
