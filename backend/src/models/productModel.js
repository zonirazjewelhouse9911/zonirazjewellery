const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  category_id: {
    type: String,
    required: true
  },
  product_category: {
    type: String,
    required: false
  },
  product_subcategory: {
    type: String,
    required: false
  },
  subcategory_id: {
    type: String,
    required: true
  },
  product_title: {
    type: String,
    required: true
  },
  product_code: {
    type: String,
    required: true
  },
  hsn_code: {
    type: String,
    default: "00"
  },
  product_type: {
    type: String,
    default: "diamond"
  },
  product_slug: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  basePrice: {
    type: Number,
    default: 0
  },
  making_charges: {
    type: Number,
    default: 0
  },
  makingCharges: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  gender: {
    type: String
  },
  size_id: {
    type: String // Comma-separated sizes (e.g. "1,2,3...")
  },
  banglesize_id: {
    type: String
  },
  karat_id: {
    type: String // Comma-separated karats (e.g. "1,2")
  },
  metal_type: {
    type: String // Comma-separated metal types (e.g. "2,3")
  },
  gallery: {
    type: mongoose.Schema.Types.Mixed // Can store parsed JSON object or raw JSON string
  },
  height: {
    type: Number,
    default: 0
  },
  diamond_quality: {
    type: String
  },
  width: {
    type: Number,
    default: 0
  },
  noof_gem: {
    type: Number,
    default: 0
  },
  gold_weight: {
    type: Number,
    default: 0
  },
  diamond_weight: {
    type: Number,
    default: 0
  },
  diamond_count: {
    type: Number,
    default: 0
  },
  solitaires_weight: {
    type: Number,
    default: 0
  },
  solitaires_price: {
    type: Number,
    default: 0
  },

  solitaires_quality: {
    type: String
  },
  product_weight: {
    type: Number,
    default: 0
  },
  center_diamond_weight: {
    type: Number,
    default: null
  },
  center_diamond_price: {
    type: Number,
    default: null
  },
  custom_type: {
    type: String,
    default: "0"
  },
  color_stone: {
    type: String,
    default: null
  },
  gemstone_weight: {
    type: Number,
    default: 0
  },
  gemstone_price: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "1"
  },
  feature: {
    type: String,
    default: "0"
  },
  topselling: {
    type: String,
    default: "0"
  },
  sessional: {
    type: String,
    default: "0"
  },
  meta_title: {
    type: String
  },
  meta_keyword: {
    type: String
  },
  meta_description: {
    type: String
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  modify_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: "create_date",
    updatedAt: "modify_date"
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
