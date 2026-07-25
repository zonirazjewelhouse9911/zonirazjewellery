const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, enum: ['USER', 'ZONIRAZ_BONUS'], default: 'USER' },
  goldRate24k: { type: Number, required: true },
  goldWeight24kGrams: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  transactionId: { type: String, default: '' },
  status: { type: String, enum: ['PAID', 'PENDING', 'CREDITED'], default: 'PAID' }
});

const goldMineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
  userEmail: { type: String, required: true },
  userName: { type: String, default: '' },
  userPhone: { type: String, default: '' },
  planId: { type: String, required: true, unique: true },
  monthlyAmount: { type: Number, required: true },
  totalPaidInstallments: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'ACTIVE' },
  installments: [installmentSchema],
  totalGold24kGrams: { type: Number, default: 0 },
  totalSavingsAmount: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  maturityDate: { type: Date }
}, {
  timestamps: true
});

const GoldMine = mongoose.model('GoldMine', goldMineSchema);
module.exports = GoldMine;
