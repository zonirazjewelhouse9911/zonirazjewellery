const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      customization: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    }
  ]
}, {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
