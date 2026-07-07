const mongoose = require('mongoose');

const exchangeInquirySchema = new mongoose.Schema({
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
  consultationType: {
    type: String,
    enum: ['phone', 'email', 'in-person', 'video'],
    default: 'phone'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'cancelled'],
    default: 'new'
  }
}, {
  timestamps: true // Auto-handles createdAt and updatedAt
});

const ExchangeInquiry = mongoose.model('exchangeinquiries', exchangeInquirySchema);
module.exports = ExchangeInquiry;
