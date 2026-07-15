const productService = require('../services/productService');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

class ProductController {
  getProducts = async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      return res.status(200).json({ success: true, data: products });
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
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'zoniraz',
          resource_type: 'auto'
        });

        uploadedFiles.push({
          filename: file.filename,
          url: result.secure_url
        });

        // Clean up the local temporary file
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (unlinkError) {
          console.error(`Failed to delete local temp file ${file.path}:`, unlinkError);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Files uploaded to Cloudinary successfully',
        data: uploadedFiles
      });
    } catch (error) {
      console.error('Upload Controller Error:', error);

      // Clean up any remaining temp files in case of upload failure
      if (req.files) {
        req.files.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (e) {
            console.error('Failed to clean up file after failure:', e);
          }
        });
      }

      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error during upload' });
    }
  }
}

module.exports = new ProductController();
