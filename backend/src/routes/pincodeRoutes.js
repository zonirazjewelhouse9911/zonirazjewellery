const express = require('express');
const router = express.Router();
const pincodeService = require('../services/pincodeService');

// GET /api/pincode/:pincode or GET /api/pincode?pincode=302001
router.get('/pincode/:pincode?', async (req, res) => {
  try {
    const pincode = req.params.pincode || req.query.pincode;
    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'PIN code is required (e.g. /api/pincode/302001 or ?pincode=302001)',
        data: null
      });
    }

    const result = await pincodeService.getPincodeDetails(pincode);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in pincode route:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching PIN code details',
      data: null
    });
  }
});

module.exports = router;
