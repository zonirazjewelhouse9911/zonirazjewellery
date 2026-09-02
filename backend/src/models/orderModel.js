const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String,
    default: null
  },
  configuration: {
    metal: {
      type: String,
      default: ''
    },
    purity: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    stone: {
      type: String,
      default: ''
    },
    grossWeight: {
      type: Number,
      default: 0
    },
    netWeight: {
      type: Number,
      default: 0
    }
  },
  customization: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  addressLine: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  shippingAddress: shippingAddressSchema,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'pending', 'processing', 'confirmed', 'accepted', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  digiGoldRedeemedAmount: {
    type: Number,
    default: 0
  },
  digiGoldRedeemedGrams: {
    type: Number,
    default: 0
  },
  giftCardAmountRedeemed: {
    type: Number,
    default: 0
  },
  timeline: {
    type: Array,
    default: []
  },
  deliveryMethod: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  storeDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

const order = mongoose.model('order', orderSchema);
module.exports = order;
