const Banner = require('../models/bannerModel');
const cacheManager = require('../utils/cacheManager');

class BannerService {
  async getAllBanners() {
    const cached = cacheManager.get('all_banners');
    if (cached) return cached;

    const banners = await Banner.find().sort({ createdAt: -1 }).lean();
    cacheManager.set('all_banners', banners, 300000); // 5 minutes cache
    return banners;
  }

  async createBanner(bannerData) {
    if (!bannerData.imageUrl) {
      throw new Error('Image URL is required.');
    }
    const banner = new Banner(bannerData);
    const saved = await banner.save();
    cacheManager.del('all_banners');
    return saved;
  }

  async deleteBanner(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Banner ID must be provided.');
    }
    const deleted = await Banner.findByIdAndDelete(id);
    cacheManager.del('all_banners');
    return deleted;
  }
}

module.exports = new BannerService();
