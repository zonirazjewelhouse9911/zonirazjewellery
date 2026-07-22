const express = require('express');
const router = express.Router();
const Product = require('../../models/productModel');

// GET /api/userSide/trending-products - Fetch most bought & trending products
router.get('/trending-products', async (req, res) => {
  try {
    // Query products marked as trending, bestseller, popular, or with high priority
    let products = await Product.find({
      $or: [
        { is_trending: true },
        { is_bestseller: true },
        { is_popular: true },
        { tags: { $in: ['trending', 'bestseller', 'popular', 'top', 'trending-now'] } }
      ]
    }).lean();

    // Fallback: If less than 6 tagged trending products exist, fetch top items from vault
    if (!products || products.length < 6) {
      products = await Product.find().sort({ create_date: -1 }).limit(30).lean();
    }

    return res.status(200).json({
      success: true,
      message: 'Trending and most bought products retrieved successfully',
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch trending products',
      error: error.message
    });
  }
});

module.exports = router;
