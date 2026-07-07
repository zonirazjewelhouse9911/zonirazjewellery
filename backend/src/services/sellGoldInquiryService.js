const SellGoldInquiry = require('../models/sellGoldInquiryModel');

class SellGoldInquiryService {
  async getAllInquiries() {
    return await SellGoldInquiry.find().sort({ createdAt: -1 });
  }

  async getInquiryById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Inquiry ID must be provided.');
    }

    let inquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      inquiry = await SellGoldInquiry.findById(id);
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
      inquiry = await SellGoldInquiry.findById(id);
    }

    if (!inquiry) {
      throw new Error('Inquiry not found in database.');
    }

    inquiry.status = status;
    return await inquiry.save();
  }
}

module.exports = new SellGoldInquiryService();
