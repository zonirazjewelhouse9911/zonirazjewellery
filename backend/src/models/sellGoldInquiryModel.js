const mongoose = require('mongoose');

const sellGoldInquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  jewelleryType: {
    type: String,
    default: '',
    trim: true
  },
  approximateWeight: {
    type: Number,
    default: 0
  },
  purity: {
    type: String,
    default: '',
    trim: true
  },
  knowsPurity: {
    type: Boolean,
    default: true
  },
  preferredVisitDate: {
    type: Date,
    default: null
  },
  preferredContactMethod: {
    type: String,
    enum: ['call', 'whatsapp', 'email'],
    default: 'call'
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  imageUrls: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'cancelled'],
    default: 'new'
  },
  branch: {
    type: String,
    default: 'Alwar',
    trim: true
  }
}, {
  timestamps: true // Auto-handles createdAt and updatedAt
});

const SellGoldInquiry = mongoose.model('sellgoldinquirie', sellGoldInquirySchema);
module.exports = SellGoldInquiry;
