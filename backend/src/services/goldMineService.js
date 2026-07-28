const GoldMine = require('../models/goldMineModel');
const JewelleryPricing = require('../models/jewelleryPricingModel');
const walletService = require('./walletService');
const goldMineEmailService = require('./goldMineEmailService');

// Helper to get current live 24k gold rate
async function getCurrent24kRate() {
  try {
    const pricing = await JewelleryPricing.findOne().sort({ createdAt: -1 });
    if (pricing && pricing.gold_rate_24k > 0) {
      return pricing.gold_rate_24k;
    }
  } catch (e) {
    console.error('Error fetching live gold rate:', e);
  }
  return 7200; // Fallback rate if not found
}

// 1. Start a new 10+1 Gold Mine Savings Plan
exports.startPlan = async ({ userEmail, userName, userPhone, monthlyAmount, userId, paymentMethod, transactionId, razorpayPaymentId }) => {
  const amount = Number(monthlyAmount);
  if (!userEmail || !amount || amount < 2) {
    return {
      success: false,
      message: 'Please provide a valid email and minimum monthly installment of ₹2',
      data: null
    };
  }

  const liveRate24k = await getCurrent24kRate();
  const planId = 'GMP-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
  
  const resolvedTxnId = razorpayPaymentId || transactionId || ('rzp_pay_' + Date.now().toString(36));
  const resolvedMethod = paymentMethod || 'Razorpay (UPI / Card / Netbanking)';

  // Maturity date: 11 months from start date
  const startDate = new Date();
  const maturityDate = new Date(startDate);
  maturityDate.setMonth(maturityDate.getMonth() + 11);

  // Calculate Month 1 Gold Weight
  const firstGoldWeight = parseFloat((amount / liveRate24k).toFixed(4));
  const firstInstallment = {
    installmentNumber: 1,
    amount: amount,
    paidBy: 'USER',
    paymentMethod: resolvedMethod,
    goldRate24k: liveRate24k,
    goldWeight24kGrams: firstGoldWeight,
    paymentDate: startDate,
    dueDate: startDate,
    isLate: false,
    transactionId: resolvedTxnId,
    status: 'PAID'
  };

  const plan = new GoldMine({
    user: userId || null,
    userEmail: userEmail.toLowerCase().trim(),
    userName: userName || '',
    userPhone: userPhone || '',
    planId: planId,
    monthlyAmount: amount,
    totalPaidInstallments: 1,
    status: 'ACTIVE',
    installments: [firstInstallment],
    totalGold24kGrams: firstGoldWeight,
    totalSavingsAmount: amount,
    startDate: startDate,
    maturityDate: maturityDate
  });

  await plan.save();

  // Credit Gold Wallet for Month 1
  try {
    await walletService.creditWalletForEMI({
      userEmail: userEmail,
      planId: planId,
      installmentNumber: 1,
      amount: amount,
      goldRate24k: liveRate24k,
      goldWeight24kGrams: firstGoldWeight,
      paidBy: 'USER',
      description: `10+1 Gold Mine Month 1 EMI Paid for Plan ${planId}`,
      userId: userId
    });
  } catch (err) {
    console.error('Error crediting wallet on startPlan:', err);
  }

  // Send Registration Passbook Invoice Email to User and Admin
  try {
    goldMineEmailService.sendInvoiceEmail({
      planId: planId,
      userEmail: userEmail,
      actionType: 'REGISTER'
    });
  } catch (emailErr) {
    console.error('Error triggering registration invoice email:', emailErr);
  }

  return {
    success: true,
    message: 'Gold Mine 10+1 Plan started successfully! Month 1 installment processed & credited to your Gold Wallet.',
    data: plan
  };
};

