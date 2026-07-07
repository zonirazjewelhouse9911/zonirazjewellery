const bannerService = require('../services/bannerService');

class BannerController {
  getBanners = async (req, res) => {
    try {
      const banners = await bannerService.getAllBanners();
      return res.status(200).json({ success: true, data: banners });
    } catch (error) {
      console.error('Get Banners Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch banners list' });
    }
  }

  createBanner = async (req, res) => {
    try {
      const banner = await bannerService.createBanner(req.body);
      return res.status(201).json({
        success: true,
        message: 'Banner successfully uploaded',
        data: banner
      });
    } catch (error) {
      console.error('Create Banner Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to upload banner' });
    }
  }

  deleteBanner = async (req, res) => {
    try {
      await bannerService.deleteBanner(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Banner successfully deleted'
      });
    } catch (error) {
      console.error('Delete Banner Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to delete banner' });
    }
  }
}

module.exports = new BannerController();
