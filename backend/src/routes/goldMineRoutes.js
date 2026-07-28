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

// POST /api/goldmine/buy-gold
router.post('/goldmine/buy-gold', async (req, res) => {
  try {
    const { userEmail, amount, grams, goldRate24k, userId } = req.body;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }
    const numAmount = Number(amount) || 0;
    const numGrams = Number(grams) || 0;
    if (numAmount <= 0 || numGrams <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid purchase amount or weight' });
    }

    await walletService.creditWalletForEMI({
      userEmail,
      planId: 'DIRECT_BUY',
      installmentNumber: 0,
      amount: numAmount,
      goldRate24k: Number(goldRate24k) || 7200,
      goldWeight24kGrams: numGrams,
      paidBy: 'USER',
      description: `Direct Digital Gold Purchase: ${numGrams}g 24K Gold (₹${numAmount.toLocaleString('en-IN')})`,
      userId
    });

    const updatedDetails = await walletService.getUserWalletDetails(userEmail);

    return res.status(200).json({
      success: true,
      message: `Successfully purchased ${numGrams}g Digital Gold! Added to your 10+1 Gold Wallet.`,
      data: updatedDetails.data
    });
  } catch (err) {
    console.error('Error in buy-gold endpoint:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/goldmine/start-plan
router.post('/goldmine/start-plan', async (req, res) => {
  try {
    const { userEmail, userName, userPhone, monthlyAmount, userId, paymentMethod, transactionId, razorpayPaymentId, razorpayOrderId } = req.body;
    const result = await goldMineService.startPlan({
      userEmail,
      userName,
      userPhone,
      monthlyAmount,
      userId,
      paymentMethod,
      transactionId,
      razorpayPaymentId,
      razorpayOrderId
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
    const { planId, userEmail, paymentMethod, transactionId, razorpayPaymentId, razorpayOrderId } = req.body;
    const result = await goldMineService.payInstallment({ 
      planId, 
      userEmail,
      paymentMethod,
      transactionId,
      razorpayPaymentId,
      razorpayOrderId
    });
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

