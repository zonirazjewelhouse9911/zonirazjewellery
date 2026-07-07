const ExchangeInquiry = require('../models/exchangeInquiryModel');

class ExchangeInquiryService {
  async getAllInquiries() {
    return await ExchangeInquiry.find().sort({ createdAt: -1 });
  }

  async getInquiryById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Inquiry ID must be provided.');
    }

    let inquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      inquiry = await ExchangeInquiry.findById(id);
    }
    return inquiry;
  }

  async updateInquiryStatus(id, status) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Inquiry ID must be provided.');
    }

    if (!['new', 'contacted', 'resolved', 'cancelled'].includes(status)) {
      throw new Error('Invalid status value provided.');
    }

    let inquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      inquiry = await ExchangeInquiry.findById(id);
    }

    if (!inquiry) {
      throw new Error('Inquiry not found in database.');
    }

    inquiry.status = status;
    return await inquiry.save();
  }
}

module.exports = new ExchangeInquiryService();