// 2. Pay next monthly installment & auto-credit 11th bonus month when 10 paid
exports.payInstallment = async ({ planId, userEmail, paymentMethod, transactionId, razorpayPaymentId }) => {
  if (!planId || !userEmail) {
    return {
      success: false,
      message: 'Plan ID and email are required',
      data: null
    };
  }

  const plan = await GoldMine.findOne({
    planId: planId,
    userEmail: userEmail.toLowerCase().trim()
  });

  if (!plan) {
    return {
      success: false,
      message: 'Gold Mine plan not found',
      data: null
    };
  }

  if (plan.status !== 'ACTIVE') {
    return {
      success: false,
      message: `Plan is already ${plan.status.toLowerCase()}`,
      data: null
    };
  }

  if (plan.totalPaidInstallments >= 10) {
    return {
      success: false,
      message: 'All 10 user installments have already been completed for this plan.',
      data: null
    };
  }

  const liveRate24k = await getCurrent24kRate();
  const nextNum = plan.totalPaidInstallments + 1;
  const amount = plan.monthlyAmount;
  const goldWeight = parseFloat((amount / liveRate24k).toFixed(4));

  // Calculate expected Due Date for this installment (1 month per installment)
  const planStart = new Date(plan.startDate || Date.now());
  const dueDate = new Date(planStart);
  dueDate.setMonth(dueDate.getMonth() + (nextNum - 1));

  // Grace period cutoff: 30 days past due date
  const graceCutoff = new Date(dueDate);
  graceCutoff.setDate(graceCutoff.getDate() + 30);

  const now = new Date();
  let isLatePayment = false;

  if (now > graceCutoff) {
    isLatePayment = true;
    plan.isBonusEligible = false;
    plan.bonusLapsed = true;
    plan.bonusLapsedReason = `Installment #${nextNum} was paid past the due date (${dueDate.toLocaleDateString('en-IN')}).`;
  }

  const newInstallment = {
    installmentNumber: nextNum,
    amount: amount,
    paidBy: 'USER',
    paymentMethod: resolvedMethod,
    goldRate24k: liveRate24k,
    goldWeight24kGrams: goldWeight,
    paymentDate: now,
    dueDate: dueDate,
    isLate: isLatePayment,
    transactionId: resolvedTxnId,
    status: 'PAID'
  };

  plan.installments.push(newInstallment);
  plan.totalPaidInstallments += 1;
  plan.totalGold24kGrams = parseFloat((plan.totalGold24kGrams + goldWeight).toFixed(4));
  plan.totalSavingsAmount += amount;

  let bonusMessage = '';

  // AUTOMATIC 11TH MONTH FREE BONUS BY ZONIRAZ (Only if all installments paid on time)
  if (plan.totalPaidInstallments === 10) {
    if (plan.isBonusEligible !== false && !plan.bonusLapsed) {
      const bonusGoldWeight = parseFloat((amount / liveRate24k).toFixed(4));
      const bonusInstallment = {
        installmentNumber: 11,
        amount: amount,
        paidBy: 'ZONIRAZ_BONUS',
        goldRate24k: liveRate24k,
        goldWeight24kGrams: bonusGoldWeight,
        paymentDate: new Date(),
        dueDate: new Date(),
        isLate: false,
        transactionId: 'ZONIRAZ-BONUS-' + Date.now(),
        status: 'CREDITED'
      };

      plan.installments.push(bonusInstallment);
      plan.totalGold24kGrams = parseFloat((plan.totalGold24kGrams + bonusGoldWeight).toFixed(4));
      plan.totalSavingsAmount += amount;
      plan.status = 'COMPLETED';
      bonusMessage = ' 🎉 Congratulations! All 10 installments were paid on time, and Zoniraz has credited your 11th Month FREE Bonus installment!';
    } else {
      plan.status = 'COMPLETED';
      bonusMessage = ' ⚠️ Plan Completed (10/10 paid). Note: Free 11th Month Bonus lapsed because an installment was paid past the due date.';
    }
  }

  await plan.save();

  // Credit Gold Wallet for user installment
  try {
    await walletService.creditWalletForEMI({
      userEmail: userEmail,
      planId: planId,
      installmentNumber: nextNum,
      amount: amount,
      goldRate24k: liveRate24k,
      goldWeight24kGrams: goldWeight,
      paidBy: 'USER',
      description: `10+1 Gold Mine EMI #${nextNum} Paid for Plan ${planId}`
    });

    if (plan.totalPaidInstallments === 10) {
      const bonusGoldWeight = parseFloat((amount / liveRate24k).toFixed(4));
      await walletService.creditWalletForEMI({
        userEmail: userEmail,
        planId: planId,
        installmentNumber: 11,
        amount: amount,
        goldRate24k: liveRate24k,
        goldWeight24kGrams: bonusGoldWeight,
        paidBy: 'ZONIRAZ_BONUS',
        description: `🎉 Zoniraz 100% FREE 11th Bonus EMI Credited for Plan ${planId}`
      });
    }
  } catch (err) {
    console.error('Error crediting wallet on payInstallment:', err);
  }

  // Send Updated Passbook Invoice Email to User and Admin
  try {
    goldMineEmailService.sendInvoiceEmail({
      planId: planId,
      userEmail: userEmail,
      actionType: 'EMI_PAYMENT'
    });
  } catch (emailErr) {
    console.error('Error triggering EMI invoice email:', emailErr);
  }

  return {
    success: true,
    message: `Installment #${nextNum} of ₹${amount.toLocaleString('en-IN')} paid successfully & credited to your Gold Wallet!` + bonusMessage,
    data: plan
  };
};

