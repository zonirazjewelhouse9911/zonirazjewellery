const exchangeInquiryService = require('../services/exchangeInquiryService');

class ExchangeInquiryController {
  getInquiries = async (req, res) => {
    try {
      const inquiries = await exchangeInquiryService.getAllInquiries();
      return res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
      console.error('Get Inquiries Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve exchange program inquiries' });
    }
  }

  getInquiryById = async (req, res) => {
    try {
      const inquiry = await exchangeInquiryService.getInquiryById(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ success: false, message: 'Inquiry not found in database' });
      }
      return res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      console.error('Get Single Inquiry Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve inquiry details' });
    }
  }

  updateInquiryStatus = async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const inquiry = await exchangeInquiryService.updateInquiryStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: 'Inquiry status successfully updated',
        data: inquiry
      });
    } catch (error) {
      console.error('Update Inquiry Status Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update inquiry status' });
    }
  }
}

module.exports = new ExchangeInquiryController();
