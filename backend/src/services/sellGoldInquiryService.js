const SellGoldInquiry = require('../models/sellGoldInquiryModel');

class SellGoldInquiryService {
  async getAllInquiries({ page, limit, status } = {}) {
    let query = {};
    if (status) query.status = status;

    let queryBuilder = SellGoldInquiry.find(query).sort({ createdAt: -1 }).lean();

    if (page && limit) {
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Number(limit));
      const skip = (pageNum - 1) * limitNum;

      const [inquiries, total] = await Promise.all([
        queryBuilder.skip(skip).limit(limitNum),
        SellGoldInquiry.countDocuments(query)
      ]);

      return {
        inquiries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      };
    }

    return await queryBuilder;
  }

  async getInquiryById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Inquiry ID must be provided.');
    }

    let inquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      inquiry = await SellGoldInquiry.findById(id).lean();
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
