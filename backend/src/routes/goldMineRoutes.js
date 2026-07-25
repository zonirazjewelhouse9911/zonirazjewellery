const express = require('express');
const router = express.Router();
const goldMineService = require('../services/goldMineService');
const walletService = require('../services/walletService');
const JewelleryPricing = require('../models/jewelleryPricingModel');

// GET /api/goldmine/live-rate
router.get('/goldmine/live-rate', async (req, res) => {
  try {
    const pricing = await JewelleryPricing.findOne().sort({ createdAt: -1 });
    const liveRate24k = pricing && pricing.gold_rate_24k > 0 ? pricing.gold_rate_24k : 7200;
    return res.status(200).json({
      success: true,
      rate24k: liveRate24k,
      rate22k: Math.floor(liveRate24k * 91.6 / 100),
      rate18k: Math.floor(liveRate24k * 75 / 100),
      rate14k: Math.floor(liveRate24k * 58.5 / 100)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/goldmine/wallet
router.get('/goldmine/wallet', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.query.email;
    const result = await walletService.getUserWalletDetails(userEmail);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching user wallet:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/goldmine/start-plan
router.post('/goldmine/start-plan', async (req, res) => {
  try {
    const { userEmail, userName, userPhone, monthlyAmount, userId } = req.body;
    const result = await goldMineService.startPlan({
      userEmail,
      userName,
      userPhone,
      monthlyAmount,
      userId
    });
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error starting Gold Mine plan:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/goldmine/pay-installment
router.post('/goldmine/pay-installment', async (req, res) => {
  try {
    const { planId, userEmail } = req.body;
    const result = await goldMineService.payInstallment({ planId, userEmail });
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error paying Gold Mine installment:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/goldmine/my-plans
router.get('/goldmine/my-plans', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.query.email;
    const result = await goldMineService.getUserPlans(userEmail);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching Gold Mine plans:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/goldmine/plan/:planId
router.get('/goldmine/plan/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const result = await goldMineService.getPlanDetails(planId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching plan details:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/wallets
router.get('/admin/wallets', async (req, res) => {
  try {
    const result = await walletService.getAllWallets();
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching admin wallets:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/goldmine/all-plans
router.get('/admin/goldmine/all-plans', async (req, res) => {
  try {
    const result = await goldMineService.getAllPlans();
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching all goldmine plans for admin:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

