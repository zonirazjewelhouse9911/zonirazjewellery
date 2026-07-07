const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    default: 0
  },
  minCartValue: {
    type: Number,
    default: 0
  },
  expirationDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 100
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  restrictions: {
    categories: {
      type: [String],
      default: []
    },
    products: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true // Auto-handles createdAt and updatedAt
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
