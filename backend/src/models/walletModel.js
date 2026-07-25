const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  planId: { type: String, default: '' },
  installmentNumber: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ['EMI_CREDIT', 'BONUS_CREDIT', 'REDEMPTION', 'DEPOSIT'],
    default: 'EMI_CREDIT'
  },
  amount: { type: Number, required: true },
  goldRate24k: { type: Number, required: true },
  goldWeight24kGrams: { type: Number, required: true },
  paidBy: {
    type: String,
    enum: ['USER', 'ZONIRAZ_BONUS'],
    default: 'USER'
  },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  totalGold24kGrams: { type: Number, default: 0 },
  totalAmountSaved: { type: Number, default: 0 },
  totalBonusEarned: { type: Number, default: 0 },
  transactions: [walletTransactionSchema]
}, {
  timestamps: true
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
