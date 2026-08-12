const mongoose = require('mongoose');

const looseStoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  stone_type: {
    type: String,
    enum: ['diamond', 'solitaire', 'gemstone', 'color_stone'],
    required: true,
    default: 'diamond'
  },
  shape: {
    type: String,
    default: 'Round'
  },
  weight_carat: {
    type: Number,
    required: true,
    default: 0
  },
  quality: {
    type: String,
    default: 'GH-VS'
  },
  color: {
    type: String,
    default: 'G'
  },
  cut_grade: {
    type: String,
    default: 'Excellent'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 1
  },
  certificate_no: {
    type: String,
    default: ''
  },
  mine_name: {
    type: String,
    default: ''
  },
  country_of_origin: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: '1'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LooseStone', looseStoneSchema);
