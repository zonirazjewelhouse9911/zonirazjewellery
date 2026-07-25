const Wallet = require('../models/walletModel');
const JewelleryPricing = require('../models/jewelleryPricingModel');

// Helper to get current live 24k gold rate
async function getCurrent24kRate() {
  try {
    const pricing = await JewelleryPricing.findOne().sort({ createdAt: -1 });
    if (pricing && pricing.gold_rate_24k > 0) {
      return pricing.gold_rate_24k;
    }
  } catch (e) {
    console.error('Error fetching live gold rate in wallet service:', e);
  }
  return 7200; // Fallback rate
}

// 1. Credit Gold Wallet for an EMI installment or Bonus
exports.creditWalletForEMI = async ({
  userEmail,
  planId,
  installmentNumber,
  amount,
  goldRate24k,
  goldWeight24kGrams,
  paidBy = 'USER',
  description = '',
  userId = null
}) => {
  if (!userEmail) {
    throw new Error('User email is required to credit gold wallet');
  }

  const cleanEmail = userEmail.toLowerCase().trim();
  let wallet = await Wallet.findOne({ userEmail: cleanEmail });

  if (!wallet) {
    wallet = new Wallet({
      user: userId || null,
      userEmail: cleanEmail,
      totalGold24kGrams: 0,
      totalAmountSaved: 0,
      totalBonusEarned: 0,
      transactions: []
    });
  } else if (userId && !wallet.user) {
    wallet.user = userId;
  }

  const txnType = paidBy === 'ZONIRAZ_BONUS' ? 'BONUS_CREDIT' : 'EMI_CREDIT';
  const txnId = (paidBy === 'ZONIRAZ_BONUS' ? 'WLT-BONUS-' : 'WLT-EMI-') + Date.now() + '-' + Math.floor(100 + Math.random() * 900);
  const defaultDesc = paidBy === 'ZONIRAZ_BONUS'
    ? `Zoniraz 100% Free Bonus EMI #${installmentNumber} Credited for Plan ${planId}`
    : `10+1 Gold Mine EMI #${installmentNumber} Paid for Plan ${planId}`;

  const newTxn = {
    transactionId: txnId,
    planId: planId || '',
    installmentNumber: installmentNumber || 0,
    type: txnType,
    amount: Number(amount) || 0,
    goldRate24k: Number(goldRate24k) || 7200,
    goldWeight24kGrams: Number(goldWeight24kGrams) || 0,
    paidBy: paidBy,
    description: description || defaultDesc,
    date: new Date()
  };

  wallet.transactions.push(newTxn);
  wallet.totalGold24kGrams = parseFloat((wallet.totalGold24kGrams + (Number(goldWeight24kGrams) || 0)).toFixed(4));
  wallet.totalAmountSaved += Number(amount) || 0;

  if (paidBy === 'ZONIRAZ_BONUS') {
    wallet.totalBonusEarned += Number(amount) || 0;
  }

  await wallet.save();
  return wallet;
};

