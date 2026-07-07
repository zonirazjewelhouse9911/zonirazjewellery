const Banner = require('../models/bannerModel');

class BannerService {
  async getAllBanners() {
    return await Banner.find().sort({ createdAt: -1 });
  }

  async createBanner(bannerData) {
    if (!bannerData.imageUrl) {
      throw new Error('Image URL is required.');
    }
    const banner = new Banner(bannerData);
    return await banner.save();
  }

  async deleteBanner(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Banner ID must be provided.');
    }
    return await Banner.findByIdAndDelete(id);
  }
}

module.exports = new BannerService();
