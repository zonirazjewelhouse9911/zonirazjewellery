const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  coin_type: {
    type: String,
    enum: ['gold', 'silver', 'platinum', 'other'],
    required: true,
    default: 'gold'
  },
  weight_grams: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  },
  purity: {
    type: String,
    default: '24K (999)'
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  making_charges: {
    type: Number,
    min: 0,
    default: 0
  },
  gst_percent: {
    type: Number,
    min: 0,
    max: 100,
    default: 3
  },
  discount_percent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 10
  },
  sku: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: '1'
  }
}, {
  timestamps: true
});

coinSchema.index({ coin_type: 1, status: 1 });
coinSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Coin', coinSchema);

