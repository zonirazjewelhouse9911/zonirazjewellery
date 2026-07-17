const mongoose = require("mongoose");

const jewelleryPricingSchema = new mongoose.Schema({
  gold_rate_24k: {
    type: Number,
    required: true,
    default: 0
  },
  diamond_rate: {
    type: Number,
    required: true,
    default: 0
  },
  diamond_rate_ij_si: {
    type: Number,
    default: 0
  },
  diamond_rate_gh_vs: {
    type: Number,
    default: 0
  },
  diamond_rate_ef_vvs: {
    type: Number,
    default: 0
  },
  diamond_rate_fg_si: {
    type: Number,
    default: 0
  },
  gemstone_rate: {
    type: Number,
    default: 0
  },
  gst_percent: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

const JewelleryPricing = mongoose.model("JewelleryPricing", jewelleryPricingSchema);
module.exports = JewelleryPricing;
