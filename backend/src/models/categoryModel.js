const mongoose = require('mongoose');

const variantVisibilitySchema = new mongoose.Schema({
  size: {
    type: Boolean,
    default: true
  },
  metal: {
    type: Boolean,
    default: true
  },
  purity: {
    type: Boolean,
    default: true
  },
  diamondQuality: {
    type: Boolean,
    default: true
  },
  diamondWeight: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const makingChargesSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  value: {
    type: Number,
    default: 0
  }
}, { _id: false });

const weightRulesSchema = new mongoose.Schema({
  baseSize: {
    type: Number,
    default: 0
  },
  sizeIncrementWeight: {
    type: Number,
    default: 0
  }
}, { _id: false });

const categoryConfigSchema = new mongoose.Schema({
  variantVisibility: {
    type: variantVisibilitySchema,
    default: () => ({})
  },
  makingCharges: {
    type: makingChargesSchema,
    default: () => ({})
  },
  weightRules: {
    type: weightRulesSchema,
    default: () => ({})
  }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  config: {
    type: categoryConfigSchema,
    default: () => ({})
  }
}, {
  timestamps: true // Auto-handles createdAt and updatedAt
});

const category = mongoose.model('categorie', categorySchema);
module.exports = category;