// 3. Get all plans for a user with Karat conversions
exports.getUserPlans = async (userEmail) => {
  if (!userEmail) {
    return { success: false, message: 'User email is required', data: [] };
  }

  const liveRate24k = await getCurrent24kRate();
  const plans = await GoldMine.find({ userEmail: userEmail.toLowerCase().trim() }).sort({ createdAt: -1 });

  const enrichedPlans = plans.map(p => {
    const pObj = p.toObject();
    const g24k = pObj.totalGold24kGrams || 0;

    // Karat weight conversions:
    // 22K weight = 24K * (24/22)
    // 18K weight = 24K * (24/18)
    // 14K weight = 24K * (24/14)
    pObj.karatWeights = {
      '24K': parseFloat(g24k.toFixed(3)),
      '22K': parseFloat((g24k * (24 / 22)).toFixed(3)),
      '18K': parseFloat((g24k * (24 / 18)).toFixed(3)),
      '14K': parseFloat((g24k * (24 / 14)).toFixed(3))
    };
    pObj.currentLiveRate24k = liveRate24k;
    pObj.currentGoldValue = Math.round(g24k * liveRate24k);
    return pObj;
  });

  return {
    success: true,
    message: 'User Gold Mine plans retrieved',
    data: enrichedPlans
  };
};

// 4. Get single plan details
exports.getPlanDetails = async (planId) => {
  if (!planId) {
    return { success: false, message: 'Plan ID is required', data: null };
  }

  const plan = await GoldMine.findOne({ planId: planId });
  if (!plan) {
    return { success: false, message: 'Plan not found', data: null };
  }

  const liveRate24k = await getCurrent24kRate();
  const pObj = plan.toObject();
  const g24k = pObj.totalGold24kGrams || 0;

  pObj.karatWeights = {
    '24K': parseFloat(g24k.toFixed(3)),
    '22K': parseFloat((g24k * (24 / 22)).toFixed(3)),
    '18K': parseFloat((g24k * (24 / 18)).toFixed(3)),
    '14K': parseFloat((g24k * (24 / 14)).toFixed(3))
  };
  pObj.currentLiveRate24k = liveRate24k;
  pObj.currentGoldValue = Math.round(g24k * liveRate24k);

  return {
    success: true,
    message: 'Plan details retrieved',
    data: pObj
  };
};

// 5. Admin: Get all 10+1 Gold Mine plans across all users
exports.getAllPlans = async () => {
  const liveRate24k = await getCurrent24kRate();
  const plans = await GoldMine.find().sort({ createdAt: -1 });

  const enrichedPlans = plans.map(p => {
    const pObj = p.toObject();
    const g24k = pObj.totalGold24kGrams || 0;
    pObj.karatWeights = {
      '24K': parseFloat(g24k.toFixed(3)),
      '22K': parseFloat((g24k * (24 / 22)).toFixed(3)),
      '18K': parseFloat((g24k * (24 / 18)).toFixed(3)),
      '14K': parseFloat((g24k * (24 / 14)).toFixed(3))
    };
    pObj.currentLiveRate24k = liveRate24k;
    pObj.currentGoldValue = Math.round(g24k * liveRate24k);
    return pObj;
  });

  return {
    success: true,
    message: 'All Gold Mine plans retrieved for admin',
    data: enrichedPlans
  };
};