// 2. Get User Wallet details with live market valuation and karat breakdown
exports.getUserWalletDetails = async (userEmail) => {
  if (!userEmail) {
    return {
      success: false,
      message: 'User email is required',
      data: null
    };
  }

  const cleanEmail = userEmail.toLowerCase().trim();
  const liveRate24k = await getCurrent24kRate();
  let wallet = await Wallet.findOne({ userEmail: cleanEmail });

  if (!wallet) {
    return {
      success: true,
      message: 'Wallet initial state',
      data: {
        userEmail: cleanEmail,
        totalGold24kGrams: 0,
        totalAmountSaved: 0,
        totalBonusEarned: 0,
        currentLiveRate24k: liveRate24k,
        currentMarketValue: 0,
        karatWeights: {
          '24K': 0,
          '22K': 0,
          '18K': 0,
          '14K': 0
        },
        transactions: []
      }
    };
  }

  const g24k = wallet.totalGold24kGrams || 0;
  const currentMarketValue = Math.round(g24k * liveRate24k);

  const karatWeights = {
    '24K': parseFloat(g24k.toFixed(3)),
    '22K': parseFloat((g24k * (24 / 22)).toFixed(3)),
    '18K': parseFloat((g24k * (24 / 18)).toFixed(3)),
    '14K': parseFloat((g24k * (24 / 14)).toFixed(3))
  };

  const sortedTransactions = [...(wallet.transactions || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    success: true,
    message: 'User wallet retrieved successfully',
    data: {
      _id: wallet._id,
      userEmail: wallet.userEmail,
      totalGold24kGrams: parseFloat(g24k.toFixed(4)),
      totalAmountSaved: wallet.totalAmountSaved || 0,
      totalBonusEarned: wallet.totalBonusEarned || 0,
      currentLiveRate24k: liveRate24k,
      currentMarketValue: currentMarketValue,
      karatWeights: karatWeights,
      transactions: sortedTransactions
    }
  };
};

// 3. Admin: Get all wallets summary & aggregate metrics
exports.getAllWallets = async () => {
  const liveRate24k = await getCurrent24kRate();
  const wallets = await Wallet.find().sort({ updatedAt: -1 });

  let aggregateGold24k = 0;
  let aggregateAmountSaved = 0;
  let aggregateBonusEarned = 0;

  const enrichedWallets = wallets.map(w => {
    const wObj = w.toObject();
    const g24k = wObj.totalGold24kGrams || 0;
    aggregateGold24k += g24k;
    aggregateAmountSaved += wObj.totalAmountSaved || 0;
    aggregateBonusEarned += wObj.totalBonusEarned || 0;

    wObj.currentMarketValue = Math.round(g24k * liveRate24k);
    wObj.karatWeights = {
      '24K': parseFloat(g24k.toFixed(3)),
      '22K': parseFloat((g24k * (24 / 22)).toFixed(3)),
      '18K': parseFloat((g24k * (24 / 18)).toFixed(3)),
      '14K': parseFloat((g24k * (24 / 14)).toFixed(3))
    };
    return wObj;
  });

  return {
    success: true,
    message: 'All user wallets retrieved for admin',
    data: {
      liveRate24k,
      totalWalletsCount: wallets.length,
      aggregateGold24kGrams: parseFloat(aggregateGold24k.toFixed(4)),
      aggregateMarketValue: Math.round(aggregateGold24k * liveRate24k),
      aggregateAmountSaved,
      aggregateBonusEarned,
      wallets: enrichedWallets
    }
  };
};

// 4. Redeem user wallet balance for jewellery order purchase
exports.redeemWalletForOrder = async ({ userEmail, amount, orderId }) => {
  if (!userEmail || !amount || Number(amount) <= 0) return null;

  const cleanEmail = userEmail.toLowerCase().trim();
  const wallet = await Wallet.findOne({ userEmail: cleanEmail });
  if (!wallet || wallet.totalGold24kGrams <= 0) return null;

  const liveRate24k = await getCurrent24kRate();
  const redeemAmount = Number(amount);
  const gramsToDeduct = parseFloat((redeemAmount / liveRate24k).toFixed(4));

  const actualGramsDeducted = Math.min(wallet.totalGold24kGrams, gramsToDeduct);
  wallet.totalGold24kGrams = parseFloat(Math.max(0, wallet.totalGold24kGrams - actualGramsDeducted).toFixed(4));

  const txnId = 'WLT-RED-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900);
  const friendlyOrderId = orderId ? orderId.toString().substring(0, 8).toUpperCase() : 'ORD';

  wallet.transactions.push({
    transactionId: txnId,
    planId: '',
    installmentNumber: 0,
    type: 'REDEMPTION',
    amount: redeemAmount,
    goldRate24k: liveRate24k,
    goldWeight24kGrams: actualGramsDeducted,
    paidBy: 'USER',
    description: `Redeemed ${actualGramsDeducted}g Gold (₹${redeemAmount.toLocaleString('en-IN')}) for Jewellery Purchase #${friendlyOrderId}`,
    date: new Date()
  });

  await wallet.save();
  return wallet;
};
