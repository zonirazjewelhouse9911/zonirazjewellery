const coinService = require('../services/coinService');
const cacheManager = require('../utils/cacheManager');

async function invalidateCoinCaches() {
  await Promise.all([
    cacheManager.del('products'),
    cacheManager.del('all_coins'),
    cacheManager.del('coins_catalog')
  ]).catch(err => console.error('Coin cache invalidate error:', err));
}

class CoinController {
  /**
   * Get all coins (Admin / General)
   */
  getAllCoins = async (req, res) => {
    try {
      const { coin_type, status, search } = req.query;
      const coins = await coinService.getAllCoins({ coin_type, status, search });
      return res.status(200).json({
        success: true,
        count: coins.length,
        data: coins
      });
    } catch (error) {
      console.error('Get Coins Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve coins', error: error.message });
    }
  };

  /**
   * Get active coins for website / coin category
   */
  getPublicCoins = async (req, res) => {
    try {
      const { coin_type } = req.query;
      const coins = await coinService.getActiveCoinsCatalog({ coin_type });
      return res.status(200).json({
        success: true,
        count: coins.length,
        data: coins
      });
    } catch (error) {
      console.error('Get Public Coins Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve coins', error: error.message });
    }
  };

  /**
   * Get single coin by ID
   */
  getCoinById = async (req, res) => {
    try {
      const coin = await coinService.getCoinById(req.params.id);
      if (!coin) {
        return res.status(404).json({ success: false, message: 'Coin not found' });
      }
      return res.status(200).json({ success: true, data: coin });
    } catch (error) {
      console.error('Get Coin By ID Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve coin', error: error.message });
    }
  };

  /**
   * Coin Price Calculation API
   * Formula: calculate (price + gst + makking) - discount
   * Accepts query parameters or JSON body: { price, making_charges, gst_percent, discount_percent }
   */
  calculatePrice = async (req, res) => {
    try {
      const price = req.body.price !== undefined ? req.body.price : req.query.price;
      const making_charges = req.body.making_charges !== undefined ? req.body.making_charges : (req.query.making_charges || req.query.makking || 0);
      const gst_percent = req.body.gst_percent !== undefined ? req.body.gst_percent : (req.query.gst_percent || req.query.gst || 3);
      const discount_percent = req.body.discount_percent !== undefined ? req.body.discount_percent : (req.query.discount_percent || req.query.discount || 0);

      const pricing = coinService.calculatePrice({
        price,
        making_charges,
        gst_percent,
        discount_percent
      });

      return res.status(200).json({
        success: true,
        formula: '(price + makking + gst) - discount',
        data: pricing
      });
    } catch (error) {
      console.error('Calculate Coin Price Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to calculate coin price', error: error.message });
    }
  };

  /**
   * Create coin
   */
  createCoin = async (req, res) => {
    try {
      const { title, price } = req.body;
      if (!title || price === undefined) {
        return res.status(400).json({ success: false, message: 'Title and base price are required.' });
      }

      const coin = await coinService.createCoin(req.body);
      await invalidateCoinCaches();

      return res.status(201).json({
        success: true,
        message: 'Coin created successfully',
        data: coin
      });
    } catch (error) {
      console.error('Create Coin Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create coin', error: error.message });
    }
  };

  /**
   * Update coin
   */
  updateCoin = async (req, res) => {
    try {
      const coin = await coinService.updateCoin(req.params.id, req.body);
      if (!coin) {
        return res.status(404).json({ success: false, message: 'Coin not found' });
      }
      await invalidateCoinCaches();

      return res.status(200).json({
        success: true,
        message: 'Coin updated successfully',
        data: coin
      });
    } catch (error) {
      console.error('Update Coin Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update coin', error: error.message });
    }
  };

  /**
   * Delete coin
   */
  deleteCoin = async (req, res) => {
    try {
      const deleted = await coinService.deleteCoin(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Coin not found' });
      }
      await invalidateCoinCaches();

      return res.status(200).json({
        success: true,
        message: 'Coin deleted successfully'
      });
    } catch (error) {
      console.error('Delete Coin Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete coin', error: error.message });
    }
  };
}

module.exports = new CoinController();

