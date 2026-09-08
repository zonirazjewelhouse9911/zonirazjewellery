const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

bannerSchema.index({ createdAt: -1 });

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
