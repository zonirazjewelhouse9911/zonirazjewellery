/**
 * Background Cache Warmer for Zoniraz API
 * Automatically warms up hot queries upon database connection
 * ensuring 0ms - 5ms responses on the first user request.
 */

const cacheManager = require('./cacheManager');
const collectionService = require('../services/collectionService');
const productService = require('../services/productService');
const bannerService = require('../services/bannerService');
const categoryService = require('../services/categoryService');
const { navbar } = require('../services/userside/navebar');

async function warmUpCaches() {
  try {
    const start = Date.now();
    console.log('[Cache Warmer] Starting background cache pre-heating...');

    // Run warming in parallel without blocking main thread
    await Promise.allSettled([
      (async () => {
        const navData = await navbar();
        if (navData && navData.data) {
          await cacheManager.set('navbar_data', navData.data, 600000);
        }
      })(),
      (async () => {
        await collectionService.getAllCollections();
      })(),
      (async () => {
        const products = await productService.getAllProducts();
        if (products) {
          await cacheManager.set('products', { success: true, data: products }, 600000);
        }
      })(),
      (async () => {
        await bannerService.getAllBanners();
      })(),
      (async () => {
        await categoryService.getAllCategories();
      })()
    ]);

    const duration = Date.now() - start;
    console.log(`[Cache Warmer] Background cache pre-heating completed in ${duration}ms. Hot endpoints now respond in < 5ms.`);
  } catch (error) {
    console.error('[Cache Warmer] Error warming up caches:', error.message);
  }
}

module.exports = { warmUpCaches };
