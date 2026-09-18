const productService = require('../services/productService');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { generateSitemap } = require('../utils/sitemapGenerator');
const cacheManager = require('../utils/cacheManager');
const { uploadToMediaServer } = require('../services/mediaStorageService');

const productCache = new Map();

function invalidateProductCaches() {
  productCache.delete('products');
  cacheManager.del('navbar_data');
  cacheManager.del('all_collections');
  cacheManager.del('trending_products');
  cacheManager.del('product_base_pricing_all');
}

class ProductController {
  getProducts = async (req, res) => {
    try {
      if (productCache.has('products')) {
        return res.status(200).json(productCache.get('products'));
      }
      const products = await productService.getAllProducts();
      const payload = { success: true, data: products };
      productCache.set('products', payload);
      setTimeout(() => productCache.delete('products'), 5 * 60 * 1000);
      return res.status(200).json(payload);
    } catch (error) {
      console.error('Get Products Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
  }

  getProductById = async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(450).json({ success: false, message: 'Product not found in vault' });
      }
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error('Get Single Product Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve product details' });
    }
  }

  createProduct = async (req, res) => {
    try {
      const product = await productService.createProduct(req.body);
      invalidateProductCaches();
      generateSitemap().catch(err => console.error("Sitemap update error:", err));
      return res.status(201).json({
        success: true,
        message: 'Product successfully initialized in vault',
        data: product
      });
    } catch (error) {
      console.error('Create Product Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to create product' });
    }
  }

  updateProduct = async (req, res) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      invalidateProductCaches();
      generateSitemap().catch(err => console.error("Sitemap update error:", err));
      return res.status(200).json({
        success: true,
        message: 'Product successfully updated in vault',
        data: product
      });
    } catch (error) {
      console.error('Update Product Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update product' });
    }
  }

  uploadImages = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'No files uploaded' });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        // Stream directly to media.zoniraz.com VPS storage
        const uploaded = await uploadToMediaServer(file, 'zoniraz');
        uploadedFiles.push({
          filename: uploaded.filename,
          url: uploaded.url
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Files uploaded successfully to media storage',
        data: uploadedFiles
      });
    } catch (error) {
      console.error('Upload Controller Error:', error);
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error during upload' });
    }
  }

  deleteProduct = async (req, res) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      invalidateProductCaches();
      generateSitemap().catch(err => console.error("Sitemap update error:", err));
      return res.status(200).json({
        success: true,
        message: 'Product successfully deleted from vault',
        data: product
      });
    } catch (error) {
      console.error('Delete Product Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to delete product' });
    }
  }

  deleteMultipleProducts = async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide an array of product IDs to delete' });
      }
      const result = await productService.deleteMultipleProducts(ids);
      invalidateProductCaches();
      generateSitemap().catch(err => console.error("Sitemap update error:", err));
      return res.status(200).json({
        success: true,
        message: `${result.deletedCount || 0} product(s) successfully deleted from vault`,
        data: result
      });
    } catch (error) {
      console.error('Delete Multiple Products Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to delete products' });
    }
  }
}

module.exports = new ProductController();
