const sellGoldInquiryService = require('../services/sellGoldInquiryService');

class SellGoldInquiryController {
  getInquiries = async (req, res) => {
    try {
      const inquiries = await sellGoldInquiryService.getAllInquiries();
      return res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
      console.error('Get Sell Gold Inquiries Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve sell gold program inquiries' });
    }
  }

  getInquiryById = async (req, res) => {
    try {
      const inquiry = await sellGoldInquiryService.getInquiryById(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ success: false, message: 'Inquiry not found in database' });
      }
      return res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      console.error('Get Single Sell Gold Inquiry Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve inquiry details' });
    }
  }

  updateInquiryStatus = async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const inquiry = await sellGoldInquiryService.updateInquiryStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: 'Inquiry status successfully updated',
        data: inquiry
      });
    } catch (error) {
      console.error('Update Sell Gold Inquiry Status Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update inquiry status' });
    }
  }
}

module.exports = new SellGoldInquiryController();
